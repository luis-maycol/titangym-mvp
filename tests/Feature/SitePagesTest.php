<?php

use App\Models\Plan;
use Inertia\Testing\AssertableInertia as Assert;

test('public pages render for guests', function (string $routeName, string $component) {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component($component)
            ->has('gym.address')
            ->has('cdn.url'));
})->with([
    ['home', 'site/home'],
    ['about', 'site/about'],
    ['services', 'site/services'],
    ['trainers', 'site/trainers'],
    ['facilities', 'site/facilities'],
]);

test('the home page lists only active plans', function () {
    Plan::factory()->create(['name' => 'Mensual']);
    Plan::factory()->inactive()->create(['name' => 'Antiguo']);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('plans', 1)
            ->where('plans.0.name', 'Mensual'));
});

test('images are served from the configured CDN origin', function () {
    config([
        'titangym.cdn.url' => 'https://cdn.titangym.pe/',
        'titangym.cdn.image_resizing' => true,
    ]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('cdn.url', 'https://cdn.titangym.pe')
            ->where('cdn.imageResizing', true));
});
