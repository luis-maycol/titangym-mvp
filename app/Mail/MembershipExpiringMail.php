<?php

namespace App\Mail;

use App\Models\Enrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MembershipExpiringMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public Enrollment $enrollment) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu membresía de '.config('app.name').' vence pronto',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.membership-expiring',
            with: [
                'clientName' => $this->enrollment->user->name,
                'planName' => $this->enrollment->plan->name,
                'endsAt' => $this->enrollment->ends_at->format('d/m/Y'),
                'daysLeft' => (int) today()->diffInDays($this->enrollment->ends_at),
                'renewUrl' => route('plans.index'),
            ],
        );
    }
}
