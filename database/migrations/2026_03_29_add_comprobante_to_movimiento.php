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
        Schema::table('movimiento', function (Blueprint $table) {
            // Agregamos comprobante si no existe
            if (!Schema::hasColumn('movimiento', 'comprobante')) {
                $table->string('comprobante', 255)->nullable()->after('medio_de_pago_id');
            }

            // Agregamos orden_de_trabajo_id si no existe
            if (!Schema::hasColumn('movimiento', 'orden_de_trabajo_id')) {
                // Lo definimos como nullable por si hay movimientos no vinculados a una orden
                $table->foreignId('orden_de_trabajo_id')
                      ->nullable()
                      ->constrained('orden_de_trabajo') // Asumiendo que la tabla se llama 'orden_de_trabajo'
                      ->onDelete('set null') // Si se borra la orden, el movimiento queda pero sin el vínculo
                      ->after('comprobante');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimiento', function (Blueprint $table) {
            // Eliminamos la clave foránea y la columna
            if (Schema::hasColumn('movimiento', 'orden_de_trabajo_id')) {
                $table->dropForeign(['orden_de_trabajo_id']);
                $table->dropColumn('orden_de_trabajo_id');
            }
            
            if (Schema::hasColumn('movimiento', 'comprobante')) {
                $table->dropColumn('comprobante');
            }
        });
    }
};