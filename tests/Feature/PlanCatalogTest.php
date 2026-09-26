<?php

use App\Models\Plan;
use Inertia\Testing\AssertableInertia as Assert;

test('guests see only active plans in display order', function () {
    Plan::factory()->create(['name' => 'Anual', 'sort_order' => 2]);
    Plan::factory()->create(['name' => 'Mensual', 'sort_order' => 1]);
    Plan::factory()->inactive()->create(['name' => 'Antiguo']);

    $this->get(route('plans.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('plans/index')
            ->has('plans', 2)
            ->where('plans.0.name', 'Mensual')
            ->where('plans.1.name', 'Anual'));
});
