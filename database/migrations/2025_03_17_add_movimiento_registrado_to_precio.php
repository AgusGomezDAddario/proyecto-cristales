<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('precio', function (Blueprint $table) {
            $table->boolean('movimiento_registrado')->default(false)->after('bloqueado');
        });

        // Marcar como registrado todos los pagos bloqueados existentes
        DB::table('precio')
            ->where('bloqueado', true)
            ->update(['movimiento_registrado' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('precio', function (Blueprint $table) {
            $table->dropColumn('movimiento_registrado');
        });
    }
};