<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class IngresoController extends Controller
{
    public function index()
    {
        $ingresos = []; // Reemplaza con tu lógica real

        return Inertia::render('ingresos/index', [  // <-- Cambiado a minúsculas y con "/"
            'ingresos' => $ingresos
        ]);
    }

    public function create()
    {
        return Inertia::render('ingresos/create');  // <-- Asumiendo que existe
    }
}