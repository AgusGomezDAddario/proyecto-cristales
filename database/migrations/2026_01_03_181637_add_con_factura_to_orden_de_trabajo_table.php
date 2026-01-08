<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            $table->boolean('con_factura')->default(false)->after('fecha');
        });
    }

    public function down(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            $table->dropColumn('con_factura');
        });
    }
};
