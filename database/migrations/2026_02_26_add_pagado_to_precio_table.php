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
        Schema::table('precio', function (Blueprint $table) {
            // Agregar campo pagado (boolean) para indicar si ya se cobró
            $table->boolean('pagado')->default(false)->after('fecha');
        });

        // Marcar como pagados todos los pagos existentes (retrocompatibilidad)
        DB::statement('UPDATE precio SET pagado = 1');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('precio', function (Blueprint $table) {
            $table->dropColumn('pagado');
        });
    }
};