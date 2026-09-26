<?php

use App\Mail\ContactMessageMail;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Mail::fake();
    config(['titangym.notifications.admin_email' => 'admin@titangym.pe']);
});

/**
 * @return array<string, string>
 */
function contactData(array $overrides = []): array
{
    return [
        'name' => 'María López',
        'email' => 'maria@example.com',
        'phone' => '987654321',
        'message' => '¿Tienen clases de spinning los sábados?',
        ...$overrides,
    ];
}

test('the contact page shows the map', function () {
    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/contact')
            ->where('gym.maps_embed_url', config('titangym.contact.maps_embed_url')));
});

test('a visitor message is emailed to the administrator', function () {
    $this->post(route('contact.store'), contactData())
        ->assertRedirect(route('contact'))
        ->assertSessionHasNoErrors();

    Mail::assertSent(ContactMessageMail::class, fn (ContactMessageMail $mail) => $mail->hasTo('admin@titangym.pe')
        && $mail->hasReplyTo('maria@example.com')
        && $mail->contact['message'] === '¿Tienen clases de spinning los sábados?');
});

test('the contact form is validated', function (array $overrides, string $field) {
    $this->post(route('contact.store'), contactData($overrides))
        ->assertSessionHasErrors($field);

    Mail::assertNothingSent();
})->with([
    'missing email' => [['email' => ''], 'email'],
    'short message' => [['message' => 'Hola'], 'message'],
    'invalid phone' => [['phone' => '12345'], 'phone'],
    'bot filled the honeypot' => [['website' => 'https://spam.example'], 'website'],
]);
