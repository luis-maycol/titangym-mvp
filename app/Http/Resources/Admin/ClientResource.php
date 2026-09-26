<?php

namespace App\Http\Resources\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $membership = $this->latestMembership;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'dni' => $this->profile?->dni,
            'phone' => $this->profile?->phone,
            'registered_at' => $this->created_at?->toIso8601String(),
            'membership' => $membership === null ? null : [
                'enrollment_id' => $membership->id,
                'plan' => $membership->plan->name,
                'starts_at' => $membership->starts_at?->toDateString(),
                'ends_at' => $membership->ends_at?->toDateString(),
                'is_expired' => $membership->isExpired(),
                'days_left' => $membership->isExpired() ? 0 : (int) today()->diffInDays($membership->ends_at),
            ],
        ];
    }
}
