<?php

namespace App\Http\Controllers;

use App\Models\Articulo;
use App\Models\Categoria;
use App\Models\Subcategoria;
use App\Models\DetalleOrdenDeTrabajo;
use App\Models\DetalleOrdenAtributo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ArticuloController extends Controller
{
    /**
     * Listado de artículos con filtros y paginación
     */
    public function index(Request $request)
    {
        $query = Articulo::withCount('categorias');

        // Búsqueda por nombre
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nombre', 'like', "%{$search}%");
        }

        $articulos = $query
            ->orderBy('nombre')
            ->paginate(20)
            ->withQueryString();

        // Estadísticas
        $stats = [
            'total' => Articulo::count(),
            'con_categorias' => Articulo::has('categorias')->count(),
            'sin_categorias' => Articulo::doesntHave('categorias')->count(),
        ];

        return Inertia::render('Articulos/Index', [
            'articulos' => $articulos,
            'filters' => $request->only(['search']),
            'stats' => $stats,
        ]);
    }

    /**
     * Crear nuevo artículo
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:articulos,nombre',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.unique' => 'Ya existe un artículo con ese nombre.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
        ]);

        Articulo::create([
            'nombre' => $validated['nombre'],
            'activo' => true,
        ]);

        return redirect()->back()->with('success', 'Artículo creado correctamente.');
    }

    /**
     * Actualizar artículo existente
     */
    public function update(Request $request, Articulo $articulo)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:articulos,nombre,' . $articulo->id,
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.unique' => 'Ya existe un artículo con ese nombre.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
        ]);

        $articulo->update([
            'nombre' => $validated['nombre'],
        ]);

        return redirect()->back()->with('success', 'Artículo actualizado correctamente.');
    }

    /**
     * Eliminar artículo
     */
    public function destroy(Articulo $articulo)
    {
        // Verificar si tiene detalles de orden asociados
        $tieneOrdenes = DetalleOrdenDeTrabajo::where('articulo_id', $articulo->id)->exists();

        if ($tieneOrdenes) {
            return redirect()->back()->with('error', 'No se puede eliminar: el artículo está siendo usado en órdenes de trabajo.');
        }

        // Eliminar en cascada: subcategorías -> categorías -> artículo
        DB::transaction(function () use ($articulo) {
            foreach ($articulo->categorias as $categoria) {
                // Eliminar subcategorías de esta categoría
                $categoria->subcategorias()->delete();
            }
            // Eliminar categorías del artículo
            $articulo->categorias()->delete();
            // Eliminar artículo
            $articulo->delete();
        });

        return redirect()->back()->with('success', 'Artículo eliminado correctamente junto con sus categorías y subcategorías.');
    }

    /**
     * Obtener categorías de un artículo (para modal/vista detalle)
     */
    public function getCategorias(Articulo $articulo)
    {
        $categorias = $articulo->categorias()
            ->withCount('subcategorias')
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'articulo' => $articulo,
            'categorias' => $categorias,
        ]);
    }

    /**
     * Crear nueva categoría para un artículo
     */
    public function storeCategoria(Request $request, Articulo $articulo)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'obligatoria' => 'required|boolean',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
            'obligatoria.required' => 'Debe indicar si es obligatoria.',
        ]);

        $categoria = Categoria::create([
            'articulo_id' => $articulo->id,
            'nombre' => $validated['nombre'],
            'obligatoria' => $validated['obligatoria'],
            'activo' => true,
        ]);

        return redirect()->back()->with('success', 'Categoría creada correctamente.');
    }

    /**
     * Actualizar categoría existente
     */
    public function updateCategoria(Request $request, Categoria $categoria)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'obligatoria' => 'required|boolean',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
            'obligatoria.required' => 'Debe indicar si es obligatoria.',
        ]);

        $categoria->update([
            'nombre' => $validated['nombre'],
            'obligatoria' => $validated['obligatoria'],
        ]);

        return redirect()->back()->with('success', 'Categoría actualizada correctamente.');
    }

    /**
     * Eliminar categoría
     */
    public function destroyCategoria(Categoria $categoria)
    {
        // Verificar si alguna subcategoría está en uso en órdenes
        $subcategoriaIds = $categoria->subcategorias()->pluck('id');
        $tieneOrdenes = DetalleOrdenAtributo::whereIn('subcategoria_id', $subcategoriaIds)->exists();

        if ($tieneOrdenes) {
            return redirect()->back()->with('error', 'No se puede eliminar: la categoría o sus subcategorías están siendo usadas en órdenes de trabajo.');
        }

        // Eliminar subcategorías primero, luego la categoría
        DB::transaction(function () use ($categoria) {
            $categoria->subcategorias()->delete();
            $categoria->delete();
        });

        return redirect()->back()->with('success', 'Categoría eliminada correctamente junto con sus subcategorías.');
    }

    /**
     * Obtener subcategorías de una categoría
     */
    public function getSubcategorias(Categoria $categoria)
    {
        $subcategorias = $categoria->subcategorias()
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'categoria' => $categoria->load('articulo'),
            'subcategorias' => $subcategorias,
        ]);
    }

    /**
     * Crear nueva subcategoría para una categoría
     */
    public function storeSubcategoria(Request $request, Categoria $categoria)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
        ]);

        Subcategoria::create([
            'categoria_id' => $categoria->id,
            'nombre' => $validated['nombre'],
            'activo' => true,
        ]);

        return redirect()->back()->with('success', 'Subcategoría creada correctamente.');
    }

    /**
     * Actualizar subcategoría existente
     */
    public function updateSubcategoria(Request $request, Subcategoria $subcategoria)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
        ]);

        $subcategoria->update([
            'nombre' => $validated['nombre'],
        ]);

        return redirect()->back()->with('success', 'Subcategoría actualizada correctamente.');
    }

    /**
     * Eliminar subcategoría
     */
    public function destroySubcategoria(Subcategoria $subcategoria)
    {
        // Verificar si está en uso en órdenes
        $tieneOrdenes = DetalleOrdenAtributo::where('subcategoria_id', $subcategoria->id)->exists();

        if ($tieneOrdenes) {
            return redirect()->back()->with('error', 'No se puede eliminar: la subcategoría está siendo usada en órdenes de trabajo.');
        }

        $subcategoria->delete();

        return redirect()->back()->with('success', 'Subcategoría eliminada correctamente.');
    }
}