<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrdenDeTrabajoController;
use App\Http\Controllers\Administrador\UserController;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MetricsController;
use App\Http\Controllers\EgresoController;
use App\Http\Controllers\MovimientoController;
use App\Http\Controllers\CatalogoVehiculoController;
use App\Http\Controllers\DailySummaryController;
use App\Http\Controllers\MedioDePagoController;
use App\Http\Controllers\CompaniaDeSeguroController;
use App\Http\Controllers\ClienteController;

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

        // 📈 Métricas (solo admins)
        Route::get('admin/metrics', [MetricsController::class, 'index'])->name('admin.metrics.index');

        // 📚 Catálogo de Marcas/Modelos (solo admins)
        Route::resource('catalogo-vehiculos', CatalogoVehiculoController::class)
            ->parameters(['catalogo-vehiculos' => 'modelo'])
            ->except(['create', 'show', 'edit']);

        // 👥 Maestro de Clientes (solo admins)
        Route::resource('clientes', ClienteController::class)
            ->parameters(['clientes' => 'cliente'])
            ->except(['create', 'show', 'edit']);
        Route::post('clientes/{cliente}/vehiculos/{vehiculo}', [ClienteController::class, 'attachVehicle'])
            ->name('clientes.attach-vehicle');
        Route::delete('clientes/{cliente}/vehiculos/{vehiculo}', [ClienteController::class, 'detachVehicle'])
            ->name('clientes.detach-vehicle');
        Route::get('api/clientes/{cliente}/vehiculos-disponibles', [ClienteController::class, 'getVehiculosDisponibles'])
            ->name('api.clientes.vehiculos-disponibles');
        Route::post('clientes/{cliente}/vehiculos', [ClienteController::class, 'createAndAttachVehicle'])
            ->name('clientes.create-vehicle');
        Route::get('api/clientes/modelos/{marcaId}', [ClienteController::class, 'getModelosByMarca'])
            ->name('api.clientes.modelos');
        Route::delete('vehiculos/{vehiculo}', [ClienteController::class, 'destroyVehicle'])
            ->name('vehiculos.destroy');
    });

    Route::resource('egresos', EgresoController::class);
    Route::put('/egresos/{id}', [EgresoController::class, 'update']);
    Route::post('/egresos/{id}', [EgresoController::class, 'update']);

    Route::resource('ingresos', IngresoController::class);
    Route::put('/ingresos/{id}', [IngresoController::class, 'update']);
    Route::post('/ingresos/{id}', [IngresoController::class, 'update']);

    // 👉 Rutas para Órdenes de Trabajo
    Route::resource('ordenes', OrdenDeTrabajoController::class)
        ->parameters([
            'ordenes' => 'orden'
        ]);

    // 👉 Rutas API para Catálogo de Vehículos (accesibles para todos los auth)
    Route::get('api/marcas', [CatalogoVehiculoController::class, 'getMarcas'])->name('api.marcas');
    Route::get('api/modelos/{marcaId}', [CatalogoVehiculoController::class, 'getModelosByMarca'])->name('api.modelos');
    // 👉 Rutas para Resumen del día
    Route::get('/resumen-del-dia', [DailySummaryController::class, 'show'])->name('daily-summary.show');

    Route::get('/resumen-del-dia/imprimir', [DailySummaryController::class, 'print'])
        ->name('daily-summary.print');

    Route::resource('medio-de-pago', MedioDePagoController::class) 
    ->only(['index', 'store', 'update', 'destroy']);

    Route::middleware(['auth'])->group(function () {
        Route::get('/companias-seguros', [CompaniaDeSeguroController::class, 'index'])->name('companias-seguros.index');
        Route::post('/companias-seguros', [CompaniaDeSeguroController::class, 'store']);
        Route::put('/companias-seguros/{compania}', [CompaniaDeSeguroController::class, 'update']);
        Route::delete('/companias-seguros/{compania}', [CompaniaDeSeguroController::class, 'destroy']);
});
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';