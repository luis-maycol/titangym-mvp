<?php

namespace Database\Factories;

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Enrollment>
 */
class EnrollmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'plan_id' => Plan::factory(),
            'status' => EnrollmentStatus::Pending,
            'amount' => fn (array $attributes) => Plan::query()->whereKey($attributes['plan_id'])->value('price') ?? '0.00',
        ];
    }

    /**
     * A membership waiting for the admin to validate the payment.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => EnrollmentStatus::Pending,
        ]);
    }

    /**
     * An approved membership that is currently running.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => EnrollmentStatus::Active,
            'starts_at' => today()->subDays(5),
            'ends_at' => today()->addDays(25),
            'reviewed_by' => User::factory()->admin(),
            'reviewed_at' => now()->subDays(5),
        ]);
    }

    /**
     * An approved membership whose end date has passed.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => EnrollmentStatus::Active,
            'starts_at' => today()->subDays(40),
            'ends_at' => today()->subDays(10),
            'reviewed_by' => User::factory()->admin(),
            'reviewed_at' => now()->subDays(40),
        ]);
    }

    /**
     * A membership whose Yape receipt was rejected by an admin.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => EnrollmentStatus::Rejected,
            'reviewed_by' => User::factory()->admin(),
            'reviewed_at' => now()->subDay(),
            'rejection_reason' => 'El monto del comprobante no coincide con el plan.',
        ]);
    }
}
