<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Recordatorio de vencimiento de membresías
|--------------------------------------------------------------------------
|
| Todos los días a las 8:00 a. m. (hora de Lima) avisa por correo a los
| clientes cuya membresía vence en 3 días. onOneServer() evita correos
| duplicados cuando la app corre en varias instancias detrás del balanceador.
|
*/

Schedule::command('memberships:send-expiry-reminders')
    ->dailyAt('08:00')
    ->timezone('America/Lima')
    ->withoutOverlapping()
    ->onOneServer();
