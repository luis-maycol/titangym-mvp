<?php

namespace App\Console\Commands;

use App\Enums\EnrollmentStatus;
use App\Mail\MembershipExpiringMail;
use App\Models\Enrollment;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Mail;

#[Signature('memberships:send-expiry-reminders {--days=3 : Días de anticipación al vencimiento}')]
#[Description('Envía un correo a los clientes cuya membresía vence exactamente en N días (3 por defecto)')]
class SendMembershipExpiryReminders extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = max(1, (int) $this->option('days'));
        $expiresOn = today()->addDays($days);
        $sent = 0;

        Enrollment::query()
            ->where('status', EnrollmentStatus::Active)
            ->whereDate('ends_at', $expiresOn)
            ->whereNull('expiry_reminder_sent_at')
            ->with(['user', 'plan'])
            ->chunkById(100, function (Collection $enrollments) use (&$sent) {
                foreach ($enrollments as $enrollment) {
                    if ($this->alreadyRenewed($enrollment)) {
                        continue;
                    }

                    Mail::to($enrollment->user)->send(new MembershipExpiringMail($enrollment));

                    $enrollment->forceFill(['expiry_reminder_sent_at' => now()])->save();
                    $sent++;
                }
            });

        $this->components->info("Recordatorios enviados: {$sent} (membresías que vencen el {$expiresOn->format('d/m/Y')}).");

        return self::SUCCESS;
    }

    /**
     * Skip clients who already have a newer membership running past this one.
     */
    private function alreadyRenewed(Enrollment $enrollment): bool
    {
        return Enrollment::query()
            ->where('user_id', $enrollment->user_id)
            ->whereKeyNot($enrollment->id)
            ->where('status', EnrollmentStatus::Active)
            ->whereDate('ends_at', '>', $enrollment->ends_at)
            ->exists();
    }
}
