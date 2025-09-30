<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrdenDeTrabajo;
use Inertia\Inertia;



class OrdenDeTrabajoController extends Controller
{

    public function index()
    {
        $ordenes = OrdenDeTrabajo::with(['titular', 'estado', 'medioDePago'])
            ->orderBy('created_at', 'desc') // 👈 acá ordena por timestamp
            ->get();

        return Inertia::render('ordenes/index', [
            'ordenes' => $ordenes
        ]);
    }

    public function create()
    {
        return Inertia::render('ordenes/createOrdenes');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titular_id'       => 'required|exists:titular,id',
            'medio_de_pago_id' => 'required|exists:medio_de_pago,id',
            'estado_id'        => 'required|exists:estado,id',
            'fecha'            => 'required|date',
            'observacion'      => 'nullable|string|max:150',
        ]);

        OrdenDeTrabajo::create($data);

        return redirect()->route('ordenes.index')
            ->with('success', 'Orden creada correctamente ✅');
    }

    public function show(string $id)
    {
        $orden = OrdenDeTrabajo::with(['titular', 'estado', 'medioDePago'])
            ->findOrFail($id);

        return Inertia::render('ordenes/show', [
            'orden' => $orden
        ]);
    }

        public function edit(string $id)
    {
        $orden = OrdenDeTrabajo::findOrFail($id);

        return Inertia::render('ordenes/edit', [
            'orden' => $orden
        ]);
    }


    public function update(Request $request, string $id)
    {
        $orden = OrdenDeTrabajo::findOrFail($id);

                $data = $request->validate([
                    'titular_id'       => 'sometimes|required|exists:titular,id',
                    'medio_de_pago_id' => 'sometimes|required|exists:medio_de_pago,id',
                    'estado_id'        => 'sometimes|required|exists:estado,id',
                    'fecha'            => 'sometimes|required|date',
                    'observacion'      => 'nullable|string|max:150',
                ]);

                $orden->update($data);

                return redirect()->route('ordenes.index')
                    ->with('success', 'Orden actualizada correctamente ✏️');
    }

    public function destroy(string $id)
    {
        $orden = OrdenDeTrabajo::findOrFail($id);
        $orden->delete();

        return redirect()->route('ordenes.index')
            ->with('success', 'Orden eliminada correctamente ✅');
    }
}
