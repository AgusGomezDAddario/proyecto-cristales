<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('detalle_orden_atributo', function (Blueprint $table) {

            if (Schema::hasColumn('detalle_orden_atributo', 'categorias_id')) {
                $table->renameColumn('categorias_id', 'categoria_id');
            }

            if (Schema::hasColumn('detalle_orden_atributo', 'subcategorias_id')) {
                $table->renameColumn('subcategorias_id', 'subcategoria_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('detalle_orden_atributo', function (Blueprint $table) {

            if (Schema::hasColumn('detalle_orden_atributo', 'categoria_id')) {
                $table->renameColumn('categoria_id', 'categorias_id');
            }

            if (Schema::hasColumn('detalle_orden_atributo', 'subcategoria_id')) {
                $table->renameColumn('subcategoria_id', 'subcategorias_id');
            }
        });
    }
};
