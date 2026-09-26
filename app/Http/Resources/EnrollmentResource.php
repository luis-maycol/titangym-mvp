<?php

namespace App\Http\Resources;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Enrollment
 */
class EnrollmentResource extends JsonResource
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
            'starts_at' => $this->starts_at?->toDateString(),
            'ends_at' => $this->ends_at?->toDateString(),
            'rejection_reason' => $this->rejection_reason,
            'created_at' => $this->created_at?->toIso8601String(),
            'plan' => [
                'name' => $this->plan->name,
                'duration_months' => $this->plan->duration_months,
            ],
            'receipt' => $this->whenLoaded('receipt', fn () => $this->receipt === null ? null : [
                'operation_code' => $this->receipt->operation_code,
                'uploaded_at' => $this->receipt->created_at?->toIso8601String(),
            ]),
            'can_upload_receipt' => $request->user()?->can('uploadReceipt', $this->resource) ?? false,
        ];
    }
}
