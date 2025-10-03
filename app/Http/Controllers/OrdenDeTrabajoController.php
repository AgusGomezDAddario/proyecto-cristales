<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrdenDeTrabajo;
use App\Models\Titular;
use App\Models\Vehiculo;
use App\Models\TitularVehiculo;
use App\Models\Estado;
use App\Models\MedioDePago;
use Inertia\Inertia;

class OrdenDeTrabajoController extends Controller
{
    public function index()
    {
        // Traer ODTs con titular y vehículo desde la pivot
        $ordenes = OrdenDeTrabajo::with([
            'titularVehiculo.titular',
            'titularVehiculo.vehiculo',
            'estado',
            'medioDePago'
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('ordenes/index', [
            'ordenes' => $ordenes
        ]);
    }

public function create()
{
    $titulares = Titular::with('vehiculos:id,patente,marca,modelo,anio')
        ->select('id', 'nombre', 'apellido', 'telefono', 'email')
        ->get();

    $estados = Estado::select('id', 'nombre')->get();
    $mediosDePago = MedioDePago::select('id', 'nombre')->get();

    return Inertia::render('ordenes/createOrdenes', [
        'titulares'    => $titulares,
        'estados'      => $estados,
        'mediosDePago' => $mediosDePago,
    ]);
}



    public function store(Request $request)
{
    \Log::info('📥 Request recibido', $request->all());

    $data = $request->all();

    // 1️⃣ Crear titular si es nuevo
    if (empty($data['titular_id']) && !empty($data['nuevo_titular'])) {
        $nuevoTitular = Titular::create([
            'nombre'   => $data['nuevo_titular']['nombre'] ?? '',
            'apellido' => $data['nuevo_titular']['apellido'] ?? '',
            'telefono' => $data['nuevo_titular']['telefono'] ?? '',
            'email'    => $data['nuevo_titular']['email'] ?? null,
        ]);
        $data['titular_id'] = $nuevoTitular->id;
    }

    // 2️⃣ Crear vehículo si es nuevo
    if (empty($data['vehiculo_id']) && !empty($data['nuevo_vehiculo'])) {
        $nuevoVehiculo = Vehiculo::create([
            'patente' => $data['nuevo_vehiculo']['patente'],
            'marca'   => $data['nuevo_vehiculo']['marca'],
            'modelo'  => $data['nuevo_vehiculo']['modelo'],
            'anio'    => $data['nuevo_vehiculo']['anio'],
            'color'   => $data['nuevo_vehiculo']['color'] ?? null,
        ]);
        $data['vehiculo_id'] = $nuevoVehiculo->id;
    }

    // 🚨 Validación importante: debe existir titular_id y vehiculo_id
    if (empty($data['titular_id']) || empty($data['vehiculo_id'])) {
        return back()->withErrors(['titular_vehiculo_id' => 'Debe seleccionar o crear titular y vehículo.']);
    }

    // 3️⃣ Crear o recuperar la relación pivot titular_vehiculo
    $pivot = TitularVehiculo::firstOrCreate([
        'titular_id'  => $data['titular_id'],
        'vehiculo_id' => $data['vehiculo_id'],
    ]);

    // 4️⃣ Crear la ODT con el ID de la pivot
    $orden = OrdenDeTrabajo::create([
        'titular_vehiculo_id' => $pivot->id,
        'medio_de_pago_id'    => $data['medio_de_pago_id'],
        'estado_id'           => $data['estado_id'],
        'fecha'               => $data['fecha'],
        'observacion'         => $data['observacion'] ?? null,
    ]);

    return redirect()->route('ordenes.index')
        ->with('success', 'Orden creada correctamente ✅ (ID: '.$orden->id.')');
}


    public function show(string $id)
    {
        $orden = OrdenDeTrabajo::with([
            'titularVehiculo.titular',
            'titularVehiculo.vehiculo',
            'estado',
            'medioDePago'
        ])->findOrFail($id);

        return Inertia::render('ordenes/show', [
            'orden' => $orden
        ]);
    }

    public function edit(string $id)
    {
        $orden = OrdenDeTrabajo::with([
            'titularVehiculo.titular',
            'titularVehiculo.vehiculo'
        ])->findOrFail($id);

        return Inertia::render('ordenes/edit', [
            'orden' => $orden
        ]);
    }

    public function update(Request $request, string $id)
    {
        $orden = OrdenDeTrabajo::findOrFail($id);

        $data = $request->validate([
            'titular_vehiculo_id' => 'sometimes|required|exists:titular_vehiculo,id',
            'medio_de_pago_id'    => 'sometimes|required|exists:medio_de_pago,id',
            'estado_id'           => 'sometimes|required|exists:estado,id',
            'fecha'               => 'sometimes|required|date',
            'observacion'         => 'nullable|string|max:150',
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
