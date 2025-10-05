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
use App\Models\DetalleOrdenDeTrabajo;

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
    \Log::info('🟢 Entrando a create() de OrdenDeTrabajoController');

    try {
        $titulares = Titular::with('vehiculos:id,patente,marca,modelo,anio')
            ->select('id', 'nombre', 'apellido', 'telefono', 'email')
            ->get();

        \Log::info('✅ Titulares cargados correctamente', ['count' => $titulares->count()]);
    } catch (\Exception $e) {
        \Log::error('❌ Error al cargar titulares', ['message' => $e->getMessage()]);
        dd('Error al cargar titulares: ' . $e->getMessage());
    }

    try {
        $estados = Estado::select('id', 'nombre')->get();
        $mediosDePago = MedioDePago::select('id', 'nombre')->get();
        \Log::info('✅ Estados y medios de pago cargados correctamente');
    } catch (\Exception $e) {
        \Log::error('❌ Error al cargar estados o medios de pago', ['message' => $e->getMessage()]);
        dd('Error al cargar estados o medios de pago: ' . $e->getMessage());
    }

    \Log::info('🚀 Renderizando vista createOrdenes');

    return Inertia::render('ordenes/createOrdenes', [
        'titulares'    => $titulares,
        'estados'      => $estados,
        'mediosDePago' => $mediosDePago,
    ]);
}




    public function store(Request $request)
{
    // Lo que hace validate es asegurarse que los datos cumplen ciertas reglas, en caso contrario lanza un error y vuelve al formulario
        $validated = $request->validate([
            'titular_id'       => 'nullable|integer|exists:titular,id', // Puede ser null, entero y debe existir
            'vehiculo_id'      => 'nullable|integer|exists:vehiculo,id',

            'nuevo_titular'              => 'nullable|array',
            'nuevo_titular.nombre'       => 'required_without:titular_id|string|max:48',
            'nuevo_titular.apellido'     => 'required_without:titular_id|string|max:48',
            'nuevo_titular.telefono'     => 'nullable|string|max:20',
            'nuevo_titular.email'        => 'nullable|email|max:48',

            'nuevo_vehiculo'             => 'nullable|array',
            'nuevo_vehiculo.patente'     => 'required_without:vehiculo_id|string|max:10',
            'nuevo_vehiculo.marca'       => 'nullable|string|max:48',
            'nuevo_vehiculo.modelo'      => 'nullable|string|max:48',
            'nuevo_vehiculo.anio'        => 'nullable|integer|min:1900|max:' . date('Y'),


            'medio_de_pago_id' => 'required|exists:medio_de_pago,id', // Debe existir
            'estado_id'        => 'required|exists:estado,id', // Debe existir
            'fecha'            => 'required|date', // Fecha requerida
            'observacion'      => 'nullable|string|max:500', // Puede ser null o string con max 500 caracteres
            'detalles'                     => 'nullable|array',
            'detalles.*.descripcion'       => 'nullable|string|max:255',
            'detalles.*.valor'             => 'nullable|numeric|min:0',
            'detalles.*.cantidad'          => 'nullable|integer|min:1',
            'detalles.*.colocacion_incluida' => 'boolean',    
        ]);

        $data = $request->all();

        // No se puede crear una ODT sin titular y vehículo (ya existente o nuevo)
        $faltanDatos =
            (empty($data['titular_id']) && empty($data['nuevo_titular'])) ||
            (empty($data['vehiculo_id']) && empty($data['nuevo_vehiculo']));

        if ($faltanDatos) {
            return back()
                ->withErrors(['titular_vehiculo' => 'Debe seleccionar o crear un titular y un vehículo antes de guardar la orden.'])
                ->withInput();
        }

        // 1️⃣ Crear nuevo titular si corresponde
        if (empty($data['titular_id']) && !empty($data['nuevo_titular'])) {
            $nuevoTitular = Titular::create([
                'nombre'   => $data['nuevo_titular']['nombre'] ?? '',
                'apellido' => $data['nuevo_titular']['apellido'] ?? '',
                'telefono' => $data['nuevo_titular']['telefono'] ?? '',
                'email'    => $data['nuevo_titular']['email'] ?? null,
            ]);
            $data['titular_id'] = $nuevoTitular->id;
        }

        // 2️⃣ Crear nuevo vehículo si corresponde
        if (empty($data['vehiculo_id']) && !empty($data['nuevo_vehiculo'])) {
            $nuevoVehiculo = Vehiculo::create([
                'patente' => strtoupper($data['nuevo_vehiculo']['patente']),
                'marca'   => $data['nuevo_vehiculo']['marca'] ?? '',
                'modelo'  => $data['nuevo_vehiculo']['modelo'] ?? '',
                'anio'    => $data['nuevo_vehiculo']['anio'] ?? null,
            ]);
            $data['vehiculo_id'] = $nuevoVehiculo->id;
        }

        // 3️⃣ Crea o recupera la relación pivot entre titular y vehículo
        $pivot = TitularVehiculo::firstOrCreate([
            'titular_id'  => $data['titular_id'],
            'vehiculo_id' => $data['vehiculo_id'],
        ]);

        // 4️⃣ Crear la Orden de Trabajo
        $orden = OrdenDeTrabajo::create([
            'titular_vehiculo_id' => $pivot->id,
            'medio_de_pago_id'    => $data['medio_de_pago_id'],
            'estado_id'           => $data['estado_id'],
            'fecha'               => $data['fecha'],
            'observacion'         => $data['observacion'] ?? null,
        ]);

        // Guardar detalles si se enviaron
        if (!empty($data['detalles']) && is_array($data['detalles'])) {
            foreach ($data['detalles'] as $detalle) {
                DetalleOrdenDeTrabajo::create([
                    'descripcion'          => $detalle['descripcion'] ?? '',
                    'valor'                => $detalle['valor'] ?? 0,
                    'cantidad'             => $detalle['cantidad'] ?? 1,
                    'colocacion_incluida'  => $detalle['colocacion_incluida'] ?? false,
                    'orden_de_trabajo_id'  => $orden->id,
                ]);
            }
        }

        // 5️⃣ Redirigir con mensaje de éxito
        return redirect()
            ->route('ordenes.index')
            ->with('success', 'Orden creada correctamente ✅ (ID: ' . $orden->id . ')');
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
