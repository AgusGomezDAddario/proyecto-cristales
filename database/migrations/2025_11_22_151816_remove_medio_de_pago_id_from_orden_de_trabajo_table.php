<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            $table->dropForeign(['medio_de_pago_id']);
            $table->dropColumn('medio_de_pago_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orden_de_trabajo', function (Blueprint $table) {
            $table->foreignId('medio_de_pago_id')->nullable()->constrained('medio_de_pago');
        });
    }
};
