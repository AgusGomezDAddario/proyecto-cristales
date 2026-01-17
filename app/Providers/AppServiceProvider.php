<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\OrdenDeTrabajo;
use App\Observers\OrdenDeTrabajoObserver;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        OrdenDeTrabajo::observe(OrdenDeTrabajoObserver::class);
        
        Inertia::share([
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error'   => session('error'),
                ];
            },
        ]);
    }

    public function register(): void
    {
        //
    }
}