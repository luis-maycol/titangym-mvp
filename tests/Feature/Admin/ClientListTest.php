<?php

use App\Models\Enrollment;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();

    $this->active = Enrollment::factory()->active()->create([
        'ends_at' => today()->addDays(20),
    ])->user;
    $this->expiring = Enrollment::factory()->active()->create([
        'ends_at' => today()->addDays(3),
    ])->user;
    $this->expired = Enrollment::factory()->expired()->create()->user;
    $this->pendingOnly = Enrollment::factory()->create()->user;
});

test('the client list filters by membership state', function (string $filter, array $expected) {
    $response = $this->actingAs($this->admin)
        ->get(route('admin.clients.index', ['membership' => $filter]))
        ->assertOk();

    $expectedIds = collect($expected)->map(fn (string $key) => $this->{$key}->id)->sort()->values()->all();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/clients/index')
        ->where('clients.data', fn ($clients) => collect($clients)->pluck('id')->sort()->values()->all() === $expectedIds));
})->with([
    'active' => ['active', ['active', 'expiring']],
    'expiring' => ['expiring', ['expiring']],
    'inactive' => ['inactive', ['expired', 'pendingOnly']],
    'all' => ['all', ['active', 'expiring', 'expired', 'pendingOnly']],
]);

test('each client shows the end date of their latest membership', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.clients.index', ['membership' => 'all', 'search' => $this->expired->email]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('clients.data', 1)
            ->where('clients.data.0.membership.is_expired', true)
            ->where('clients.data.0.membership.ends_at', today()->subDays(10)->toDateString()));
});

test('admins are excluded from the client list', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.clients.index', ['membership' => 'all']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('clients.total', 4));
});

test('the admin dashboard summarizes the review queue and members', function () {
    $this->actingAs($this->admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.active_members', 2)
            ->where('stats.expiring_soon', 1)
            ->where('stats.awaiting_payment', 1)
            ->where('stats.awaiting_review', 0));
});
