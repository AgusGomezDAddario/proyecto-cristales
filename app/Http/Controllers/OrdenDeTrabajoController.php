<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use App\Models\OrdenDeTrabajo;
use App\Models\Titular;
use App\Models\Vehiculo;
use App\Models\TitularVehiculo;
use App\Models\Estado;
use App\Models\MedioDePago;
use App\Models\DetalleOrdenDeTrabajo;
use App\Models\Precio;

// NUEVO: Catálogo Artículos/Categorías/Subcategorías
use App\Models\Articulo;

// NUEVO: Atributos por detalle (tabla puente)
use App\Models\DetalleOrdenAtributo;

class OrdenDeTrabajoController extends Controller
{
    public function index()
    {
        $ordenes = OrdenDeTrabajo::with([
            'titularVehiculo.titular',
            'titularVehiculo.vehiculo',
            'estado',
            'pagos.medioDePago'
        ])
            ->latest()
            ->paginate(10);

        return Inertia::render('ordenes/index', [
            'ordenes' => $ordenes
        ]);
    }

    public function create()
    {
        Log::info('🟢 Entrando a create() de OrdenDeTrabajoController');

        try {
            $titulares = Titular::with('vehiculos:id,patente,marca,modelo,anio')
                ->select('id', 'nombre', 'apellido', 'telefono', 'email')
                ->get();

            Log::info('✅ Titulares cargados correctamente', ['count' => $titulares->count()]);
        } catch (\Exception $e) {
            Log::error('❌ Error al cargar titulares', ['message' => $e->getMessage()]);
            dd('Error al cargar titulares: ' . $e->getMessage());
        }

        try {
            $estados = Estado::select('id', 'nombre')->get();
            $mediosDePago = MedioDePago::select('id', 'nombre')->get();
            Log::info('✅ Estados y medios de pago cargados correctamente');
        } catch (\Exception $e) {
            Log::error('❌ Error al cargar estados o medios de pago', ['message' => $e->getMessage()]);
            dd('Error al cargar estados o medios de pago: ' . $e->getMessage());
        }

        // ✅ NUEVO: Catálogo de artículos con categorías y subcategorías para DetallesSection
        // Estructura esperada por el frontend:
        // articulosCatalog: [{ id, nombre, categorias: [{ id, nombre, subcategorias: [{id, nombre}] }] }]
        $articulosCatalog = [];
        try {
            $articulosCatalog = Articulo::query()
                ->select('id', 'nombre')
                ->with([
                    'categorias:id,articulo_id,nombre',
                    'categorias.subcategorias:id,categoria_id,nombre',
                ])
                ->orderBy('nombre')
                ->get()
                ->map(function ($art) {
                    return [
                        'id' => $art->id,
                        'nombre' => $art->nombre,
                        'categorias' => $art->categorias->sortBy('nombre')->values()->map(function ($cat) {
                            return [
                                'id' => $cat->id,
                                'nombre' => $cat->nombre,
                                'subcategorias' => $cat->subcategorias->sortBy('nombre')->values()->map(function ($sub) {
                                    return [
                                        'id' => $sub->id,
                                        'nombre' => $sub->nombre,
                                    ];
                                })->values(),
                            ];
                        })->values(),
                    ];
                })
                ->values()
                ->toArray();

            Log::info('✅ Catálogo de artículos cargado', ['count' => count($articulosCatalog)]);
        } catch (\Exception $e) {
            // No lo freno con dd para no bloquear la pantalla: pero lo logueo fuerte.
            Log::error('❌ Error al cargar catálogo de artículos', ['message' => $e->getMessage()]);
            // Si querés que falle explícitamente:
            // dd('Error al cargar catálogo de artículos: ' . $e->getMessage());
        }

        Log::info('🚀 Renderizando vista createOrdenes');

        return Inertia::render('ordenes/createOrdenes', [
            'titulares' => $titulares,
            'estados' => $estados,
            'mediosDePago' => $mediosDePago,

            // ✅ NUEVO
            'articulosCatalog' => $articulosCatalog,
        ]);
    }

    public function store(Request $request)
    {
        /**
         * Nuevo contrato de detalles esperado desde frontend:
         * detalles: [
         *   {
         *     articulo_id: number,
         *     atributos: { [categoria_id]: subcategoria_id | null },
         *     descripcion: string,
         *     valor: number,
         *     cantidad: number,
         *     colocacion_incluida: boolean
         *   }
         * ]
         */

        $validated = $request->validate([
            'titular_id' => 'nullable|integer|exists:titular,id',
            'vehiculo_id' => 'nullable|integer|exists:vehiculo,id',

            'nuevo_titular' => 'nullable|array',
            'nuevo_titular.nombre' => 'required_without:titular_id|string|max:48',
            'nuevo_titular.apellido' => 'required_without:titular_id|string|max:48',
            'nuevo_titular.telefono' => 'nullable|string|max:20',
            'nuevo_titular.email' => 'nullable|email|max:48',

            'nuevo_vehiculo' => 'nullable|array',
            'nuevo_vehiculo.patente' => 'required_without:vehiculo_id|string|max:10',
            'nuevo_vehiculo.marca' => 'nullable|string|max:48',
            'nuevo_vehiculo.modelo' => 'nullable|string|max:48',
            'nuevo_vehiculo.anio' => 'nullable|integer|min:1900|max:' . date('Y'),

            'estado_id' => 'required|exists:estado,id',
            'fecha' => 'required|date',
            'observacion' => 'nullable|string|max:500',

            // ✅ Detalles (nuevo modelo)
            'detalles' => 'nullable|array',
            'detalles.*.articulo_id' => 'required|integer|exists:articulo,id',
            'detalles.*.atributos' => 'nullable|array', // categoria_id => subcategoria_id
            'detalles.*.descripcion' => 'nullable|string|max:255',
            'detalles.*.valor' => 'required|numeric|min:0.01',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.colocacion_incluida' => 'boolean',

            // Pagos (sin cambios)
            'pagos' => 'required|array|min:1',
            'pagos.*.medio_de_pago_id' => 'required|exists:medio_de_pago,id',
            'pagos.*.monto' => 'required|numeric|min:0',
            'pagos.*.observacion' => 'nullable|string|max:255',
        ]);

        $data = $request->all();

        $faltanDatos =
            (empty($data['titular_id']) && empty($data['nuevo_titular'])) ||
            (empty($data['vehiculo_id']) && empty($data['nuevo_vehiculo']));

        if ($faltanDatos) {
            return back()
                ->withErrors(['titular_vehiculo' => 'Debe seleccionar o crear un titular y un vehículo antes de guardar la orden.'])
                ->withInput();
        }

        // 1) Nuevo titular
        if (empty($data['titular_id']) && !empty($data['nuevo_titular'])) {
            $nuevoTitular = Titular::create([
                'nombre' => $data['nuevo_titular']['nombre'] ?? '',
                'apellido' => $data['nuevo_titular']['apellido'] ?? '',
                'telefono' => $data['nuevo_titular']['telefono'] ?? '',
                'email' => $data['nuevo_titular']['email'] ?? null,
            ]);
            $data['titular_id'] = $nuevoTitular->id;
        }

        // 2) Nuevo vehículo
        if (empty($data['vehiculo_id']) && !empty($data['nuevo_vehiculo'])) {
            $nuevoVehiculo = Vehiculo::create([
                'patente' => strtoupper($data['nuevo_vehiculo']['patente']),
                'marca' => $data['nuevo_vehiculo']['marca'] ?? '',
                'modelo' => $data['nuevo_vehiculo']['modelo'] ?? '',
                'anio' => $data['nuevo_vehiculo']['anio'] ?? null,
            ]);
            $data['vehiculo_id'] = $nuevoVehiculo->id;
        }

        // 3) Pivot titular-vehículo
        $pivot = TitularVehiculo::firstOrCreate([
            'titular_id' => $data['titular_id'],
            'vehiculo_id' => $data['vehiculo_id'],
        ]);

        // 4) Orden
        $orden = OrdenDeTrabajo::create([
            'titular_vehiculo_id' => $pivot->id,
            'estado_id' => $data['estado_id'],
            'fecha' => $data['fecha'],
            'observacion' => $data['observacion'] ?? null,
        ]);

        // 5) Pagos (sin cambios)
        if (!empty($data['pagos'])) {
            foreach ($data['pagos'] as $pago) {
                Precio::create([
                    'orden_de_trabajo_id' => $orden->id,
                    'medio_de_pago_id' => $pago['medio_de_pago_id'],
                    'valor' => $pago['monto'],
                    'observacion' => $pago['observacion'] ?? null,
                ]);
            }
        }

        // 6) Detalles + atributos (nuevo)
        if (!empty($data['detalles']) && is_array($data['detalles'])) {
            foreach ($data['detalles'] as $detalle) {

                // 6.1) Crear detalle con articulo_id
                $detalleCreado = DetalleOrdenDeTrabajo::create([
                    'orden_de_trabajo_id' => $orden->id,
                    'articulo_id' => $detalle['articulo_id'],
                //  'descripcion' => $detalle['descripcion'] ?? '',
                    'descripcion' => $detalle['descripcion'] ?? '',
                    'valor' => $detalle['valor'] ?? 0,
                    'cantidad' => $detalle['cantidad'] ?? 1,
                    'colocacion_incluida' => $detalle['colocacion_incluida'] ?? false,
                ]);

                // 6.2) Persistir atributos (si existen)
                // atributos: { categoria_id: subcategoria_id }
                if (!empty($detalle['atributos']) && is_array($detalle['atributos'])) {
                    foreach ($detalle['atributos'] as $categoriaId => $subcategoriaId) {
                        if (!$subcategoriaId) continue;

                        DetalleOrdenAtributo::create([
                            'detalle_orden_de_trabajo_id' => $detalleCreado->id,
                            'categoria_id' => (int) $categoriaId,
                            'subcategoria_id' => (int) $subcategoriaId,
                        ]);
                    }
                }
            }
        }

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
            'pagos.medioDePago',
            'detalles',
            // ✅ si agregás relaciones:
            // 'detalles.articulo',
            // 'detalles.atributos.categoria',
            // 'detalles.atributos.subcategoria',
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
            'estado_id' => 'required|exists:estado,id',
            'fecha' => 'required|date',
            'pagos' => 'required|array|min:1',
            'observacion' => 'nullable|string|max:150',
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
