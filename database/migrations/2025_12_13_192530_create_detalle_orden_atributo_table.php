<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detalle_orden_atributo', function (Blueprint $table) {
    $table->id();

    $table->foreignId('detalle_orden_de_trabajo_id')
        ->constrained('detalle_orden_de_trabajo')
        ->cascadeOnDelete();

    $table->foreignId('categorias_id')
        ->constrained('categorias');

    $table->foreignId('subcategorias_id')
        ->constrained('subcategorias');

    $table->timestamps();

    $table->unique(
        ['detalle_orden_de_trabajo_id', 'categorias_id'],
        'detalle_categoria_unique'
    );
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_orden_atributo');
    }
};
