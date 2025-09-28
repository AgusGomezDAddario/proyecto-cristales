<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();

        if ($user->role_id == 1) {
            return Inertia::render('Administrador/main'); // 👈 resources/js/Pages/Admin/Dashboard.tsx
        }

        return Inertia::render('Empleado/main'); // 👈 resources/js/Pages/Empleado/Dashboard.tsx
    })->name('dashboard');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
