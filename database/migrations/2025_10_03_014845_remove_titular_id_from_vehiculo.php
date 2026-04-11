<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehiculo', function (Blueprint $table) {
            if (Schema::hasColumn('vehiculo', 'titular_id')) {
                $table->dropForeign(['titular_id']);
                $table->dropColumn('titular_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vehiculo', function (Blueprint $table) {
            $table->unsignedBigInteger('titular_id')->nullable();
            $table->foreign('titular_id')->references('id')->on('titular')->cascadeOnDelete();
        });
    }
};
