<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Movimiento;
use App\Models\Concepto;
use App\Models\MedioDePago;
use Illuminate\Http\Request;

abstract class MovimientoController extends Controller
{
    protected string $tipo;
    protected string $label;

    public function index()
    {
        $movimientos = Movimiento::with(['concepto', 'medioDePago'])
            ->where('tipo', $this->tipo)
            ->orderBy('fecha', 'desc')
            ->get();

        return Inertia::render('movimientos/index', [
            'movimientos' => $movimientos,
            'tipo' => $this->tipo,
            'label' => ucfirst($this->label)
        ]);
    }

    public function create()
    {
        $conceptos = Concepto::orderBy('nombre', 'asc')->get();
        $mediosDePago = MedioDePago::orderBy('nombre', 'asc')->get();

        return Inertia::render('movimientos/create', [
            'conceptos' => $conceptos,
            'mediosDePago' => $mediosDePago,
            'tipo' => $this->tipo,
            'label' => ucfirst($this->label)
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'fecha'            => 'required|date',
            'monto'            => 'required|numeric|min:0',
            'concepto_id'      => 'required|exists:concepto,id',
            'medio_de_pago_id' => 'nullable|exists:medio_de_pago,id',
            'comprobante'      => 'nullable|string|max:255',
            'es_caja_chica'    => 'nullable|boolean',
        ]);

        $data['tipo'] = $this->tipo;

        if ($this->tipo === 'egreso') {
            $data['es_caja_chica'] = (bool) $request->boolean('es_caja_chica');
        } else {
            $data['es_caja_chica'] = false;
        }

        Movimiento::create($data);

        return redirect()->route($this->tipo . 's.index')
            ->with('success', $this->label . ' registrado correctamente');
    }

    public function show(Movimiento $movimiento)
    {
        return Inertia::render('movimientos/show', [
            'movimiento' => $movimiento->load(['concepto', 'medioDePago']),
            'label' => ucfirst($this->label),
        ]);
    }

    public function edit(Movimiento $movimiento)
    {
        $conceptos = Concepto::orderBy('nombre', 'asc')->get();
        $mediosDePago = MedioDePago::orderBy('nombre', 'asc')->get();

        return Inertia::render('movimientos/edit', [
            'movimiento' => $movimiento->load(['concepto', 'medioDePago']),
            'conceptos' => $conceptos,
            'mediosDePago' => $mediosDePago,
            'label' => ucfirst($this->label),
        ]);
    }

    public function update(Request $request, Movimiento $movimiento)
    {
        $data = $request->validate([
            'fecha'            => 'required|date',
            'monto'            => 'required|numeric|min:0',
            'concepto_id'      => 'required|exists:concepto,id',
            'medio_de_pago_id' => 'nullable|exists:medio_de_pago,id',
            'comprobante'      => 'nullable|string|max:255',
            'es_caja_chica'    => 'nullable|boolean', 
        ]);

        if ($movimiento->tipo === 'egreso') {
            $data['es_caja_chica'] = (bool) $request->boolean('es_caja_chica');
        } else {
            unset($data['es_caja_chica']); 
        }

        $movimiento->update($data);

        return redirect()->route($this->tipo . 's.index')
            ->with('success', $this->label . ' actualizado correctamente');
    }

    public function destroy(Movimiento $movimiento)
    {
        $movimiento->delete();

        return redirect()->route($this->tipo . 's.index')
            ->with('success', $this->label . ' eliminado correctamente');
    }
}
