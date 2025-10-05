<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detalle_orden_de_trabajo', function (Blueprint $table) {
            // Eliminamos la FK vieja
            $table->dropForeign(['orden_de_trabajo_id']);

            // Y la volvemos a crear con eliminación en cascada
            $table->foreign('orden_de_trabajo_id')
                  ->references('id')
                  ->on('orden_de_trabajo')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('detalle_orden_de_trabajo', function (Blueprint $table) {
            // revertimos el cambio
            $table->dropForeign(['orden_de_trabajo_id']);

            $table->foreign('orden_de_trabajo_id')
                  ->references('id')
                  ->on('orden_de_trabajo');
        });
    }
};
