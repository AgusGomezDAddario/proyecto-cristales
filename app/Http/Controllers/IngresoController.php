<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class IngresoController extends MovimientoController
{
    protected string $tipo = 'ingreso';
    protected string $label = 'Ingreso';
}