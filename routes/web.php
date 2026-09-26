<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\PaymentReceiptController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SiteController;
use Illuminate\Support\Facades\Route;

Route::controller(SiteController::class)->group(function () {
    Route::get('/', 'home')->name('home');
    Route::get('nosotros', 'about')->name('about');
    Route::get('servicios', 'services')->name('services');
    Route::get('entrenadores', 'trainers')->name('trainers');
    Route::get('instalaciones', 'facilities')->name('facilities');
});

Route::get('contacto', [ContactController::class, 'show'])->name('contact');
Route::post('contacto', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

Route::get('planes', [PlanController::class, 'index'])->name('plans.index');

Route::get('matricula/{plan:slug}', [EnrollmentController::class, 'create'])->name('enrollments.create');
Route::post('matricula/{plan:slug}', [EnrollmentController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('enrollments.store');

Route::middleware('auth')->group(function () {
    Route::get('mi-matricula/{enrollment}', [EnrollmentController::class, 'show'])->name('enrollments.show');
    Route::post('mi-matricula/{enrollment}/comprobante', [PaymentReceiptController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('enrollments.receipts.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('matriculas', [Admin\EnrollmentController::class, 'index'])->name('enrollments.index');
    Route::get('matriculas/nueva', [Admin\ManualEnrollmentController::class, 'create'])->name('enrollments.create');
    Route::post('matriculas/nueva', [Admin\ManualEnrollmentController::class, 'store'])->name('enrollments.store');
    Route::get('matriculas/{enrollment}', [Admin\EnrollmentController::class, 'show'])->name('enrollments.show');
    Route::post('matriculas/{enrollment}/aprobar', [Admin\EnrollmentReviewController::class, 'approve'])->name('enrollments.approve');
    Route::post('matriculas/{enrollment}/rechazar', [Admin\EnrollmentReviewController::class, 'reject'])->name('enrollments.reject');
    Route::get('comprobantes/{receipt}', [Admin\PaymentReceiptController::class, 'show'])->name('receipts.show');
    Route::get('clientes', [Admin\ClientController::class, 'index'])->name('clients.index');
    Route::get('promociones', [Admin\PromotionController::class, 'index'])->name('promotions.index');
    Route::post('promociones', [Admin\PromotionController::class, 'store'])->name('promotions.store');
    Route::patch('promociones/{promotion}', [Admin\PromotionController::class, 'update'])->name('promotions.update');
    Route::delete('promociones/{promotion}', [Admin\PromotionController::class, 'destroy'])->name('promotions.destroy');
});

require __DIR__.'/settings.php';
