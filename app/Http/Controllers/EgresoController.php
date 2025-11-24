<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EgresoController extends MovimientoController
{
    protected string $tipo = 'egreso';
    protected string $ruta = 'egresos';
    protected string $label = 'Egreso';
}
