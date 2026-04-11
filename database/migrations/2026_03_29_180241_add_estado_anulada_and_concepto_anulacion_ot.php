<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Agregar estado "Anulada"
        DB::table('estado')->insert([
            'nombre' => 'Anulada',
        ]);

        // Agregar concepto "Anulación OT" para movimientos de reversa
        DB::table('concepto')->insert([
            'nombre' => 'Anulación OT',
            'tipo' => 'egreso',
        ]);
    }

    public function down(): void
    {
        DB::table('estado')->where('nombre', 'Anulada')->delete();
        DB::table('concepto')->where('nombre', 'Anulación OT')->delete();
    }
};
