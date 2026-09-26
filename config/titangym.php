<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Datos de contacto del gimnasio
    |--------------------------------------------------------------------------
    |
    | Se muestran en el pie de página y en la página "Nosotros".
    |
    */

    'contact' => [
        'address' => env('GYM_ADDRESS', 'Jr. 28 de Julio 245, Ayacucho'),
        'maps_url' => env('GYM_MAPS_URL', 'https://maps.google.com/?q=Ayacucho+Peru'),
        'maps_embed_url' => env('GYM_MAPS_EMBED_URL', 'https://www.google.com/maps?q=Plaza+de+Armas+Ayacucho+Peru&z=16&output=embed'),
        'phone' => env('GYM_PHONE', '999 999 999'),
        'whatsapp' => env('GYM_WHATSAPP', '51999999999'),
        'email' => env('GYM_EMAIL', 'hola@titangym.pe'),
        'hours' => [
            ['days' => 'Lunes a viernes', 'time' => '5:30 a. m. – 10:30 p. m.'],
            ['days' => 'Sábados', 'time' => '7:00 a. m. – 8:00 p. m.'],
            ['days' => 'Domingos y feriados', 'time' => '8:00 a. m. – 1:00 p. m.'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Notificaciones internas
    |--------------------------------------------------------------------------
    |
    | Correo del administrador que recibe los mensajes del formulario de
    | contacto. No se comparte con el frontend.
    |
    */

    'notifications' => [
        'admin_email' => env('GYM_ADMIN_EMAIL', env('GYM_EMAIL', 'hola@titangym.pe')),
    ],

    /*
    |--------------------------------------------------------------------------
    | Imágenes públicas (CDN)
    |--------------------------------------------------------------------------
    |
    | Las fotos de entrenadores e instalaciones viven en public/images/site y se
    | sirven a través de la CDN (Cloudflare). "url" es el origen de la CDN
    | (por defecto ASSET_URL o APP_URL). Si activas Image Resizing en
    | Cloudflare, pon CDN_IMAGE_RESIZING=true y las imágenes se pedirán
    | redimensionadas y en WebP/AVIF vía /cdn-cgi/image/.
    |
    */

    'cdn' => [
        'url' => env('CDN_URL', env('ASSET_URL')),
        'image_resizing' => (bool) env('CDN_IMAGE_RESIZING', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Yape (pago manual)
    |--------------------------------------------------------------------------
    |
    | Datos de la cuenta Yape del negocio que se muestran al cliente junto al
    | código QR estático. Coloca la imagen del QR en public/images/yape-qr.png
    | (o cambia la ruta). Se sirve con asset(), por lo que respeta ASSET_URL
    | cuando los estáticos se entregan desde la CDN.
    |
    */

    'yape' => [
        'phone' => env('YAPE_PHONE', '999 999 999'),
        'holder' => env('YAPE_HOLDER', 'TitanGym E.I.R.L.'),
        'qr_path' => env('YAPE_QR_PATH', 'images/yape-qr.png'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Comprobantes de pago
    |--------------------------------------------------------------------------
    |
    | Disco donde se guardan las capturas de Yape. Por defecto es el disco
    | privado "local"; en producción puede apuntar a "s3". Las capturas nunca
    | deben guardarse en un disco público porque contienen datos del cliente.
    |
    */

    'receipts' => [
        'disk' => env('RECEIPTS_DISK', 'local'),
        'max_kilobytes' => 5120,
    ],

];
