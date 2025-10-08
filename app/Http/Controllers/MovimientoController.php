<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Movimiento;
use Illuminate\Http\Request;

class MovimientoController extends Controller
{
    public function index()
    {
        $movimientos = Movimiento::with(['concepto','medioDePago'])
            ->orderBy('fecha', 'desc')
            ->get();

        return Inertia::render('movimientos/index', [
            'movimientos' => $movimientos
        ]);
    }
 
public function create()
{
    $conceptos = \App\Models\Concepto::orderBy('nombre', 'asc')->get();
    $mediosDePago = \App\Models\MedioDePago::orderBy('nombre', 'asc')->get();

    return Inertia::render('movimientos/create', [
        'conceptos' => $conceptos,
        'mediosDePago' => $mediosDePago,
    ]);
}

    public function store(Request $request)
    {
        $data = $request->validate([
            'fecha'            => 'required|date',
            'monto'            => 'required|numeric',
            'concepto_id'      => 'required|exists:concepto,id',
            'medio_de_pago_id' => 'nullable|exists:medio_de_pago,id',
            'comprobante' => 'nullable|string|max:255',
        ]);

        Movimiento::create($data);

return redirect()->route('movimientos.index')
    ->with('success', 'Movimiento creado correctamente');
    }

    public function show(Movimiento $movimiento)
    {
        return Inertia::render('movimientos/show', [
            'movimiento' => $movimiento->load(['concepto','medioDePago'])
        ]);
    }

    public function edit(Movimiento $movimiento)
    {
        return Inertia::render('movimientos/edit', [
            'movimiento' => $movimiento->load(['concepto','medioDePago'])
        ]);
    }

    public function update(Request $request, Movimiento $movimiento)
    {
        $data = $request->validate([
            'fecha'            => 'required|date',
            'monto'            => 'required|numeric',
            'concepto_id'      => 'required|exists:concepto,id',
            'medio_de_pago_id' => 'nullable|exists:medio_de_pago,id',
            'comprobante_path' => 'nullable|string|max:255',
        ]);

        $movimiento->update($data);

        return redirect()->route('movimientos.index')
                         ->with('success', 'Movimiento actualizado correctamente');
    }

    public function destroy(Movimiento $movimiento)
    {
        $movimiento->delete();

        return redirect()->route('movimientos.index')
                         ->with('success', 'Movimiento eliminado correctamente');
    }
}