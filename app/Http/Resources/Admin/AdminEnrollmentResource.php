<?php

namespace App\Http\Resources\Admin;

use App\Models\Enrollment;
use App\Models\PaymentReceipt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Enrollment
 */
class AdminEnrollmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'is_expired' => $this->isExpired(),
            'amount' => $this->amount,
            'payment_method' => $this->payment_method->value,
            'payment_method_label' => $this->payment_method->label(),
            'starts_at' => $this->starts_at?->toDateString(),
            'ends_at' => $this->ends_at?->toDateString(),
            'rejection_reason' => $this->rejection_reason,
            'created_at' => $this->created_at?->toIso8601String(),
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'reviewer' => $this->whenLoaded('reviewer', fn () => $this->reviewer?->name),
            'client' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'dni' => $this->user->profile?->dni,
                'phone' => $this->user->profile?->phone,
            ],
            'plan' => [
                'name' => $this->plan->name,
                'duration_months' => $this->plan->duration_months,
            ],
            'receipt' => $this->whenLoaded('receipt', fn () => $this->receipt ? self::receipt($this->receipt) : null),
            'receipts' => $this->whenLoaded('receipts', fn () => $this->receipts->map(self::receipt(...))->all()),
            'can_review' => $request->user()?->can('review', $this->resource) ?? false,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function receipt(PaymentReceipt $receipt): array
    {
        return [
            'id' => $receipt->id,
            'url' => route('admin.receipts.show', $receipt),
            'original_name' => $receipt->original_name,
            'operation_code' => $receipt->operation_code,
            'uploaded_at' => $receipt->created_at?->toIso8601String(),
        ];
    }
}
