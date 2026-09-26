<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array{name: string, email: string, phone?: string|null, message: string}  $contact
     */
    public function __construct(public array $contact) {}

    /**
     * Replies go straight to the visitor.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->contact['email'], $this->contact['name'])],
            subject: 'Nuevo mensaje de contacto: '.$this->contact['name'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.contact-message',
            with: ['contact' => $this->contact],
        );
    }
}
