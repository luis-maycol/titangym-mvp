<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Client = 'client';

    /**
     * Get the human readable label shown in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrador',
            self::Client => 'Cliente',
        };
    }
}
