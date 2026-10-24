<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::inertia('/account', 'account')
    ->middleware('auth')
    ->name('account');

Route::get('/admin', function () {
    abort_unless(auth()->user()->is_admin, 403);

    return Inertia::render('admin');
})->middleware('auth')->name('admin');

require __DIR__.'/settings.php';