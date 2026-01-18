<?php

namespace App\Http\Controllers;

use App\Models\CompaniaSeguro;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompaniaDeSeguroController extends Controller
{
    /**
     * Listado + búsqueda
     */
    public function index(Request $request)
    {
        $query = CompaniaSeguro::query();

        if ($request->filled('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%');
        }

        $companias = CompaniaSeguro::query()
    ->when($request->filled('search'), fn($q) => $q->where('nombre', 'like', '%'.$request->search.'%'))
    ->orderBy('nombre')
    ->paginate(10)
    ->withQueryString();


        return Inertia::render('companias-seguros/index', [
            'companias' => $companias,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Alta
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'activo' => ['required', 'boolean'],
        ]);

        CompaniaSeguro::create($validated);

        return back()->with('success', 'Compañía creada correctamente.');
    }

    /**
     * Edición
     */
    public function update(Request $request, CompaniaSeguro $compania)
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'activo' => ['required', 'boolean'],
        ]);

        $compania->update($validated);

        return back()->with('success', 'Compañía actualizada correctamente.');
    }

    /**
     * Eliminación (SoftDelete + renombre si tiene OTs)
     */
    public function destroy(CompaniaSeguro $compania)
    {
        $tieneOTs = $compania->ordenesDeTrabajo()->exists();

        if ($tieneOTs) {
            $compania->nombre = trim($compania->nombre) . ' (eliminada)';
            $compania->save();
        }

        $compania->delete();

        return back()->with('success', 'Compañía eliminada correctamente.');
    }
}
