<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Mail\ContactMessageMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Contact page with the map and the message form.
     */
    public function show(): Response
    {
        return Inertia::render('site/contact');
    }

    /**
     * Email the visitor's message to the gym administrator.
     */
    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        Mail::to(config('titangym.notifications.admin_email'))
            ->send(new ContactMessageMail([
                'name' => $request->string('name')->value(),
                'email' => $request->string('email')->value(),
                'phone' => $request->filled('phone') ? $request->string('phone')->value() : null,
                'message' => $request->string('message')->value(),
            ]));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => '¡Gracias! Recibimos tu mensaje y te responderemos pronto.',
        ]);

        return to_route('contact');
    }
}
