<?php

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\PaymentReceipt;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function enrollmentAwaitingReview(array $planState = []): Enrollment
{
    $enrollment = Enrollment::factory()
        ->for(Plan::factory()->state($planState))
        ->create();
    PaymentReceipt::factory()->for($enrollment)->create();

    return $enrollment;
}

test('clients and guests cannot reach the admin panel', function (string $routeName) {
    $enrollment = enrollmentAwaitingReview();
    $parameters = str_contains($routeName, 'enrollments.show') ? [$enrollment] : [];

    $this->get(route($routeName, $parameters))->assertRedirect(route('login'));

    $this->actingAs($enrollment->user)
        ->get(route($routeName, $parameters))
        ->assertForbidden();
})->with(['admin.enrollments.index', 'admin.enrollments.show', 'admin.clients.index']);

test('clients cannot approve or reject enrollments', function () {
    $enrollment = enrollmentAwaitingReview();

    $this->actingAs($enrollment->user)
        ->post(route('admin.enrollments.approve', $enrollment))
        ->assertForbidden();

    $this->actingAs($enrollment->user)
        ->post(route('admin.enrollments.reject', $enrollment), ['reason' => 'x'])
        ->assertForbidden();

    expect($enrollment->fresh()->status)->toBe(EnrollmentStatus::Pending);
});

test('the pending queue lists the oldest enrollments first', function () {
    $admin = User::factory()->admin()->create();
    $older = enrollmentAwaitingReview();
    $newer = enrollmentAwaitingReview();
    Enrollment::factory()->active()->create();

    $this->actingAs($admin)
        ->get(route('admin.enrollments.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/enrollments/index')
            ->where('filters.status', 'pending')
            ->has('enrollments.data', 2)
            ->where('enrollments.data.0.id', $older->id)
            ->where('enrollments.data.1.id', $newer->id)
            ->where('enrollments.data.0.can_review', true)
            ->where('counts.pending', 2)
            ->where('counts.active', 1));
});

test('enrollments can be searched by client dni', function () {
    $admin = User::factory()->admin()->create();
    $match = enrollmentAwaitingReview();
    $match->user->profile()->create(['dni' => '70112233', 'phone' => '987654321']);
    enrollmentAwaitingReview();

    $this->actingAs($admin)
        ->get(route('admin.enrollments.index', ['search' => '7011']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('enrollments.data', 1)
            ->where('enrollments.data.0.id', $match->id));
});

test('an admin approves a payment and the membership starts today', function () {
    Carbon::setTestNow('2026-03-10 09:00:00');
    $admin = User::factory()->admin()->create();
    $enrollment = enrollmentAwaitingReview(['duration_months' => 3]);

    $this->actingAs($admin)
        ->post(route('admin.enrollments.approve', $enrollment))
        ->assertRedirect(route('admin.enrollments.index'));

    expect($enrollment->fresh())
        ->status->toBe(EnrollmentStatus::Active)
        ->starts_at->toDateString()->toBe('2026-03-10')
        ->ends_at->toDateString()->toBe('2026-06-09')
        ->reviewed_by->toBe($admin->id);
});

test('an admin rejects a receipt with a reason', function () {
    $admin = User::factory()->admin()->create();
    $enrollment = enrollmentAwaitingReview();

    $this->actingAs($admin)
        ->post(route('admin.enrollments.reject', $enrollment), ['reason' => 'Monto incorrecto'])
        ->assertRedirect(route('admin.enrollments.index'));

    expect($enrollment->fresh())
        ->status->toBe(EnrollmentStatus::Rejected)
        ->rejection_reason->toBe('Monto incorrecto');
});

test('rejecting requires a reason', function () {
    $admin = User::factory()->admin()->create();
    $enrollment = enrollmentAwaitingReview();

    $this->actingAs($admin)
        ->post(route('admin.enrollments.reject', $enrollment), ['reason' => ''])
        ->assertSessionHasErrors('reason');

    expect($enrollment->fresh()->status)->toBe(EnrollmentStatus::Pending);
});

test('only pending enrollments with a receipt can be reviewed', function (Enrollment $enrollment) {
    $admin = User::factory()->admin()->create();
    $originalStatus = $enrollment->status;

    $this->actingAs($admin)
        ->post(route('admin.enrollments.approve', $enrollment))
        ->assertForbidden();

    expect($enrollment->fresh()->status)->toBe($originalStatus);
})->with([
    'pending without receipt' => fn () => Enrollment::factory()->create(),
    'already active' => fn () => Enrollment::factory()->active()->create(),
    'rejected' => fn () => Enrollment::factory()->rejected()->create(),
]);

test('a rejected client can upload again and the enrollment returns to the review queue', function () {
    Storage::fake('local');
    $admin = User::factory()->admin()->create();
    $enrollment = enrollmentAwaitingReview();

    $this->actingAs($admin)->post(route('admin.enrollments.reject', $enrollment), ['reason' => 'Ilegible']);

    $this->actingAs($enrollment->user)
        ->post(route('enrollments.receipts.store', $enrollment), [
            'receipt' => UploadedFile::fake()->image('nuevo.png'),
        ])
        ->assertRedirect();

    $this->actingAs($admin)
        ->post(route('admin.enrollments.approve', $enrollment))
        ->assertRedirect();

    expect($enrollment->fresh()->status)->toBe(EnrollmentStatus::Active);
});

test('admins can view the private receipt image', function () {
    Storage::fake('local');
    $admin = User::factory()->admin()->create();
    $path = UploadedFile::fake()->image('yape.png')->store('receipts/1', 'local');
    $receipt = PaymentReceipt::factory()->create(['path' => $path, 'mime_type' => 'image/png']);

    $this->actingAs($admin)
        ->get(route('admin.receipts.show', $receipt))
        ->assertOk()
        ->assertHeader('Content-Type', 'image/png');

    $this->actingAs($receipt->enrollment->user)
        ->get(route('admin.receipts.show', $receipt))
        ->assertForbidden();
});
