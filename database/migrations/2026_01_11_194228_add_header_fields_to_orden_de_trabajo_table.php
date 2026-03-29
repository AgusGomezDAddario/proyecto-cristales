<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            // Si querés orden visible de negocio
            $table->string('numero_orden', 30)->nullable()->after('id');

            // Requerida por UI (date alcanza si no necesitás hora)
            $table->date('fecha_entrega_estimada')->nullable()->after('fecha');

            // Flag de negocio
            $table->boolean('es_garantia')->default(false)->after('con_factura');

            // Si querés evitar duplicados
            $table->unique('numero_orden');
        });
    }

    public function down(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            $table->dropUnique(['numero_orden']);
            $table->dropColumn(['numero_orden', 'fecha_entrega_estimada', 'es_garantia']);
        });
    }
};
