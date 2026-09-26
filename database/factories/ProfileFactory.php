<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Profile>
 */
class ProfileFactory extends Factory
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
            'dni' => fake()->unique()->numerify('########'),
            'phone' => fake()->numerify('9########'),
            'birth_date' => fake()->dateTimeBetween('-60 years', '-16 years'),
            'address' => fake()->streetAddress(),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => fake()->numerify('9########'),
        ];
    }
}
