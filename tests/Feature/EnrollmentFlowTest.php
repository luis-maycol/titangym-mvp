<?php

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\Plan;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * @return array<string, string>
 */
function guestEnrollmentData(array $overrides = []): array
{
    return [
        'name' => 'Ana Quispe',
        'email' => 'ana@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'dni' => '45678912',
        'phone' => '987654321',
        ...$overrides,
    ];
}

test('guests see the registration form for an active plan', function () {
    $plan = Plan::factory()->create();

    $this->get(route('enrollments.create', $plan))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('enrollments/create')
            ->where('plan.slug', $plan->slug)
            ->where('needsAccount', true)
            ->where('needsProfile', true));
});

test('inactive plans cannot be enrolled in', function () {
    $plan = Plan::factory()->inactive()->create();

    $this->get(route('enrollments.create', $plan))->assertNotFound();
    $this->post(route('enrollments.store', $plan), guestEnrollmentData())->assertNotFound();

    expect(User::count())->toBe(0);
});

test('a guest registers, gets a pending enrollment at the plan price and is logged in', function () {
    Event::fake([Registered::class]);
    $plan = Plan::factory()->create(['price' => 210]);

    $response = $this->post(route('enrollments.store', $plan), guestEnrollmentData());

    $user = User::where('email', 'ana@example.com')->firstOrFail();
    $enrollment = $user->enrollments()->sole();

    $response->assertRedirect(route('enrollments.show', $enrollment));
    $this->assertAuthenticatedAs($user);
    Event::assertDispatched(Registered::class);

    expect($user->isClient())->toBeTrue()
        ->and($user->profile)->dni->toBe('45678912')->phone->toBe('987654321')
        ->and($enrollment)
        ->plan_id->toBe($plan->id)
        ->status->toBe(EnrollmentStatus::Pending)
        ->amount->toBe('210.00');
});

test('guest registration is rejected with invalid data', function (array $overrides, string $field) {
    Profile::factory()->create(['dni' => '11111111']);
    $plan = Plan::factory()->create();

    $this->post(route('enrollments.store', $plan), guestEnrollmentData($overrides))
        ->assertSessionHasErrors($field);

    $this->assertGuest();
    expect(Enrollment::count())->toBe(0);
})->with([
    'duplicate dni' => [['dni' => '11111111'], 'dni'],
    'short dni' => [['dni' => '1234'], 'dni'],
    'phone not starting with 9' => [['phone' => '812345678'], 'phone'],
    'password mismatch' => [['password_confirmation' => 'otra-clave'], 'password'],
]);

test('a client without a profile only fills in dni and phone', function () {
    $user = User::factory()->create();
    $plan = Plan::factory()->create();

    $this->actingAs($user)
        ->post(route('enrollments.store', $plan), ['dni' => '45678912', 'phone' => '987654321'])
        ->assertRedirect();

    expect($user->fresh()->profile)->not->toBeNull()
        ->and($user->enrollments()->count())->toBe(1);
});

test('a client with an open enrollment is sent back to it instead of creating another', function (string $state) {
    $user = User::factory()->hasProfile()->create();
    $open = Enrollment::factory()->for($user)->{$state}()->create();
    $plan = Plan::factory()->create();

    $this->actingAs($user)
        ->post(route('enrollments.store', $plan))
        ->assertRedirect(route('enrollments.show', $open));

    expect($user->enrollments()->count())->toBe(1);
})->with(['pending' => 'pending', 'rejected' => 'rejected']);

test('a client with a running membership cannot enroll again', function () {
    $user = User::factory()->hasProfile()->create();
    Enrollment::factory()->for($user)->active()->create();

    $this->actingAs($user)
        ->get(route('enrollments.create', Plan::factory()->create()))
        ->assertRedirect(route('dashboard'));
});

test('admins cannot enroll', function () {
    $plan = Plan::factory()->create();

    $this->actingAs(User::factory()->admin()->create())
        ->post(route('enrollments.store', $plan))
        ->assertForbidden();
});

test('clients cannot view another client enrollment', function () {
    $enrollment = Enrollment::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('enrollments.show', $enrollment))
        ->assertForbidden();
});

test('the owner sees the payment page with the Yape details', function () {
    config(['titangym.yape.phone' => '912 345 678']);
    $enrollment = Enrollment::factory()->create();

    $this->actingAs($enrollment->user)
        ->get(route('enrollments.show', $enrollment))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('enrollments/show')
            ->where('enrollment.id', $enrollment->id)
            ->where('enrollment.can_upload_receipt', true)
            ->where('yape.phone', '912 345 678'));
});
