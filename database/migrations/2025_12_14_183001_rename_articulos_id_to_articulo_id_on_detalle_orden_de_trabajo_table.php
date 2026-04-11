<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('detalle_orden_de_trabajo', function (Blueprint $table) {
            $table->renameColumn('articulos_id', 'articulo_id');
        });
    }

    public function down(): void
    {
        Schema::table('detalle_orden_de_trabajo', function (Blueprint $table) {
            $table->renameColumn('articulo_id', 'articulos_id');
        });
    }
};
