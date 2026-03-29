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
            // Agregar campo bloqueado para indicar que un pago ya no puede modificarse
            $table->boolean('bloqueado')->default(false)->after('pagado');
        });

        // Marcar como bloqueados todos los pagos existentes que ya están cobrados
        DB::statement('UPDATE precio SET bloqueado = 1 WHERE pagado = 1');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('precio', function (Blueprint $table) {
            $table->dropColumn('bloqueado');
        });
    }
};