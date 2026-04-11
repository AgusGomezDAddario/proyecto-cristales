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
        // =========================================================
        // Helpers internos
        // =========================================================

        $createArticulo = function (string $nombre, bool $activo = true): Articulo {
            return Articulo::firstOrCreate(
                ['nombre' => $nombre],
                ['activo' => $activo]
            );
        };

        $createCategoria = function (int $articuloId, string $nombre, bool $obligatoria, bool $activo = true): Categoria {
            return Categoria::firstOrCreate(
                ['articulo_id' => $articuloId, 'nombre' => $nombre],
                ['obligatoria' => $obligatoria, 'activo' => $activo]
            );
        };

        $createSubcategorias = function (int $categoriaId, array $nombres, bool $activo = true): void {
            foreach ($nombres as $nombre) {
                Subcategoria::firstOrCreate(
                    ['categoria_id' => $categoriaId, 'nombre' => $nombre],
                    ['activo' => $activo]
                );
            }
        };

        // =========================================================
        // BASE (lo que ya tenías)
        // =========================================================

        // ARTÍCULO: Ventana fija / móvil
        $ventana = $createArticulo('Ventana fija / móvil', true);

        $lado = $createCategoria($ventana->id, 'Lado', true, true);
        $createSubcategorias($lado->id, ['Izquierda', 'Derecha']);

        $posicion = $createCategoria($ventana->id, 'Posición', true, true);
        $createSubcategorias($posicion->id, ['Delantero', 'Medio', 'Trasero']);

        // ARTÍCULO: Parabrisas
        $parabrisas = $createArticulo('Parabrisas', true);

        $color = $createCategoria($parabrisas->id, 'Color', false, true);
        $createSubcategorias($color->id, ['Verde', 'Degradé', 'Incoloro']);

        $caracteristicas = $createCategoria($parabrisas->id, 'Características', false, true);
        $createSubcategorias($caracteristicas->id, ['Con antena', 'Con sensor', 'Con cámara']);

        // ARTÍCULO: Luneta
        $luneta = $createArticulo('Luneta', true);

        $config = $createCategoria($luneta->id, 'Configuración', true, true);
        $createSubcategorias($config->id, ['Enteriza']);

        $tratamiento = $createCategoria($luneta->id, 'Tratamiento', false, true);
        $createSubcategorias($tratamiento->id, ['Térmica']);

        // ARTÍCULO: Sellado / Pegado espejo (sin atributos)
        $createArticulo('Sellado', true);
        $createArticulo('Pegado de espejo', true);

        // =========================================================
        // AMPLIACIÓN (NUEVO CATALOGO)
        // =========================================================

        // ---------------------------------------------------------
        // A) Custodio
        // ---------------------------------------------------------
        $custodio = $createArticulo('Custodio', true);

        $c_lado = $createCategoria($custodio->id, 'Lado', true, true);
        $createSubcategorias($c_lado->id, ['Izquierda', 'Derecha']);

        $c_pos = $createCategoria($custodio->id, 'Posición', true, true);
        $createSubcategorias($c_pos->id, ['Delantero', 'Central', 'Trasero']);

        $c_tipo = $createCategoria($custodio->id, 'Tipo', false, true);
        $createSubcategorias($c_tipo->id, ['Fijo', 'Corredizo']);

        $c_color = $createCategoria($custodio->id, 'Color', false, true);
        $createSubcategorias($c_color->id, ['Incoloro', 'Verde', 'Fumé']);

        // ---------------------------------------------------------
        // B) Ventanal de micro
        // ---------------------------------------------------------
        $ventanalMicro = $createArticulo('Ventanal de micro', true);

        $vm_lado = $createCategoria($ventanalMicro->id, 'Lado', true, true);
        $createSubcategorias($vm_lado->id, ['Izquierda', 'Derecha']);

        $vm_seccion = $createCategoria($ventanalMicro->id, 'Sección', true, true);
        $createSubcategorias($vm_seccion->id, ['Delantero', 'Medio', 'Trasero']);

        $vm_apertura = $createCategoria($ventanalMicro->id, 'Tipo de apertura', false, true);
        $createSubcategorias($vm_apertura->id, ['Fijo', 'Corredizo', 'Rebatible']);

        $vm_color = $createCategoria($ventanalMicro->id, 'Color', false, true);
        $createSubcategorias($vm_color->id, ['Incoloro', 'Fumé', 'Tonalizado']);

        $vm_trat = $createCategoria($ventanalMicro->id, 'Tratamiento', false, true);
        $createSubcategorias($vm_trat->id, ['Laminado', 'Templado']);

        // ---------------------------------------------------------
        // C) Parabrisas de micro
        // ---------------------------------------------------------
        $parabrisasMicro = $createArticulo('Parabrisas de micro', true);

        $pm_config = $createCategoria($parabrisasMicro->id, 'Configuración', true, true);
        $createSubcategorias($pm_config->id, ['Enterizo', 'Bipartido']);

        $pm_color = $createCategoria($parabrisasMicro->id, 'Color', true, true);
        $createSubcategorias($pm_color->id, ['Incoloro', 'Verde', 'Degradé']);

        $pm_caract = $createCategoria($parabrisasMicro->id, 'Características', false, true);
        $createSubcategorias($pm_caract->id, ['Con sensor', 'Con cámara', 'Con antena']);

        $pm_altura = $createCategoria($parabrisasMicro->id, 'Altura', false, true);
        $createSubcategorias($pm_altura->id, ['Estándar', 'Alto', 'Extra alto']);

        // ---------------------------------------------------------
        // D) Luneta de micro
        // ---------------------------------------------------------
        $lunetaMicro = $createArticulo('Luneta de micro', true);

        $lm_config = $createCategoria($lunetaMicro->id, 'Configuración', true, true);
        $createSubcategorias($lm_config->id, ['Enteriza', 'Bipartida']);

        $lm_trat = $createCategoria($lunetaMicro->id, 'Tratamiento', true, true);
        $createSubcategorias($lm_trat->id, ['Térmica', 'No térmica']);

        $lm_color = $createCategoria($lunetaMicro->id, 'Color', false, true);
        $createSubcategorias($lm_color->id, ['Incoloro', 'Fumé']);

        $lm_curv = $createCategoria($lunetaMicro->id, 'Curvatura', false, true);
        $createSubcategorias($lm_curv->id, ['Plana', 'Curva']);

        // ---------------------------------------------------------
        // E) Adicionales (para cobertura operativa)
        // ---------------------------------------------------------

        // Vidrio lateral de micro
        $lateralMicro = $createArticulo('Vidrio lateral de micro', true);

        $vlm_lado = $createCategoria($lateralMicro->id, 'Lado', true, true);
        $createSubcategorias($vlm_lado->id, ['Izquierda', 'Derecha']);

        $vlm_pos = $createCategoria($lateralMicro->id, 'Posición', true, true);
        $createSubcategorias($vlm_pos->id, ['Delantero', 'Medio', 'Trasero']);

        $vlm_tipo = $createCategoria($lateralMicro->id, 'Tipo', false, true);
        $createSubcategorias($vlm_tipo->id, ['Fijo', 'Corredizo']);

        $vlm_color = $createCategoria($lateralMicro->id, 'Color', false, true);
        $createSubcategorias($vlm_color->id, ['Incoloro', 'Fumé', 'Tonalizado']);

        // Vidrio de puerta (genérico)
        $puerta = $createArticulo('Vidrio de puerta', true);

        $vp_lado = $createCategoria($puerta->id, 'Lado', true, true);
        $createSubcategorias($vp_lado->id, ['Izquierda', 'Derecha']);

        $vp_tipo_puerta = $createCategoria($puerta->id, 'Tipo de puerta', false, true);
        $createSubcategorias($vp_tipo_puerta->id, ['Delantera', 'Trasera', 'Baúl/Portón']);

        $vp_color = $createCategoria($puerta->id, 'Color', false, true);
        $createSubcategorias($vp_color->id, ['Incoloro', 'Verde', 'Fumé']);
    }
}
