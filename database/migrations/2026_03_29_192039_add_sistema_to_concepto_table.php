<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('concepto', function (Blueprint $table) {
            $table->boolean('sistema')->default(false)->after('tipo');
        });

        // Marcar conceptos del sistema como no editables
        DB::table('concepto')
            ->whereIn('nombre', ['Anulación OT'])
            ->update(['sistema' => true]);
    }

    public function down(): void
    {
        Schema::table('concepto', function (Blueprint $table) {
            $table->dropColumn('sistema');
        });
    }
};
