<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrdenDeTrabajoController;
use App\Http\Controllers\Administrador\UserController;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();

        if ($user->role_id == 1) {
            return Inertia::render('Administrador/Dashboard'); // 👈 resources/js/Pages/Admin/Dashboard.tsx
        }

        return Inertia::render('Empleado/Dashboard'); // 👈 resources/js/Pages/Empleado/Dashboard.tsx
    })->name('dashboard');

    // 👉 ABM de usuarios (solo admins)
     Route::middleware('is_admin')->group(function () {
        Route::get('admin/users', [UserController::class, 'index'])
            ->name('admin.users.index');
        Route::post('admin/users', [UserController::class, 'store'])
            ->name('admin.users.store');
        Route::put('admin/users/{user}', [UserController::class, 'update'])
            ->name('admin.users.update');
        Route::delete('admin/users/{user}', [UserController::class, 'destroy'])
            ->name('admin.users.destroy');
    });

});

Route::resource('ordenes', OrdenDeTrabajoController::class)
    ->parameters([
        'ordenes' => 'orden'
    ]);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';