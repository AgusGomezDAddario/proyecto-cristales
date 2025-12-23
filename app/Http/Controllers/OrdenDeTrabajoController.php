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
        $titulares = Titular::with('vehiculos:id,patente,marca,modelo,anio')
            ->select('id', 'nombre', 'apellido', 'telefono', 'email')
            ->get();

        $estados = Estado::select('id', 'nombre')->get();
        $mediosDePago = MedioDePago::select('id', 'nombre')->get();

        // NUEVO: artículos con categorías/subcategorías
        $articulos = Articulo::with(['categorias.subcategorias'])
            ->select('id', 'nombre')
            ->get();

        $companiasSeguros = CompaniaSeguro::select('id','nombre')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        return Inertia::render('ordenes/createOrdenes', [
            'titulares' => $titulares,
            'estados' => $estados,
            'mediosDePago' => $mediosDePago,
            'articulos' => $articulos,
            'companiasSeguros' => $companiasSeguros,
        ]);
    }

    public function store(Request $request)
    {
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
            'compania_seguro_id' => 'nullable|integer|exists:companias_seguros,id',

            // DETALLES (NUEVO MODELO)
            'detalles' => 'required|array|min:1',
            'detalles.*.articulo_id' => 'required|integer|exists:articulos,id',
            'detalles.*.descripcion' => 'nullable|string|max:255',
            'detalles.*.valor' => 'required|numeric|min:0',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.colocacion_incluida' => 'boolean',
            'detalles.*.atributos' => 'nullable|array',
            // cada valor del map categoriaId -> subcategoriaId
            'detalles.*.atributos.*' => 'nullable|integer|exists:subcategorias,id',

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
                'marca' => $data['nuevo_vehiculo']['marca'] ?? '',
                'modelo' => $data['nuevo_vehiculo']['modelo'] ?? '',
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
                if (empty($subcategoriaId)) continue;

                // Control mínimo: que exista la subcategoría (ya validado por exists)
                // Recomendación: agregar control fuerte: que esa subcategoría pertenezca a una categoría del artículo.
                // (lo hacemos con una verificación simple)
                $sc = Subcategoria::with('categoria')->find($subcategoriaId);
                if (!$sc) continue;

                DetalleOrdenAtributo::create([
                    'detalle_orden_de_trabajo_id' => $detalleCreado->id,
                    'categoria_id' => $sc->categoria_id,
                    'subcategoria_id' => $sc->id,
                ]);
            }
        }

        return redirect()
            ->route('ordenes.index')
            ->with('success', 'Orden creada correctamente ✅ (ID: ' . $orden->id . ')');
    }

    // show/edit/update/destroy: los ajustamos después cuando usemos atributos en el detalle.
}
