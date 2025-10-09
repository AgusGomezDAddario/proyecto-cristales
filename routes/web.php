<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrdenDeTrabajoController;
use App\Http\Controllers\Administrador\UserController;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EgresoController;
use App\Http\Controllers\MovimientoController;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

// Rutas protegidas (requieren autenticación)
Route::middleware(['auth'])->group(function () {
    // Dashboard principal (redirige según rol)
    Route::get('admin', [DashboardController::class, 'index'])->name('dashboard');

    // 👉 ABM de usuarios (solo admins)
    Route::middleware('is_admin')->group(function () {
        Route::get('admin/users', [UserController::class, 'index'])->name('admin.users.index');
        Route::post('admin/users', [UserController::class, 'store'])->name('admin.users.store');
        Route::put('admin/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    });

    Route::resource('egresos', EgresoController::class);
    Route::resource('ingresos', IngresoController::class);

    // 👉 Rutas para Movimientos (Egresos)
    // Route::resource('movimientos', MovimientoController::class);

    // 👉 Rutas para Ingresos
    // Route::get('ingresos', [IngresoController::class, 'index'])->name('ingresos.index');
    // Route::get('ingresos/create', [IngresoController::class, 'create'])->name('ingresos.create');
    // Route::post('ingresos', [IngresoController::class, 'store'])->name('ingresos.store');
    // Route::get('ingresos/{ingreso}', [IngresoController::class, 'show'])->name('ingresos.show');
    // Route::get('ingresos/{ingreso}/edit', [IngresoController::class, 'edit'])->name('ingresos.edit');
    // Route::put('ingresos/{ingreso}', [IngresoController::class, 'update'])->name('ingresos.update');
    // Route::delete('ingresos/{ingreso}', [IngresoController::class, 'destroy'])->name('ingresos.destroy');

    // 👉 Rutas para Órdenes de Trabajo
    Route::resource('ordenes', OrdenDeTrabajoController::class)
        ->parameters([
            'ordenes' => 'orden'
        ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';