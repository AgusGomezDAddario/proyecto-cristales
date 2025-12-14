<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Articulo;
use App\Models\Categoria;
use App\Models\Subcategoria;

class CatalogoArticulosSeeder extends Seeder
{
    public function run(): void
    {
        // ARTÍCULO: Ventana fija / móvil
        $ventana = Articulo::create([
            'nombre' => 'Ventana fija / móvil',
            'activo' => true,
        ]);

        $lado = Categoria::create([
            'articulo_id' => $ventana->id,
            'nombre' => 'Lado',
            'obligatoria' => true,
            'activo' => true,
        ]);

        Subcategoria::insert([
            ['categoria_id' => $lado->id, 'nombre' => 'Izquierda', 'activo' => true],
            ['categoria_id' => $lado->id, 'nombre' => 'Derecha',   'activo' => true],
        ]);

        $posicion = Categoria::create([
            'articulo_id' => $ventana->id,
            'nombre' => 'Posición',
            'obligatoria' => true,
            'activo' => true,
        ]);

        Subcategoria::insert([
            ['categoria_id' => $posicion->id, 'nombre' => 'Delantero', 'activo' => true],
            ['categoria_id' => $posicion->id, 'nombre' => 'Medio',     'activo' => true],
            ['categoria_id' => $posicion->id, 'nombre' => 'Trasero',   'activo' => true],
        ]);

        // ARTÍCULO: Parabrisas
        $parabrisas = Articulo::create([
            'nombre' => 'Parabrisas',
            'activo' => true,
        ]);

        $color = Categoria::create([
            'articulo_id' => $parabrisas->id,
            'nombre' => 'Color',
            'obligatoria' => false,
            'activo' => true,
        ]);

        Subcategoria::insert([
            ['categoria_id' => $color->id, 'nombre' => 'Verde',    'activo' => true],
            ['categoria_id' => $color->id, 'nombre' => 'Degradé',  'activo' => true],
            ['categoria_id' => $color->id, 'nombre' => 'Incoloro', 'activo' => true],
        ]);

        $caracteristicas = Categoria::create([
            'articulo_id' => $parabrisas->id,
            'nombre' => 'Características',
            'obligatoria' => false,
            'activo' => true,
        ]);

        Subcategoria::insert([
            ['categoria_id' => $caracteristicas->id, 'nombre' => 'Con antena', 'activo' => true],
            ['categoria_id' => $caracteristicas->id, 'nombre' => 'Con sensor', 'activo' => true],
            ['categoria_id' => $caracteristicas->id, 'nombre' => 'Con cámara', 'activo' => true],
        ]);

        // ARTÍCULO: Luneta
        $luneta = Articulo::create([
            'nombre' => 'Luneta',
            'activo' => true,
        ]);

        $config = Categoria::create([
            'articulo_id' => $luneta->id,
            'nombre' => 'Configuración',
            'obligatoria' => true,
            'activo' => true,
        ]);

        Subcategoria::create([
            'categoria_id' => $config->id,
            'nombre' => 'Enteriza',
            'activo' => true,
        ]);

        $tratamiento = Categoria::create([
            'articulo_id' => $luneta->id,
            'nombre' => 'Tratamiento',
            'obligatoria' => false,
            'activo' => true,
        ]);

        Subcategoria::create([
            'categoria_id' => $tratamiento->id,
            'nombre' => 'Térmica',
            'activo' => true,
        ]);

        // ARTÍCULO: Sellado / Pegado espejo (sin atributos)
        Articulo::insert([
            ['nombre' => 'Sellado',          'activo' => true],
            ['nombre' => 'Pegado de espejo', 'activo' => true],
        ]);
    }
}
