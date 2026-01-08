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
        Schema::create('concepto', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50);
            $table->timestamps(); 
        });

        Schema::create('movimiento', function (Blueprint $table) {
            $table->id();
            $table->date('fecha')->index();
            $table->decimal('monto', 12, 2);
            $table->foreignId('concepto_id')->constrained('concepto')->restrictOnDelete();
            $table->string('comprobante')->nullable();
            $table->foreignId('medio_de_pago_id')->nullable()->constrained('medio_de_pago')->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimiento');
        Schema::dropIfExists('concepto');
    }
};
