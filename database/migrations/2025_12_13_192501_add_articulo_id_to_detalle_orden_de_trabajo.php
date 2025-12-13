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
        Schema::table('detalle_orden_de_trabajo', function (Blueprint $table) {
    $table->foreignId('articulo_id')
        ->after('orden_de_trabajo_id')
        ->constrained('articulo');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_orden_de_trabajo', function (Blueprint $table) {
            //
        });
    }
};
