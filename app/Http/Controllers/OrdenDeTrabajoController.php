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
use App\Models\DetalleOrdenAtributo;
use App\Models\Precio;
use App\Models\Articulo;
use App\Models\Subcategoria;
use App\Models\CompaniaSeguro;
use App\Models\Movimiento;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrdenDeTrabajoController extends Controller
{
    public function index(Request $request)
{
    $perPage = $request->integer('per_page', 10);

    $ordenes = OrdenDeTrabajo::query()
        ->with([
            'titularVehiculo.titular',
            'titularVehiculo.vehiculo.marca',
            'titularVehiculo.vehiculo.modelo',
            'estado',
        ])

        // 🔍 Búsqueda unificada
        ->when($request->filled('q'), function ($query) use ($request) {
            $q = $request->q;

            $query->where(function ($sub) use ($q) {
                $sub->whereHas('titularVehiculo.titular', function ($q2) use ($q) {
                        $q2->where('nombre', 'like', "%{$q}%")
                        ->orWhere('apellido', 'like', "%{$q}%");
                    })
                    ->orWhereHas('titularVehiculo.vehiculo', function ($q2) use ($q) {
                        $q2->where('patente', 'like', "%{$q}%");
                    });
            });
        })

        // 🟦 Estado
        ->when($request->filled('estado_id'), fn ($q) =>
            $q->where('estado_id', $request->estado_id)
        )

        // 🧾 Con / Sin factura
        ->when($request->filled('con_factura'), function ($q) use ($request) {
            // acepta '1' o '0'
            $q->where('con_factura', (int) $request->con_factura);
        })  

        // 📅 Rango de fechas
        ->when($request->filled('date_from'), fn ($q) =>
            $q->whereDate('fecha', '>=', $request->date_from)
        )
        ->when($request->filled('date_to'), fn ($q) =>
            $q->whereDate('fecha', '<=', $request->date_to)
        )

        ->orderByDesc('fecha')
        ->paginate($perPage)
        ->withQueryString();

        $estados = Estado::select('id', 'nombre')
        ->orderBy('nombre')
        ->get();

    return Inertia::render('ordenes/index', [
    'ordenes' => $ordenes,
    'estados' => $estados,
    'filters' => $request->only([
        'q',
        'estado_id',
        'con_factura',
        'date_from',
        'date_to',
        'per_page',
        ]),
    ]);

}

    public function create()
    {
        $titulares = Titular::with([
            'vehiculos' => function ($query) {
                $query->select('vehiculo.id', 'patente', 'marca_id', 'modelo_id', 'anio');
                // si necesitás datos del pivot:
                // $query->withPivot('titular_id', 'vehiculo_id'); // (opcional)
            }
        ])->select('id', 'nombre', 'apellido', 'telefono', 'email')
        ->get();

        $estados = Estado::select('id', 'nombre')->get();
        $mediosDePago = MedioDePago::select('id', 'nombre')->get();

        // NUEVO: artículos con categorías/subcategorías
        $articulos = Articulo::with(['categorias.subcategorias'])
            ->select('id', 'nombre')
            ->get();

        $companiasSeguros = \App\Models\CompaniaSeguro::query()
    ->where('activo', 1)
    ->orderBy('nombre')
    ->get(['id', 'nombre']);

        return Inertia::render('ordenes/createOrdenes', [
            'titulares' => $titulares,
            'estados' => $estados,
            'mediosDePago' => $mediosDePago,
            'articulos' => $articulos,
            'companiasSeguros' => $companiasSeguros,
            'con_factura' => ($data['tipo_documento'] ?? 'OT') === 'FC',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
        // Cabecera
        'estado_id' => 'required|exists:estado,id',
        'fecha' => 'required|date',
        'fecha_entrega_estimada' => 'required|date|after_or_equal:fecha',
        'observacion' => 'nullable|string|max:500',
        'tipo_documento' => 'required|in:FC,OT',
        'compania_seguro_id' => [
  'nullable',
  'integer',
  Rule::exists('companias_seguros', 'id')->whereNull('deleted_at')->where('activo', 1),
],
        'es_garantia' => 'required|boolean',
        'numero_orden' => 'nullable|string|max:32',

        // Detalles
        'detalles' => 'required|array|min:1',
        'detalles.*.articulo_id' => 'required|integer|exists:articulos,id',
        'detalles.*.descripcion' => 'nullable|string|max:255',
        'detalles.*.valor' => 'required|numeric|min:0',
        'detalles.*.cantidad' => 'required|integer|min:1',
        'detalles.*.colocacion_incluida' => 'boolean',
        'detalles.*.atributos' => 'nullable|array',
        'detalles.*.atributos.*' => 'nullable|integer|exists:subcategorias,id',

        // Pagos
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

        // 1) Crear titular si corresponde
        if (empty($data['titular_id']) && !empty($data['nuevo_titular'])) {
            $nuevoTitular = Titular::create([
                'nombre' => $data['nuevo_titular']['nombre'] ?? '',
                'apellido' => $data['nuevo_titular']['apellido'] ?? '',
                'telefono' => $data['nuevo_titular']['telefono'] ?? '',
                'email' => $data['nuevo_titular']['email'] ?? null,
            ]);
            $data['titular_id'] = $nuevoTitular->id;
        }

        // 2) Crear vehículo si corresponde
        if (empty($data['vehiculo_id']) && !empty($data['nuevo_vehiculo'])) {
            $nuevoVehiculo = Vehiculo::create([
                'patente' => strtoupper($data['nuevo_vehiculo']['patente']),
                'marca_id' => $data['nuevo_vehiculo']['marca_id'] ?? null,
                'modelo_id' => $data['nuevo_vehiculo']['modelo_id'] ?? null,
                'anio' => $data['nuevo_vehiculo']['anio'] ?? null,
            ]);
            $data['vehiculo_id'] = $nuevoVehiculo->id;
        }

        // 3) Pivot titular-vehiculo
        $pivot = TitularVehiculo::firstOrCreate([
            'titular_id' => $data['titular_id'],
            'vehiculo_id' => $data['vehiculo_id'],
        ]);

        // 4) Crear OT
        $orden = OrdenDeTrabajo::create([
            'titular_vehiculo_id' => $pivot->id,
            'estado_id' => $data['estado_id'],
            'fecha' => $data['fecha'],
            'fecha_entrega_estimada' => $data['fecha_entrega_estimada'],
            'numero_orden' => $data['numero_orden'],
            'con_factura' => (bool) ($data['con_factura'] ?? false),
            'es_garantia' => (bool) ($data['es_garantia'] ?? false),
            'observacion' => $data['observacion'] ?? null,
            'compania_seguro_id' => $data['compania_seguro_id'] ?? null,
        ]);

        // 5) Pagos
        foreach (($data['pagos'] ?? []) as $pago) {
            Precio::create([
                'orden_de_trabajo_id' => $orden->id,
                'medio_de_pago_id' => $pago['medio_de_pago_id'],
                'valor' => $pago['monto'],
                'observacion' => $pago['observacion'] ?? null,
            ]);
        }

        // 6) Detalles + atributos
        foreach (($data['detalles'] ?? []) as $detalle) {
            $detalleCreado = DetalleOrdenDeTrabajo::create([
                'orden_de_trabajo_id' => $orden->id,
                'articulo_id' => $detalle['articulo_id'],
                'descripcion' => $detalle['descripcion'] ?? null,
                'valor' => $detalle['valor'] ?? 0,
                'cantidad' => $detalle['cantidad'] ?? 1,
                'colocacion_incluida' => $detalle['colocacion_incluida'] ?? false,
            ]);

            $atributos = $detalle['atributos'] ?? [];

            // Persistimos solo las selecciones efectivas
            foreach ($atributos as $categoriaId => $subcategoriaId) {
                if (empty($subcategoriaId))
                    continue;

                // Control mínimo: que exista la subcategoría (ya validado por exists)
                // Recomendación: agregar control fuerte: que esa subcategoría pertenezca a una categoría del artículo.
                // (lo hacemos con una verificación simple)
                $sc = Subcategoria::with('categoria')->find($subcategoriaId);
                if (!$sc)
                    continue;

                DetalleOrdenAtributo::create([
                    'detalle_orden_de_trabajo_id' => $detalleCreado->id,
                    'categoria_id' => $sc->categoria_id,
                    'subcategoria_id' => $sc->id,
                ]);
            }
        }
// ... código existente de detalles y atributos ...

    // 🔥 NUEVO: Si se creó con estado "Pagado", registrar ingresos
    if ($orden->estado_id == 1) {
        $this->registrarIngresosDesdeOT($orden);
    }

    return redirect()
        ->route('ordenes.index')
        ->with('success', 'Orden creada correctamente ✅ (ID: ' . $orden->id . ')');
}

/**
 * Registra los ingresos basados en los pagos de la OT
 */
private function registrarIngresosDesdeOT(OrdenDeTrabajo $orden)
{
    try {
        $orden = $orden->fresh(['pagos']);      // fuerza carga de relación
        $pagos = $orden->pagos ?? collect();    // fallback seguro

        if ($pagos->isEmpty()) {
            Log::warning("La OT #{$orden->id} no tiene pagos registrados.");
            return;
        }

        foreach ($pagos as $pago) {
            Movimiento::create([
                'fecha' => $orden->fecha,
                'monto' => $pago->valor,
                'concepto_id' => 3,
                'medio_de_pago_id' => $pago->medio_de_pago_id,
                'comprobante' => "OT-{$orden->id}",
                'tipo' => 'ingreso',
            ]);
        }

        Log::info("✅ Ingresos registrados para la OT #{$orden->id}");
    } catch (\Exception $e) {
        Log::error("❌ Error al registrar ingresos para OT #{$orden->id}: " . $e->getMessage());
    }
}

public function update(Request $request, OrdenDeTrabajo $orden)
{
    $validated = $request->validate([
        // Cliente / Vehículo (editable)
        'titular_id' => 'nullable|integer|exists:titular,id',
        'vehiculo_id' => 'nullable|integer|exists:vehiculo,id',

        'nuevo_titular' => 'nullable|array',
        'nuevo_titular.nombre' => 'required_without:titular_id|string|max:48',
        'nuevo_titular.apellido' => 'required_without:titular_id|string|max:48',
        'nuevo_titular.telefono' => 'nullable|string|max:20',
        'nuevo_titular.email' => 'nullable|email|max:48',

        'nuevo_vehiculo' => 'nullable|array',
        'nuevo_vehiculo.patente' => 'required_without:vehiculo_id|string|max:10',
        'nuevo_vehiculo.marca_id' => 'nullable|integer|exists:marcas,id',
        'nuevo_vehiculo.modelo_id' => 'nullable|integer|exists:modelos,id',
        'nuevo_vehiculo.anio' => 'nullable|integer|min:1900|max:' . date('Y'),

        // Cabecera
        'estado_id' => 'required|exists:estado,id',
        'fecha' => 'required|date',
        'observacion' => 'nullable|string|max:500',
        'con_factura' => 'required|boolean',

        // si ya existen en DB, activalos:
        'fecha_entrega_estimada' => 'nullable|date',
        'numero_orden' => 'nullable|string|max:50',
        'es_garantia' => 'nullable|boolean',
        'compania_seguro_id' => [
  'nullable',
  'integer',
  Rule::exists('companias_seguros', 'id')->whereNull('deleted_at')->where('activo', 1),
],

        // Detalles
        'detalles' => 'required|array|min:1',
        'detalles.*.articulo_id' => 'required|integer|exists:articulos,id',
        'detalles.*.descripcion' => 'nullable|string|max:255',
        'detalles.*.valor' => 'required|numeric|min:0',
        'detalles.*.cantidad' => 'required|integer|min:1',
        'detalles.*.colocacion_incluida' => 'boolean',

        // Atributos (si los mandás desde DetallesSection)
        'detalles.*.atributos' => 'nullable|array',
        'detalles.*.atributos.*' => 'nullable|integer|exists:subcategorias,id',

        // Pagos
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

    DB::transaction(function () use ($validated, $data, $orden) {

        $estadoAnterior = (int) $orden->estado_id;

        // 1) Crear titular si corresponde
        if (empty($data['titular_id']) && !empty($data['nuevo_titular'])) {
            $nuevoTitular = Titular::create([
                'nombre' => $data['nuevo_titular']['nombre'] ?? '',
                'apellido' => $data['nuevo_titular']['apellido'] ?? '',
                'telefono' => $data['nuevo_titular']['telefono'] ?? '',
                'email' => $data['nuevo_titular']['email'] ?? null,
            ]);
            $data['titular_id'] = $nuevoTitular->id;
        }

        // 2) Crear vehículo si corresponde
        if (empty($data['vehiculo_id']) && !empty($data['nuevo_vehiculo'])) {
            $nuevoVehiculo = Vehiculo::create([
                'patente' => strtoupper($data['nuevo_vehiculo']['patente']),
                'marca_id' => $data['nuevo_vehiculo']['marca_id'] ?? null,
                'modelo_id' => $data['nuevo_vehiculo']['modelo_id'] ?? null,
                'anio' => $data['nuevo_vehiculo']['anio'] ?? null,
            ]);
            $data['vehiculo_id'] = $nuevoVehiculo->id;
        }

        // 3) Pivot titular-vehiculo (clave del update)
        $pivot = TitularVehiculo::firstOrCreate([
            'titular_id' => $data['titular_id'],
            'vehiculo_id' => $data['vehiculo_id'],
        ]);

        // 4) Cabecera
        $orden->update([
            'titular_vehiculo_id' => $pivot->id,
            'estado_id' => $validated['estado_id'],
            'fecha' => $validated['fecha'],
            'observacion' => $validated['observacion'] ?? null,
            'con_factura' => (bool) $validated['con_factura'],

            // si existen en DB:
            'fecha_entrega_estimada' => $validated['fecha_entrega_estimada'] ?? null,
            'numero_orden' => $validated['numero_orden'] ?? $orden->numero_orden ?? null,
            'es_garantia' => (bool)($validated['es_garantia'] ?? false),
            'compania_seguro_id' => $validated['compania_seguro_id'] ?? null,
        ]);

        // 5) Reemplazo detalles (y atributos)
        // OJO: si hay FK desde detalle_orden_atributo a detalle, borrá primero atributos.
        // Recomendación: cascade en DB o delete manual.
        foreach ($orden->detalles as $det) {
            // si tenés relación atributos():
            if (method_exists($det, 'atributos')) {
                $det->atributos()->delete();
            } else {
                // fallback: tabla directa si no hay relación
                DetalleOrdenAtributo::where('detalle_orden_de_trabajo_id', $det->id)->delete();
            }
        }

        $orden->detalles()->delete();

        foreach ($validated['detalles'] as $d) {
            $detalleCreado = DetalleOrdenDeTrabajo::create([
                'orden_de_trabajo_id' => $orden->id,
                'articulo_id' => $d['articulo_id'],
                'descripcion' => $d['descripcion'] ?? null,
                'valor' => $d['valor'],
                'cantidad' => $d['cantidad'],
                'colocacion_incluida' => $d['colocacion_incluida'] ?? false,
            ]);

            // Persistencia atributos (si llegan desde front)
            $atributos = $d['atributos'] ?? [];
            foreach ($atributos as $categoriaId => $subcategoriaId) {
                if (empty($subcategoriaId)) continue;

                $sc = Subcategoria::with('categoria')->find($subcategoriaId);
                if (!$sc) continue;

                DetalleOrdenAtributo::create([
                    'detalle_orden_de_trabajo_id' => $detalleCreado->id,
                    'categoria_id' => $sc->categoria_id,
                    'subcategoria_id' => $sc->id,
                ]);
            }
        }

        // 6) Reemplazo pagos
        $orden->pagos()->delete();

        foreach ($validated['pagos'] as $p) {
            Precio::create([
                'orden_de_trabajo_id' => $orden->id,
                'medio_de_pago_id' => $p['medio_de_pago_id'],
                'valor' => $p['monto'],
                'observacion' => $p['observacion'] ?? null,
            ]);
        }

        // 7) Si cambió a estado "Pagado" => registrar ingresos
        if ($estadoAnterior !== 1 && (int)$orden->estado_id === 1) {
            $this->registrarIngresosDesdeOT($orden);
        }
    });

    return redirect()
        ->route('ordenes.show', $orden->id)
        ->with('success', 'Orden actualizada correctamente ✅');
}

public function show(OrdenDeTrabajo $orden)
{
    Log::info('SHOW OT', ['id' => $orden->id]);
    $orden->load([
        'titularVehiculo.titular',
        'titularVehiculo.vehiculo.marca',
        'titularVehiculo.vehiculo.modelo',
        'estado',
        'detalles',
        'pagos.medioDePago',
        'companiaSeguro',
    ]);

    return Inertia::render('ordenes/show', [
        'orden' => $orden,
    ]);
}

public function edit(OrdenDeTrabajo $orden)
{
    Log::info('EDIT OT', ['id' => $orden->id]);
    $orden->load([
        'estado',
        'titularVehiculo.titular',
        'titularVehiculo.vehiculo.marca',
        'titularVehiculo.vehiculo.modelo',
        'detalles.atributos',     // si definís relación atributos en DetalleOrdenDeTrabajo
        'pagos.medioDePago',
        'companiaSeguro',
    ]);

    $titulares = Titular::with([
        'vehiculos' => function ($query) {
            $query->select('vehiculo.id', 'patente', 'marca_id', 'modelo_id', 'anio');
        }
    ])->select('id', 'nombre', 'apellido', 'telefono', 'email')
      ->get();

    $articulos = Articulo::with(['categorias.subcategorias'])
        ->select('id', 'nombre')
        ->get();

    $companiasSeguros = CompaniaSeguro::query()
    ->where('activo', 1)
    ->orderBy('nombre')
    ->get(['id', 'nombre']);

    $estados = Estado::select('id','nombre')->orderBy('nombre')->get();
    $mediosDePago = MedioDePago::select('id','nombre')->orderBy('nombre')->get();

    return Inertia::render('ordenes/edit', [
        'orden' => $orden,
        'titulares' => $titulares,
        'articulos' => $articulos,
        'companiasSeguros' => $companiasSeguros,
        'estados' => $estados,
        'mediosDePago' => $mediosDePago,
    ]);
}
    // show/edit/update/destroy: los ajustamos después cuando usemos atributos en el detalle.
}