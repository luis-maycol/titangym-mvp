<?php

use App\Mail\MembershipExpiringMail;
use App\Models\Enrollment;
use Illuminate\Console\Scheduling\Event;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
});

test('clients whose membership ends in exactly three days get one reminder', function () {
    $expiring = Enrollment::factory()->active()->create(['ends_at' => today()->addDays(3)]);
    Enrollment::factory()->active()->create(['ends_at' => today()->addDays(2)]);
    Enrollment::factory()->active()->create(['ends_at' => today()->addDays(4)]);
    Enrollment::factory()->create(['ends_at' => today()->addDays(3)]);

    $this->artisan('memberships:send-expiry-reminders')->assertSuccessful();

    Mail::assertSent(MembershipExpiringMail::class, 1);
    Mail::assertSent(MembershipExpiringMail::class, fn (MembershipExpiringMail $mail) => $mail->hasTo($expiring->user->email)
        && $mail->enrollment->is($expiring));
    expect($expiring->fresh()->expiry_reminder_sent_at)->not->toBeNull();
});

test('running the command twice does not send duplicate reminders', function () {
    Enrollment::factory()->active()->create(['ends_at' => today()->addDays(3)]);

    $this->artisan('memberships:send-expiry-reminders')->assertSuccessful();
    $this->artisan('memberships:send-expiry-reminders')->assertSuccessful();

    Mail::assertSent(MembershipExpiringMail::class, 1);
});

test('clients who already renewed are not reminded', function () {
    $expiring = Enrollment::factory()->active()->create(['ends_at' => today()->addDays(3)]);
    Enrollment::factory()->for($expiring->user)->active()->create(['ends_at' => today()->addMonth()]);

    $this->artisan('memberships:send-expiry-reminders')->assertSuccessful();

    Mail::assertNothingSent();
});

test('the reminder mail mentions the plan and the end date', function () {
    $enrollment = Enrollment::factory()->active()->create(['ends_at' => today()->addDays(3)]);

    (new MembershipExpiringMail($enrollment))
        ->assertSeeInHtml($enrollment->plan->name)
        ->assertSeeInHtml($enrollment->ends_at->format('d/m/Y'))
        ->assertSeeInHtml(route('plans.index'));
});

test('the reminder runs daily at 8 a.m. Lima time', function () {
    $event = collect(app(Schedule::class)->events())
        ->first(fn (Event $event) => str_contains($event->command, 'memberships:send-expiry-reminders'));

    expect($event)->not->toBeNull()
        ->and($event->expression)->toBe('0 8 * * *')
        ->and($event->timezone)->toBe('America/Lima');
});
