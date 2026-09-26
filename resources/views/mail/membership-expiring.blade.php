<x-mail::message>
# ¡Hola, {{ $clientName }}!

Tu membresía **{{ $planName }}** vence en **{{ $daysLeft }} {{ $daysLeft === 1 ? 'día' : 'días' }}**, el **{{ $endsAt }}**.

Renueva a tiempo para seguir entrenando sin interrupciones. Puedes hacerlo en línea con Yape o en la recepción del gimnasio.

<x-mail::button :url="$renewUrl">
Renovar mi membresía
</x-mail::button>

¡Te esperamos en el gym!<br>
El equipo de {{ config('app.name') }}
</x-mail::message>
