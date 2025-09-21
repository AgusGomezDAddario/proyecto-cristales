<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard'); // 👈 Nombre del componente, con D mayúscula
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
