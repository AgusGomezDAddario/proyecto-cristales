<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movimiento', function (Blueprint $table) {
            $table->boolean('es_caja_chica')
                  ->default(false)
                  ->after('comprobante')
                  ->index();
        });
    }

    public function down(): void
    {
        Schema::table('movimiento', function (Blueprint $table) {
            $table->dropColumn('es_caja_chica');
        });
    }
};
