<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            // 🔻 Eliminar columnas antiguas si existen
            if (Schema::hasColumn('orden_de_trabajo', 'titular_id')) {
                try {
                    $table->dropForeign(['titular_id']); // si no existe la FK, ignora
                } catch (\Exception $e) {
                    // opcional: \Log::warning('No se encontró FK titular_id: '.$e->getMessage());
                }
                $table->dropColumn('titular_id');
            }

            if (Schema::hasColumn('orden_de_trabajo', 'vehiculo_id')) {
                try {
                    $table->dropForeign(['vehiculo_id']);
                } catch (\Exception $e) {}
                $table->dropColumn('vehiculo_id');
            }

            // 🔺 Agregar la nueva FK a la tabla pivot
            if (!Schema::hasColumn('orden_de_trabajo', 'titular_vehiculo_id')) {
                $table->unsignedBigInteger('titular_vehiculo_id')->after('id');
                $table->foreign('titular_vehiculo_id')
                      ->references('id')
                      ->on('titular_vehiculo')
                      ->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            // 🔻 Eliminar la nueva FK
            if (Schema::hasColumn('orden_de_trabajo', 'titular_vehiculo_id')) {
                $table->dropForeign(['titular_vehiculo_id']);
                $table->dropColumn('titular_vehiculo_id');
            }

            // 🔺 Restaurar columnas antiguas
            if (!Schema::hasColumn('orden_de_trabajo', 'titular_id')) {
                $table->unsignedBigInteger('titular_id')->nullable();
                $table->foreign('titular_id')->references('id')->on('titular')->cascadeOnDelete();
            }

            if (!Schema::hasColumn('orden_de_trabajo', 'vehiculo_id')) {
                $table->unsignedBigInteger('vehiculo_id')->nullable();
                $table->foreign('vehiculo_id')->references('id')->on('vehiculo')->cascadeOnDelete();
            }
        });
    }
};
