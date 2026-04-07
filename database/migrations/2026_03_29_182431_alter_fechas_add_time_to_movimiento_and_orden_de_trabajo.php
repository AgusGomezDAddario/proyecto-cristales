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
            $table->dateTime('fecha')->change();
        });

        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            $table->dateTime('fecha_entrega_estimada')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimiento', function (Blueprint $table) {
            $table->date('fecha')->change();
        });

        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            $table->date('fecha_entrega_estimada')->nullable()->change();
        });
    }
};
