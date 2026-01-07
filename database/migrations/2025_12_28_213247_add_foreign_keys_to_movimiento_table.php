<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movimiento', function (Blueprint $table) {
            // Si ya existen FKs, esto puede fallar: por eso sugiero revisar en DB
            // o ejecutar en una BD limpia. Si querés lo hacemos "safe" con SQL crudo.

            // concepto_id -> concepto.id
            $table->foreign('concepto_id', 'movimiento_concepto_fk')
                ->references('id')->on('concepto')
                ->restrictOnDelete(); // no borrar conceptos si hay movimientos

            // medio_de_pago_id -> medio_de_pago.id
            $table->foreign('medio_de_pago_id', 'movimiento_medio_pago_fk')
                ->references('id')->on('medio_de_pago')
                ->nullOnDelete(); // si se borra el medio, no rompe histórico
        });
    }

    public function down(): void
    {
        Schema::table('movimiento', function (Blueprint $table) {
            $table->dropForeign('movimiento_concepto_fk');
            $table->dropForeign('movimiento_medio_pago_fk');
        });
    }
};
