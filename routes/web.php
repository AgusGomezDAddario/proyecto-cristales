<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers;
use App\Http\Controllers\ConceptoController;
use App\Http\Controllers\MovimientoController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::resource('conceptos', ConceptoController::class);
Route::resource('movimiento', MovimientoController::class);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
