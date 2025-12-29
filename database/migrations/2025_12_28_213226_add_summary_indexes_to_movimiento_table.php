<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movimiento', function (Blueprint $table) {
            // Filtro típico del resumen: fecha + tipo (ingreso/egreso)
            $table->index(['fecha', 'tipo'], 'movimiento_fecha_tipo_idx');

            // Resumen por medio de pago (group by)
            $table->index(['fecha', 'tipo', 'medio_de_pago_id'], 'movimiento_fecha_tipo_medio_idx');

            // Si listás por concepto en el resumen, este ayuda
            $table->index(['fecha', 'tipo', 'concepto_id'], 'movimiento_fecha_tipo_concepto_idx');
        });
    }

    public function down(): void
    {
        Schema::table('movimiento', function (Blueprint $table) {
            $table->dropIndex('movimiento_fecha_tipo_idx');
            $table->dropIndex('movimiento_fecha_tipo_medio_idx');
            $table->dropIndex('movimiento_fecha_tipo_concepto_idx');
        });
    }
};
