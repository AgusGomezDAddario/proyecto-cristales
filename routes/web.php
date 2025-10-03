<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ConceptoController;
use App\Http\Controllers\MovimientoController;
use App\Http\Controllers\DashboardController;

// Ruta principal redirige al dashboard
Route::get('/', function () {
    return redirect('/dashboard');
})->name('home');

// Dashboard (Panel de Control)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Rutas de recursos
Route::resource('conceptos', ConceptoController::class);
Route::resource('movimientos', MovimientoController::class);

// Rutas placeholder para las secciones en desarrollo
Route::get('/ingresos', function () {
    return Inertia::render('ingresos/index');
})->name('ingresos.index');

Route::get('/ordenes-trabajo', function () {
    return Inertia::render('ordenes-trabajo/index');
})->name('ordenes-trabajo.index');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';