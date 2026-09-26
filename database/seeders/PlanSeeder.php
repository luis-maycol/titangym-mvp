<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Seed the membership plans offered by TitanGym.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Mensual',
                'slug' => 'mensual',
                'description' => 'Ideal para empezar a entrenar sin compromisos largos.',
                'duration_months' => 1,
                'price' => 80.00,
                'benefits' => [
                    'Acceso ilimitado a sala de musculación',
                    'Clases grupales incluidas',
                    'Evaluación física inicial',
                ],
                'is_featured' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Trimestral',
                'slug' => 'trimestral',
                'description' => 'Tres meses para ver resultados reales.',
                'duration_months' => 3,
                'price' => 210.00,
                'benefits' => [
                    'Todo lo del plan Mensual',
                    'Rutina personalizada por un entrenador',
                    'Ahorra S/ 30 frente al plan mensual',
                ],
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Anual',
                'slug' => 'anual',
                'description' => 'El mejor precio para quienes entrenan todo el año.',
                'duration_months' => 12,
                'price' => 720.00,
                'benefits' => [
                    'Todo lo del plan Trimestral',
                    'Reevaluación física cada 3 meses',
                    'Ahorra S/ 240 frente al plan mensual',
                ],
                'is_featured' => false,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan + ['is_active' => true]);
        }
    }
}
