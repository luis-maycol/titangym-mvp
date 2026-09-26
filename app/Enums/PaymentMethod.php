<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Yape = 'yape';
    case Cash = 'cash';

    /**
     * Get the human readable label shown in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Yape => 'Yape',
            self::Cash => 'Presencial',
        };
    }
}
