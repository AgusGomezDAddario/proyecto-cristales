<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function () {
            $destino = DB::table('estado')->where('nombre', 'Finalizada - Para Retirar')->value('id');
            if (!$destino) {
                $destino = DB::table('estado')->where('nombre', 'Finalizada')->value('id');
                if ($destino) {
                    DB::table('estado')->where('id', $destino)->update(['nombre' => 'Finalizada - Para Retirar']);
                } else {
                    $destino = DB::table('estado')->insertGetId(['nombre' => 'Finalizada - Para Retirar']);
                }
            }

            $anteriores = DB::table('estado')
                ->whereIn('nombre', ['Completada por taller', 'Finalizada'])
                ->pluck('id');

            foreach (['orden_de_trabajo', 'orden_de_trabajo_historial_estados'] as $tabla) {
                DB::table($tabla)->whereIn('estado_id', $anteriores)->update(['estado_id' => $destino]);
            }
            DB::table('estado')->whereIn('id', $anteriores)->delete();
            DB::table('estado')->updateOrInsert(['nombre' => 'Retirada'], ['nombre' => 'Retirada']);
        });
    }

    public function down(): void
    {
        DB::transaction(function () {
            $finalizada = DB::table('estado')->where('nombre', 'Finalizada - Para Retirar')->value('id');
            $retirada = DB::table('estado')->where('nombre', 'Retirada')->value('id');
            if ($finalizada) {
                foreach (['orden_de_trabajo', 'orden_de_trabajo_historial_estados'] as $tabla) {
                    DB::table($tabla)->where('estado_id', $retirada)->update(['estado_id' => $finalizada]);
                }
                DB::table('estado')->where('id', $retirada)->delete();
                DB::table('estado')->where('id', $finalizada)->update(['nombre' => 'Finalizada']);
            }
            DB::table('estado')->updateOrInsert(['nombre' => 'Completada por taller'], ['nombre' => 'Completada por taller']);
        });
    }
};
