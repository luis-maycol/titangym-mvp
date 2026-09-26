<?php

namespace App\Enums;

enum EnrollmentStatus: string
{
    case Pending = 'pending';
    case Active = 'active';
    case Rejected = 'rejected';

    /**
     * Get the human readable label shown in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendiente',
            self::Active => 'Activa',
            self::Rejected => 'Rechazado',
        };
    }
}
