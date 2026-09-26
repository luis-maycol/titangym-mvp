<?php

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\PaymentReceipt;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
});

test('the owner uploads a Yape screenshot and the enrollment stays pending', function () {
    $enrollment = Enrollment::factory()->create();

    $this->actingAs($enrollment->user)
        ->post(route('enrollments.receipts.store', $enrollment), [
            'receipt' => UploadedFile::fake()->image('yape.png'),
            'operation_code' => '00123456',
        ])
        ->assertRedirect(route('enrollments.show', $enrollment));

    $receipt = $enrollment->receipts()->sole();

    Storage::disk('local')->assertExists($receipt->path);
    expect($receipt)
        ->disk->toBe('local')
        ->operation_code->toBe('00123456')
        ->and($enrollment->fresh()->status)->toBe(EnrollmentStatus::Pending);
});

test('a rejected enrollment goes back to pending when a new screenshot is uploaded', function () {
    $enrollment = Enrollment::factory()->rejected()->create();
    PaymentReceipt::factory()->for($enrollment)->create();

    $this->actingAs($enrollment->user)
        ->post(route('enrollments.receipts.store', $enrollment), [
            'receipt' => UploadedFile::fake()->image('nuevo.jpg'),
        ])
        ->assertRedirect();

    expect($enrollment->fresh())
        ->status->toBe(EnrollmentStatus::Pending)
        ->reviewed_by->toBeNull()
        ->and($enrollment->receipts()->count())->toBe(2);
});

test('a receipt cannot be uploaded while one is under review or after activation', function (string $state, bool $hasReceipt) {
    $enrollment = Enrollment::factory()->{$state}()->create();

    if ($hasReceipt) {
        PaymentReceipt::factory()->for($enrollment)->create();
    }

    $this->actingAs($enrollment->user)
        ->post(route('enrollments.receipts.store', $enrollment), [
            'receipt' => UploadedFile::fake()->image('yape.png'),
        ])
        ->assertForbidden();
})->with([
    'pending with receipt' => ['pending', true],
    'active' => ['active', false],
]);

test('another client cannot upload a receipt', function () {
    $enrollment = Enrollment::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('enrollments.receipts.store', $enrollment), [
            'receipt' => UploadedFile::fake()->image('yape.png'),
        ])
        ->assertForbidden();

    expect($enrollment->receipts()->count())->toBe(0);
});

test('the receipt must be an image within the size limit', function (UploadedFile $file) {
    $enrollment = Enrollment::factory()->create();

    $this->actingAs($enrollment->user)
        ->post(route('enrollments.receipts.store', $enrollment), ['receipt' => $file])
        ->assertSessionHasErrors('receipt');

    expect($enrollment->receipts()->count())->toBe(0);
})->with([
    'pdf' => fn () => UploadedFile::fake()->create('yape.pdf', 100, 'application/pdf'),
    'too large' => fn () => UploadedFile::fake()->image('yape.jpg')->size(6000),
]);

test('guests are redirected to login when uploading', function () {
    $enrollment = Enrollment::factory()->create();

    $this->post(route('enrollments.receipts.store', $enrollment))
        ->assertRedirect(route('login'));
});
