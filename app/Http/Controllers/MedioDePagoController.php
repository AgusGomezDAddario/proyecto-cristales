<?php

namespace App\Http\Controllers;

use App\Models\MedioDePago;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedioDePagoController extends Controller
{
        public function index(Request $request)
    {
        $search = $request->search;

        $medios = MedioDePago::when($search, fn ($q) =>
                $q->where('nombre', 'like', "%{$search}%")
            )
            ->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('medios-de-pago/index', [
            'medios' => $medios,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100|unique:medio_de_pago,nombre',
        ]);

        MedioDePago::create($request->only('nombre'));

        return redirect()->back();
    }

    public function update(Request $request, MedioDePago $MedioDePago)
    {
        $request->validate([
            'nombre' => 'required|string|max:100|unique:medio_de_pago,nombre,' . $MedioDePago->id,
        ]);

        $MedioDePago->update($request->only('nombre'));

        return redirect()->back();
    }

    public function destroy(MedioDePago $MedioDePago)
    {
        $cantMovimientos = $MedioDePago->movimientos()->count();
        if ($cantMovimientos > 0) {
            return redirect()->back();
        }
        $MedioDePago->delete();
        return redirect()->back();
    }
}