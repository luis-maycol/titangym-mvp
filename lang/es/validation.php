<?php

/*
|--------------------------------------------------------------------------
| Mensajes de validación en español
|--------------------------------------------------------------------------
|
| Solo se traducen las reglas que usa TitanGym; cualquier otra clave cae al
| idioma de respaldo (inglés) definido en config/app.php.
|
*/

return [
    'confirmed' => 'La confirmación del campo :attribute no coincide.',
    'date' => 'El campo :attribute no es una fecha válida.',
    'digits' => 'El campo :attribute debe tener :digits dígitos.',
    'email' => 'El campo :attribute debe ser un correo electrónico válido.',
    'exists' => 'El valor del campo :attribute no es válido.',
    'image' => 'El campo :attribute debe ser una imagen.',
    'lowercase' => 'El campo :attribute debe estar en minúsculas.',
    'max' => [
        'file' => 'El campo :attribute no debe pesar más de :max kilobytes.',
        'numeric' => 'El campo :attribute no debe ser mayor que :max.',
        'string' => 'El campo :attribute no debe tener más de :max caracteres.',
    ],
    'mimes' => 'El campo :attribute debe ser un archivo de tipo: :values.',
    'min' => [
        'numeric' => 'El campo :attribute debe ser al menos :min.',
        'string' => 'El campo :attribute debe tener al menos :min caracteres.',
    ],
    'password' => [
        'letters' => 'El campo :attribute debe contener al menos una letra.',
        'mixed' => 'El campo :attribute debe contener al menos una mayúscula y una minúscula.',
        'numbers' => 'El campo :attribute debe contener al menos un número.',
        'symbols' => 'El campo :attribute debe contener al menos un símbolo.',
        'uncompromised' => 'El valor del campo :attribute apareció en una filtración de datos. Elige otro.',
    ],
    'regex' => 'El formato del campo :attribute no es válido.',
    'required' => 'El campo :attribute es obligatorio.',
    'string' => 'El campo :attribute debe ser un texto.',
    'unique' => 'El valor del campo :attribute ya está registrado.',
    'uploaded' => 'El campo :attribute no se pudo subir.',

    'attributes' => [
        'name' => 'nombre',
        'email' => 'correo electrónico',
        'password' => 'contraseña',
        'dni' => 'DNI',
        'phone' => 'celular',
        'receipt' => 'captura de Yape',
        'operation_code' => 'número de operación',
    ],
];
