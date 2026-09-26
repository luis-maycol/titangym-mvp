<?php

namespace App\Models;

use App\Enums\EnrollmentStatus;
use App\Enums\PaymentMethod;
use Database\Factories\EnrollmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $plan_id
 * @property EnrollmentStatus $status
 * @property string $amount
 * @property PaymentMethod $payment_method
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 * @property int|null $reviewed_by
 * @property Carbon|null $reviewed_at
 * @property string|null $rejection_reason
 * @property Carbon|null $expiry_reminder_sent_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['plan_id', 'amount', 'payment_method'])]
class Enrollment extends Model
{
    /** @use HasFactory<EnrollmentFactory> */
    use HasFactory;

    /**
     * Every new enrollment starts as "Pendiente" until an admin reviews it.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'status' => 'pending',
        'payment_method' => 'yape',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => EnrollmentStatus::class,
            'amount' => 'decimal:2',
            'payment_method' => PaymentMethod::class,
            'starts_at' => 'date',
            'ends_at' => 'date',
            'reviewed_at' => 'datetime',
            'expiry_reminder_sent_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Plan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Get the administrator who approved or rejected the enrollment.
     *
     * @return BelongsTo<User, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Every Yape receipt uploaded for this enrollment, including rejected ones.
     *
     * @return HasMany<PaymentReceipt, $this>
     */
    public function receipts(): HasMany
    {
        return $this->hasMany(PaymentReceipt::class);
    }

    /**
     * The receipt currently under review (the most recent upload).
     *
     * @return HasOne<PaymentReceipt, $this>
     */
    public function receipt(): HasOne
    {
        return $this->hasOne(PaymentReceipt::class)->latestOfMany();
    }

    /**
     * @param  Builder<Enrollment>  $query
     */
    #[Scope]
    protected function pending(Builder $query): void
    {
        $query->where('status', EnrollmentStatus::Pending);
    }

    /**
     * Approved enrollments whose membership has not expired yet.
     *
     * @param  Builder<Enrollment>  $query
     */
    #[Scope]
    protected function current(Builder $query): void
    {
        $query->where('status', EnrollmentStatus::Active)
            ->whereDate('ends_at', '>=', today());
    }

    /**
     * Approve the payment and activate the membership starting today.
     */
    public function approve(User $admin): void
    {
        $startsAt = today();

        $this->forceFill([
            'status' => EnrollmentStatus::Active,
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->copy()->addMonthsNoOverflow($this->plan->duration_months)->subDay(),
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ])->save();
    }

    /**
     * Reject the payment receipt; the client may upload a new one afterwards.
     */
    public function reject(User $admin, ?string $reason = null): void
    {
        $this->forceFill([
            'status' => EnrollmentStatus::Rejected,
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ])->save();
    }

    /**
     * Put a rejected enrollment back under review after a new receipt is uploaded.
     */
    public function resubmit(): void
    {
        $this->forceFill([
            'status' => EnrollmentStatus::Pending,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ])->save();
    }

    /**
     * Whether any receipt was uploaded, reusing eager-loaded relations when present.
     */
    public function hasReceipt(): bool
    {
        if ($this->relationLoaded('receipt')) {
            return $this->receipt !== null;
        }

        if ($this->relationLoaded('receipts')) {
            return $this->receipts->isNotEmpty();
        }

        return $this->receipts()->exists();
    }

    /**
     * Whether the membership was approved but its end date has already passed.
     */
    public function isExpired(): bool
    {
        return $this->status === EnrollmentStatus::Active
            && $this->ends_at !== null
            && $this->ends_at->lt(today());
    }
}
