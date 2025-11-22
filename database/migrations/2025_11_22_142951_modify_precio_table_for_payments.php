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
        Schema::dropIfExists('orden_pagos');

        Schema::table('precio', function (Blueprint $table) {
            $table->string('observacion', 255)->nullable();
            $table->decimal('valor', 12, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('precio', function (Blueprint $table) {
            $table->dropColumn('observacion');
            $table->decimal('valor', 12, 2)->nullable(false)->change();
        });

        Schema::create('orden_pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('orden_de_trabajo_id')->constrained('orden_de_trabajo')->onDelete('cascade');
            $table->foreignId('medio_de_pago_id')->constrained('medio_de_pago');
            $table->decimal('monto', 10, 2);
            $table->timestamps();
        });
    }
};
