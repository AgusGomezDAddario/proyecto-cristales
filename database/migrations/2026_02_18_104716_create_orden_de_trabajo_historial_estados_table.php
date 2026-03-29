<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('orden_de_trabajo_historial_estados', function (Blueprint $table) {
            $table->id();

            $table->foreignId('orden_de_trabajo_id')
                ->constrained('orden_de_trabajo')
                ->onDelete('cascade');

            $table->foreignId('estado_id')
                ->constrained('estado');

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users');

            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('orden_de_trabajo_historial_estados');
    }   

};
