<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('caja_diaria', function (Blueprint $table) {
            $table->id();

            // 1 registro por día
            $table->date('fecha')->unique();

            // Apertura
            $table->timestamp('opened_at')->nullable();
            $table->decimal('opening_balance', 12, 2)->default(0);

            // Ajustar 'users' si tu tabla se llama distinto
            $table->foreignId('opened_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Cierre
            $table->timestamp('closed_at')->nullable();

            $table->foreignId('closed_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('closing_notes')->nullable();

            // Congelar totales al cierre (recomendado para auditoría)
            $table->json('totals_snapshot')->nullable();

            $table->timestamps();

            $table->index('fecha');
            $table->index('opened_at');
            $table->index('closed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caja_diaria');
    }
};
