<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vehiculo', function (Blueprint $table) {
            // Eliminar las columnas antiguas marca y modelo (strings)
            if (Schema::hasColumn('vehiculo', 'marca')) {
                $table->dropColumn('marca');
            }
            if (Schema::hasColumn('vehiculo', 'modelo')) {
                $table->dropColumn('modelo');
            }

            // Agregar las nuevas claves foráneas
            $table->foreignId('marca_id')
                ->nullable()
                ->after('patente')
                ->constrained('marcas')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('modelo_id')
                ->nullable()
                ->after('marca_id')
                ->constrained('modelos')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('vehiculo', function (Blueprint $table) {
            // Eliminar las claves foráneas
            if (Schema::hasColumn('vehiculo', 'marca_id')) {
                $table->dropForeign(['marca_id']);
                $table->dropColumn('marca_id');
            }
            if (Schema::hasColumn('vehiculo', 'modelo_id')) {
                $table->dropForeign(['modelo_id']);
                $table->dropColumn('modelo_id');
            }

            // Restaurar las columnas antiguas
            $table->string('marca', 50)->nullable()->after('patente');
            $table->string('modelo', 50)->nullable()->after('marca');
        });
    }
};
