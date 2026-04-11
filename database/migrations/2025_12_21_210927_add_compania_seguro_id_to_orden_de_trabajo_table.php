<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            $table->foreignId('compania_seguro_id')
                ->nullable()
                ->after('titular_vehiculo_id')
                ->constrained('companias_seguros')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            $table->dropConstrainedForeignId('compania_seguro_id');
        });
    }
};
