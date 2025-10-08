<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Movimiento;
use App\Models\Concepto;
use App\Models\MedioDePago;
use Illuminate\Http\Request;

class MovimientoController extends Controller
{
    /**
     * Listado de movimientos (egresos)
     */
    public function index()
    {
        $movimientos = Movimiento::with(['concepto', 'medioDePago'])
            ->orderBy('fecha', 'desc')
            ->get();

        return Inertia::render('movimientos/index', [
            'movimientos' => $movimientos
        ]);
    }

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        $conceptos = Concepto::orderBy('nombre', 'asc')->get();
        $mediosDePago = MedioDePago::orderBy('nombre', 'asc')->get();

        return Inertia::render('movimientos/create', [
            'conceptos' => $conceptos,
            'mediosDePago' => $mediosDePago,
        ]);
    }

    /**
     * Guardar nuevo movimiento
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'fecha'            => 'required|date',
            'monto'            => 'required|numeric|min:0',
            'concepto_id'      => 'required|exists:concepto,id',
            'medio_de_pago_id' => 'nullable|exists:medio_de_pago,id',
            'comprobante'      => 'nullable|string|max:255',
        ]);

        Movimiento::create($data);

        return redirect()->route('movimientos.index')
            ->with('success', 'Egreso registrado correctamente');
    }

    /**
     * Mostrar un movimiento específico
     */
    public function show(Movimiento $movimiento)
    {
        return Inertia::render('movimientos/show', [
            'movimiento' => $movimiento->load(['concepto', 'medioDePago'])
        ]);
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(Movimiento $movimiento)
    {
        $conceptos = Concepto::orderBy('nombre', 'asc')->get();
        $mediosDePago = MedioDePago::orderBy('nombre', 'asc')->get();

        return Inertia::render('movimientos/edit', [
            'movimiento' => $movimiento->load(['concepto', 'medioDePago']),
            'conceptos' => $conceptos,
            'mediosDePago' => $mediosDePago,
        ]);
    }

    /**
     * Actualizar un movimiento
     */
    public function update(Request $request, Movimiento $movimiento)
    {
        $data = $request->validate([
            'fecha'            => 'required|date',
            'monto'            => 'required|numeric|min:0',
            'concepto_id'      => 'required|exists:concepto,id',
            'medio_de_pago_id' => 'nullable|exists:medio_de_pago,id',
            'comprobante'      => 'nullable|string|max:255',
        ]);

        $movimiento->update($data);

        return redirect()->route('movimientos.index')
            ->with('success', 'Egreso actualizado correctamente');
    }

    /**
     * Eliminar un movimiento
     */
    public function destroy(Movimiento $movimiento)
    {
        $movimiento->delete();

        return redirect()->route('movimientos.index')
            ->with('success', 'Egreso eliminado correctamente');
    }
}