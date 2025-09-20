<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medio_de_pago', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50);
            $table->timestamps();
        });

        Schema::create('estado', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50);
            $table->timestamps();
        });

        Schema::create('titular', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50);
            $table->string('apellido', 50);
            $table->string('telefono', 20)->nullable();
            $table->string('email', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('vehiculo', function (Blueprint $table) {
            $table->id();
            $table->string('patente', 10)->unique();
            $table->string('marca', 50)->nullable();
            $table->string('modelo', 50)->nullable();
            $table->unsignedSmallInteger('anio')->nullable();
            $table->foreignId('titular_id')->nullable()
                  ->constrained('titular')->cascadeOnUpdate()->restrictOnDelete();
            $table->timestamps();
        });

        Schema::create('orden_de_trabajo', function (Blueprint $table) {
            $table->id();
            $table->text('observacion')->nullable();
            $table->dateTime('fecha');

            $table->foreignId('medio_de_pago_id')->nullable()
                  ->constrained('medio_de_pago')->cascadeOnUpdate()->restrictOnDelete();

            $table->foreignId('titular_id')
                  ->constrained('titular')->cascadeOnUpdate()->restrictOnDelete();

            $table->foreignId('estado_id')
                  ->constrained('estado')->cascadeOnUpdate()->restrictOnDelete();

            $table->timestamps();

            $table->index(['fecha', 'estado_id']);
        });

        Schema::create('detalle_orden_de_trabajo', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion', 255)->nullable();
            $table->decimal('valor', 12, 2)->default(0);
            $table->unsignedInteger('cantidad')->default(1);
            $table->boolean('colocacion_incluida')->default(false);

            $table->foreignId('orden_de_trabajo_id')
                  ->constrained('orden_de_trabajo')->cascadeOnUpdate()->restrictOnDelete();

            $table->timestamps();
        });

        Schema::create('precio', function (Blueprint $table) {
            $table->id();
            $table->decimal('valor', 12, 2);

            $table->foreignId('orden_de_trabajo_id')
                  ->constrained('orden_de_trabajo')->cascadeOnUpdate()->restrictOnDelete();

            $table->foreignId('medio_de_pago_id')
                  ->constrained('medio_de_pago')->cascadeOnUpdate()->restrictOnDelete();

            $table->decimal('valor_pagado', 12, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('precio');
        Schema::dropIfExists('detalle_orden_de_trabajo');
        Schema::dropIfExists('orden_de_trabajo');
        Schema::dropIfExists('vehiculo');
        Schema::dropIfExists('titular');
        Schema::dropIfExists('estado');
        Schema::dropIfExists('medio_de_pago');
    }
};
