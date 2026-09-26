<?php

use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Enrollment;
use App\Models\PaymentReceipt;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Support\Carbon;

test('new users are clients by default', function () {
    $user = User::factory()->create();

    expect($user->fresh()->role)->toBe(UserRole::Client)
        ->and($user->isAdmin())->toBeFalse();
});

test('new enrollments start as pending', function () {
    $plan = Plan::factory()->create();

    $enrollment = User::factory()->create()->enrollments()->create([
        'plan_id' => $plan->id,
        'amount' => $plan->price,
    ]);

    expect($enrollment->fresh()->status)->toBe(EnrollmentStatus::Pending);
});

test('approving activates the membership for the plan duration', function (int $months, string $expectedEndsAt) {
    Carbon::setTestNow('2026-01-31 10:00:00');
    $admin = User::factory()->admin()->create();
    $enrollment = Enrollment::factory()
        ->for(Plan::factory()->state(['duration_months' => $months]))
        ->create();

    $enrollment->approve($admin);

    expect($enrollment->fresh())
        ->status->toBe(EnrollmentStatus::Active)
        ->starts_at->toDateString()->toBe('2026-01-31')
        ->ends_at->toDateString()->toBe($expectedEndsAt)
        ->reviewed_by->toBe($admin->id);
})->with([
    'monthly' => [1, '2026-02-27'],
    'yearly' => [12, '2027-01-30'],
]);

test('rejecting stores the reason and a resubmission returns it to pending', function () {
    $admin = User::factory()->admin()->create();
    $enrollment = Enrollment::factory()->create();

    $enrollment->reject($admin, 'Captura ilegible');

    expect($enrollment->fresh())
        ->status->toBe(EnrollmentStatus::Rejected)
        ->rejection_reason->toBe('Captura ilegible');

    $enrollment->resubmit();

    expect($enrollment->fresh())
        ->status->toBe(EnrollmentStatus::Pending)
        ->reviewed_by->toBeNull();
});

test('the current receipt is the latest upload', function () {
    $enrollment = Enrollment::factory()->rejected()->create();
    PaymentReceipt::factory()->for($enrollment)->create();
    $latest = PaymentReceipt::factory()->for($enrollment)->create();

    expect($enrollment->receipt->id)->toBe($latest->id)
        ->and($enrollment->receipts)->toHaveCount(2);
});

test('only approved and unexpired enrollments count as the current membership', function () {
    $user = User::factory()->create();
    Enrollment::factory()->for($user)->create();
    Enrollment::factory()->for($user)->rejected()->create();
    $expired = Enrollment::factory()->for($user)->expired()->create();
    $active = Enrollment::factory()->for($user)->active()->create();

    expect($user->currentEnrollment->id)->toBe($active->id)
        ->and(Enrollment::current()->pluck('id')->all())->toBe([$active->id])
        ->and($expired->isExpired())->toBeTrue();
});
