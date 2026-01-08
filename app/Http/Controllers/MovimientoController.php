<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Movimiento;
use App\Models\Concepto;
use App\Models\MedioDePago;
use App\Models\Comprobante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

abstract class MovimientoController extends Controller
{

    /**
     * Tipo de movimiento ('ingreso' o 'egreso').
     * Cada subcontrolador va a definirlo.
     */
    protected string $tipo;

    /**
     * Nombre para mostrar en las vistas.
     */
    protected string $label;

    /**
     * Ruta base para las rutas del tipo de movimiento
     */
    protected string $ruta;

    /**
     * Listado de movimientos según el tipo
     */
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

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        $conceptos = Concepto::where('tipo', $this->tipo)->orderBy('nombre', 'asc')->get();
        $mediosDePago = MedioDePago::orderBy('nombre', 'asc')->get();

        return Inertia::render('movimientos/create', [
            'conceptos' => $conceptos,
            'mediosDePago' => $mediosDePago,
            'tipo' => $this->tipo,
            'label' => ucfirst($this->label)
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
            'comprobantes'     => 'nullable|array',
            'comprobantes.*'   => 'file|mimes:jpg,jpeg,png,pdf|max:20480',
        ]);

        $data['tipo'] = $this->tipo;

        $movimiento = Movimiento::create($data);

        // Guardar comprobantes si vienen
        if ($request->hasFile('comprobantes')) {
            foreach ($request->file('comprobantes') as $archivo) {
                $path = $archivo->store('comprobantes/' . $this->tipo, 'public');

                Comprobante::create([
                    'movimiento_id' => $movimiento->id,
                    'ruta_archivo'  => $path,
                ]);
            }
        }

        return redirect()->route($this->ruta . '.index')
            ->with('success', $this->label . ' registrado correctamente');
    }

    /**
     * Mostrar un movimiento específico
     */
    public function show($id)
    {
        $movimiento = Movimiento::with(['concepto', 'medioDePago', 'comprobantes'])->findOrFail($id);

        return Inertia::render('movimientos/show', [
            'movimiento' => $movimiento,
            'label' => ucfirst($this->label),
            'tipo' => $this->tipo,
        ]);
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit($id)
    {
        $movimiento = Movimiento::with(['concepto', 'medioDePago', 'comprobantes'])->findOrFail($id);
        $conceptos = Concepto::where('tipo', $this->tipo)->orderBy('nombre', 'asc')->get();
        $mediosDePago = MedioDePago::orderBy('nombre', 'asc')->get();

        return Inertia::render('movimientos/edit', [
            'movimiento' => $movimiento,
            'conceptos' => $conceptos,
            'mediosDePago' => $mediosDePago,
            'label' => ucfirst($this->label),
            'tipo' => $this->tipo,
        ]);
    }

    /**
     * Actualizar un movimiento
     */
    public function update(Request $request, $id)
    {
    //     dd(
    //     $request->headers->get('content-type'),
    //     $request->all(),
    //     $request->allFiles()
    // );

        $movimiento = Movimiento::findOrFail($id);
        //dd($request->all());

        $data = $request->validate([
            'fecha'                  => 'required|date',
            'monto'                  => 'required|numeric|min:0',
            'concepto_id'            => 'required|exists:concepto,id',
            'medio_de_pago_id'       => 'nullable|exists:medio_de_pago,id',

            'comprobantes'           => 'nullable|array',
            'comprobantes.*'         => 'file|mimes:jpg,jpeg,png,pdf|max:20480',

            'comprobantes_a_eliminar' => 'nullable|array',
            'comprobantes_a_eliminar.*' => 'integer|exists:comprobantes,id',
        ]);

        $movimiento->update($data);

        // 1) ELIMINAR comprobantes marcados
        if (!empty($data['comprobantes_a_eliminar'])) {
            foreach ($data['comprobantes_a_eliminar'] as $cid) {
                $comp = Comprobante::find($cid);
                if ($comp) {
                    Storage::disk('public')->delete($comp->ruta_archivo);
                    $comp->delete();
                }
            }
        }

        // 2) AGREGAR los nuevos comprobantes
        if ($request->hasFile('comprobantes')) {
            foreach ($request->file('comprobantes') as $archivo) {
                $path = $archivo->store("comprobantes/{$this->tipo}", 'public');
                Comprobante::create([
                    'movimiento_id' => $movimiento->id,
                    'ruta_archivo'  => $path,
                ]);
            }
        }

        return redirect()->route($this->ruta . '.index')
            ->with('success', $this->label . ' actualizado correctamente');
    }


    /**
     * Eliminar un movimiento
     */
    public function destroy(Movimiento $movimiento)
    {
        $movimiento->delete();

        return redirect()->route($this->ruta . '.index')
            ->with('success', $this->label . ' eliminado correctamente');
    }
}
