<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Concepto;
use Illuminate\Http\Request;

class ConceptoController extends Controller
{
    /**
     * Listar todos los conceptos
     */
    public function index()
    {
        $conceptos = Concepto::orderBy('nombre', 'desc')->get();

        return Inertia::render('conceptos/index', [
            'conceptos' => $conceptos
        ]);
    }

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        return Inertia::render('conceptos/create');
    }

    /**
     * Guardar un nuevo concepto
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:150',
        ]);

        Concepto::create($data);

        return redirect()->route('conceptos.index')
                         ->with('success', 'Concepto creado correctamente');
    }

    /**
     * Mostrar un concepto en detalle
     */
    public function show(Concepto $concepto)
    {
        return Inertia::render('conceptos/show', [
            'concepto' => $concepto
        ]);
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(Concepto $concepto)
    {
        return Inertia::render('conceptos/edit', [
            'concepto' => $concepto
        ]);
    }

    /**
     * Actualizar un concepto existente
     */
    public function update(Request $request, Concepto $concepto)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:150',
        ]);

        $concepto->update($data);

        return redirect()->route('conceptos.index')
                         ->with('success', 'Concepto actualizado correctamente');
    }

    /**
     * Eliminar un concepto
     */
    public function destroy(Concepto $concepto)
    {
        $concepto->delete();

        return redirect()->route('conceptos.index')
                         ->with('success', 'Concepto eliminado correctamente');
    }
}
