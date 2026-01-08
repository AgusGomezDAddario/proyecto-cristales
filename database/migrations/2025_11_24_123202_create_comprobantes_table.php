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
            $table->dropColumn('comprobante');
        });

        Schema::create('comprobantes', function (Blueprint $table) {
            $table->id();
            $table->string('ruta_archivo');
            $table->unsignedBigInteger('movimiento_id');
            $table->foreign('movimiento_id')->references('id')->on('movimiento')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimiento', function (Blueprint $table) {
            $table->string('comprobante')->nullable()->after('medio_de_pago_id');
        });

        Schema::dropIfExists('comprobantes');
    }
};
