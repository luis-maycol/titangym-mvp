<x-mail::message>
# Nuevo mensaje desde la web

<x-mail::panel>
**Nombre:** {{ $contact['name'] }}<br>
**Correo:** {{ $contact['email'] }}<br>
**Celular:** {{ $contact['phone'] ?? 'No indicado' }}
</x-mail::panel>

{{ $contact['message'] }}

Responde este correo para contestarle directamente.
</x-mail::message>
