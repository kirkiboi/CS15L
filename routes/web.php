<?php

use App\Http\Controllers\Auth\EmailVerificationCodeController;
use App\Http\Controllers\ListingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// verification routes
Route::get('/verify-code', [EmailVerificationCodeController::class, 'create'])->name('verification.code');
Route::post('/verify-code', [EmailVerificationCodeController::class, 'store'])->name('verification.code.store');
Route::post('/verify-code/resend', [EmailVerificationCodeController::class,'resend',])->name('verification.code.resend');

Route::get('/', [ListingController::class, 'browse'])->name('home');
Route::get('listings/{listing}', [ListingController::class, 'show'])->whereNumber('listing')->name('listings.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('my-listings/create', [ListingController::class, 'create'])->name('listings.create');
    Route::post('listings', [ListingController::class, 'store'])->name('listings.store');
    Route::get('my-listings', [ListingController::class, 'index'])->name('listings.index');
    Route::get('my-listings/{listing}/edit', [ListingController::class, 'edit'])->whereNumber('listing')->name('listings.edit');
    Route::get('listings/{listing}/edit', [ListingController::class, 'edit'])->whereNumber('listing');
    Route::match(['put', 'patch'], 'listings/{listing}', [ListingController::class, 'update'])->whereNumber('listing')->name('listings.update');
    Route::delete('listings/{listing}', [ListingController::class, 'destroy'])->whereNumber('listing')->name('listings.destroy');
});
Route::inertia('/account', 'account')->middleware('auth')->name('account');
Route::get('/admin', function () {
    abort_unless(auth()->user()->is_admin, 403);

    return Inertia::render('admin');
})->middleware('auth')->name('admin');

require __DIR__.'/settings.php';