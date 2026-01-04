<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use App\Models\Modelo;
use Illuminate\Http\Request;

class VehiculoMaestroController extends Controller
{
    /**
     * Obtener todas las marcas
     */
    public function getMarcas()
    {
        $marcas = Marca::orderBy('nombre')->get();
        return response()->json($marcas);
    }

    /**
     * Obtener modelos por marca
     */
    public function getModelosByMarca($marcaId)
    {
        $modelos = Modelo::where('marca_id', $marcaId)
            ->orderBy('nombre')
            ->get();
        return response()->json($modelos);
    }

    /**
     * Obtener todos los modelos (opcional)
     */
    public function getModelos()
    {
        $modelos = Modelo::with('marca')->orderBy('nombre')->get();
        return response()->json($modelos);
    }
}
