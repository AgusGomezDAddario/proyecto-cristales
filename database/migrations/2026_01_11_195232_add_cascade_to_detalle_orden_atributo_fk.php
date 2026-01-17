<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('detalle_orden_atributo', function (Blueprint $table) {

            // eliminamos la FK actual
            $table->dropForeign(['detalle_orden_de_trabajo_id']);

            // la recreamos con cascade
            $table->foreign('detalle_orden_de_trabajo_id')
                ->references('id')
                ->on('detalle_orden_de_trabajo')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('detalle_orden_atributo', function (Blueprint $table) {

            $table->dropForeign(['detalle_orden_de_trabajo_id']);

            $table->foreign('detalle_orden_de_trabajo_id')
                ->references('id')
                ->on('detalle_orden_de_trabajo');
        });
    }
};
