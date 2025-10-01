<?php

namespace App\Http\Controllers;

use App\Models\MedioDePago;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedioDePagoController extends Controller
{
    public function index()
    {
        $mediosDePago = MedioDePago::orderBy('nombre', 'asc')->get();

        return Inertia::render('medios-de-pago/index', [
            'mediosDePago' => $mediosDePago
        ]);
    }
}