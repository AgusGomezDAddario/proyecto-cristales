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
        Schema::create('titular_vehiculo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('titular_id');
            $table->unsignedBigInteger('vehiculo_id');
            $table->timestamps();

            // 🔹 Foreign Keys
            $table->foreign('titular_id')->references('id')->on('titular')->cascadeOnDelete();
            $table->foreign('vehiculo_id')->references('id')->on('vehiculo')->cascadeOnDelete();

            // 🔹 Evitar duplicados: un mismo titular no puede estar 2 veces con el mismo auto
            $table->unique(['titular_id', 'vehiculo_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('titular_vehiculo');
    }
};
