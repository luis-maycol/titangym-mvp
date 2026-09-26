<?php

use App\Enums\EnrollmentStatus;
use App\Enums\PaymentMethod;
use App\Models\Enrollment;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

test('an admin enrolls a new walk-in client with an active membership', function () {
    Notification::fake();
    Carbon::setTestNow('2026-04-15 18:00:00');
    $plan = Plan::factory()->create(['duration_months' => 1, 'price' => 80]);

    $this->actingAs($this->admin)
        ->post(route('admin.enrollments.store'), [
            'client_type' => 'new',
            'plan_id' => $plan->id,
            'name' => 'Luis Ramos',
            'email' => 'luis@example.com',
            'dni' => '41234567',
            'phone' => '912345678',
        ])
        ->assertRedirect();

    $client = User::where('email', 'luis@example.com')->firstOrFail();
    $enrollment = $client->enrollments()->sole();

    expect($client->isClient())->toBeTrue()
        ->and($client->profile->dni)->toBe('41234567')
        ->and($enrollment)
        ->status->toBe(EnrollmentStatus::Active)
        ->payment_method->toBe(PaymentMethod::Cash)
        ->amount->toBe('80.00')
        ->starts_at->toDateString()->toBe('2026-04-15')
        ->ends_at->toDateString()->toBe('2026-05-14')
        ->reviewed_by->toBe($this->admin->id);

    Notification::assertSentTo($client, ResetPassword::class);
});

test('an admin enrolls an existing client without a running membership', function () {
    $client = User::factory()->hasProfile()->create();
    Enrollment::factory()->for($client)->expired()->create();
    $plan = Plan::factory()->create();

    $this->actingAs($this->admin)
        ->post(route('admin.enrollments.store'), [
            'client_type' => 'existing',
            'user_id' => $client->id,
            'plan_id' => $plan->id,
        ])
        ->assertRedirect();

    expect($client->fresh()->currentEnrollment)
        ->not->toBeNull()
        ->payment_method->toBe(PaymentMethod::Cash);
});

test('existing clients with a running or open enrollment cannot be enrolled again', function (string $state) {
    $client = User::factory()->hasProfile()->create();
    Enrollment::factory()->for($client)->{$state}()->create();

    $this->actingAs($this->admin)
        ->post(route('admin.enrollments.store'), [
            'client_type' => 'existing',
            'user_id' => $client->id,
            'plan_id' => Plan::factory()->create()->id,
        ])
        ->assertSessionHasErrors('user_id');

    expect($client->enrollments()->count())->toBe(1);
})->with(['active', 'pending', 'rejected']);

test('manual enrollment validates the plan and the client', function (array $payload, string $field) {
    $payload = [
        'client_type' => 'existing',
        'plan_id' => Plan::factory()->create()->id,
        ...$payload,
    ];

    $this->actingAs($this->admin)
        ->post(route('admin.enrollments.store'), $payload)
        ->assertSessionHasErrors($field);

    expect(Enrollment::count())->toBe(0);
})->with([
    'inactive plan' => [fn () => ['plan_id' => Plan::factory()->inactive()->create()->id, 'user_id' => User::factory()->create()->id], 'plan_id'],
    'admin as client' => [fn () => ['user_id' => User::factory()->admin()->create()->id], 'user_id'],
    'missing new client dni' => [['client_type' => 'new', 'name' => 'Ana', 'email' => 'ana@example.com', 'phone' => '987654321'], 'dni'],
]);

test('the form searches clients by dni', function () {
    $match = User::factory()->create(['name' => 'Rosa Pérez']);
    $match->profile()->create(['dni' => '48887777', 'phone' => '987654321']);
    User::factory()->hasProfile()->create();

    $this->actingAs($this->admin)
        ->get(route('admin.enrollments.create', ['search' => '4888']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/enrollments/create')
            ->has('clients', 1)
            ->where('clients.0.id', $match->id));
});

test('clients cannot register manual enrollments', function () {
    $client = User::factory()->create();

    $this->actingAs($client)->get(route('admin.enrollments.create'))->assertForbidden();
    $this->actingAs($client)
        ->post(route('admin.enrollments.store'), [
            'client_type' => 'existing',
            'user_id' => $client->id,
            'plan_id' => Plan::factory()->create()->id,
        ])
        ->assertForbidden();
});
