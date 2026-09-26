<?php

namespace Database\Factories;

use App\Models\Enrollment;
use App\Models\PaymentReceipt;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentReceipt>
 */
class PaymentReceiptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'enrollment_id' => Enrollment::factory(),
            'disk' => 'local',
            'path' => 'receipts/'.fake()->uuid().'.jpg',
            'original_name' => 'yape.jpg',
            'mime_type' => 'image/jpeg',
            'size' => fake()->numberBetween(50_000, 2_000_000),
            'operation_code' => fake()->numerify('########'),
        ];
    }
}
