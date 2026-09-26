<?php

use App\Models\Promotion;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('public');
    $this->admin = User::factory()->admin()->create();
});

test('uploading a flyer publishes it and hides the previous one', function () {
    $previous = Promotion::factory()->active()->create();

    $this->actingAs($this->admin)
        ->post(route('admin.promotions.store'), [
            'image' => UploadedFile::fake()->image('flyer.jpg', 1080, 1350),
            'title' => 'Promo verano',
            'activate' => '1',
        ])
        ->assertRedirect(route('admin.promotions.index'));

    $promotion = Promotion::latest('id')->first();

    Storage::disk('public')->assertExists($promotion->image_path);
    expect($promotion->is_active)->toBeTrue()
        ->and($previous->fresh()->is_active)->toBeFalse();
});

test('a flyer can be uploaded without publishing it', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.promotions.store'), [
            'image' => UploadedFile::fake()->image('flyer.png'),
        ])
        ->assertRedirect();

    expect(Promotion::sole()->is_active)->toBeFalse();
});

test('the flyer must be an image', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.promotions.store'), [
            'image' => UploadedFile::fake()->create('flyer.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasErrors('image');

    expect(Promotion::count())->toBe(0);
});

test('activating a promotion deactivates the others and it can be turned off', function () {
    $current = Promotion::factory()->active()->create();
    $promotion = Promotion::factory()->create();

    $this->actingAs($this->admin)
        ->patch(route('admin.promotions.update', $promotion), ['is_active' => true])
        ->assertRedirect();

    expect($promotion->fresh()->is_active)->toBeTrue()
        ->and($current->fresh()->is_active)->toBeFalse();

    $this->actingAs($this->admin)
        ->patch(route('admin.promotions.update', $promotion), ['is_active' => false]);

    expect(Promotion::where('is_active', true)->count())->toBe(0);
});

test('deleting a promotion removes its image', function () {
    $path = UploadedFile::fake()->image('flyer.jpg')->store('promotions', 'public');
    $promotion = Promotion::factory()->create(['image_path' => $path]);

    $this->actingAs($this->admin)
        ->delete(route('admin.promotions.destroy', $promotion))
        ->assertRedirect();

    Storage::disk('public')->assertMissing($path);
    expect(Promotion::count())->toBe(0);
});

test('the home page receives only the active promotion', function () {
    Promotion::factory()->create();

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page->where('promotion', null));

    $active = Promotion::factory()->active()->create(['image_path' => 'promotions/promo.jpg']);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('promotion.id', $active->id)
            ->where('promotion.image', 'storage/promotions/promo.jpg'));
});

test('clients cannot manage promotions', function () {
    $client = User::factory()->create();

    $this->actingAs($client)->get(route('admin.promotions.index'))->assertForbidden();
    $this->actingAs($client)
        ->post(route('admin.promotions.store'), ['image' => UploadedFile::fake()->image('x.jpg')])
        ->assertForbidden();
});
