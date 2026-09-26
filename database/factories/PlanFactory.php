<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = 'Plan '.fake()->unique()->word();

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(),
            'duration_months' => fake()->randomElement([1, 3, 6, 12]),
            'price' => fake()->randomFloat(2, 60, 900),
            'benefits' => ['Acceso a sala de musculación', 'Evaluación física inicial'],
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    /**
     * A one-month plan.
     */
    public function monthly(): static
    {
        return $this->state(fn (array $attributes) => [
            'duration_months' => 1,
        ]);
    }

    /**
     * A twelve-month plan.
     */
    public function yearly(): static
    {
        return $this->state(fn (array $attributes) => [
            'duration_months' => 12,
        ]);
    }

    /**
     * A plan that is no longer offered to the public.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
