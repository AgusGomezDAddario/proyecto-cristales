<?php

namespace App\Http\Controllers;

use App\Models\Concepto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConceptoController extends Controller
{
    /**
     * Listado de conceptos con filtros y paginación
     */
    public function index(Request $request)
    {
        $query = Concepto::withCount('movimientos');

        // Búsqueda por nombre
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nombre', 'like', "%{$search}%");
        }

        // Filtro por tipo
        if ($request->filled('tipo') && in_array($request->tipo, ['ingreso', 'egreso'])) {
            $query->where('tipo', $request->tipo);
        }

        $conceptos = $query->orderBy('tipo')->orderBy('nombre')->paginate(20)->withQueryString();

        // Estadísticas
        $totalConceptos = Concepto::count();
        $totalIngresos = Concepto::where('tipo', 'ingreso')->count();
        $totalEgresos = Concepto::where('tipo', 'egreso')->count();

        return Inertia::render('Conceptos/Index', [
            'conceptos' => $conceptos,
            'filters' => $request->only(['search', 'tipo']),
            'stats' => [
                'total' => $totalConceptos,
                'ingresos' => $totalIngresos,
                'egresos' => $totalEgresos,
            ],
        ]);
    }

    /**
     * Crear nuevo concepto
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50|unique:concepto,nombre',
            'tipo' => 'required|in:ingreso,egreso',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.unique' => 'Ya existe un concepto con ese nombre.',
            'nombre.max' => 'El nombre no puede tener más de 50 caracteres.',
            'tipo.required' => 'El tipo es obligatorio.',
            'tipo.in' => 'El tipo debe ser ingreso o egreso.',
        ]);

        Concepto::create($validated);

        return redirect()->back()->with('success', 'Concepto creado correctamente.');
    }

    /**
     * Actualizar concepto existente
     */
    public function update(Request $request, Concepto $concepto)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50|unique:concepto,nombre,' . $concepto->id,
            'tipo' => 'required|in:ingreso,egreso',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.unique' => 'Ya existe un concepto con ese nombre.',
            'nombre.max' => 'El nombre no puede tener más de 50 caracteres.',
            'tipo.required' => 'El tipo es obligatorio.',
            'tipo.in' => 'El tipo debe ser ingreso o egreso.',
        ]);

        $concepto->update($validated);

        return redirect()->back()->with('success', 'Concepto actualizado correctamente.');
    }

    /**
     * Eliminar concepto
     */
    public function destroy(Concepto $concepto)
    {
        // Verificar si tiene movimientos asociados
        if ($concepto->movimientos()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar: el concepto tiene movimientos asociados.');
        }

        $concepto->delete();

        return redirect()->back()->with('success', 'Concepto eliminado correctamente.');
    }
}