<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\OrdenDeTrabajo;
use App\Observers\OrdenDeTrabajoObserver;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        OrdenDeTrabajo::observe(OrdenDeTrabajoObserver::class);
    }

    public function register(): void
    {
        //
    }
}