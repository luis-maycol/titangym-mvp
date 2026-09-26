<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PlanSeeder::class);

        User::factory()->admin()->create([
            'name' => 'Administrador TitanGym',
            'email' => 'admin@titangym.pe',
        ]);

        User::factory()->client()->hasProfile()->create([
            'name' => 'Cliente Demo',
            'email' => 'cliente@titangym.pe',
        ]);
    }
}
