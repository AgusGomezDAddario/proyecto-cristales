<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatosInicialesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('medio_de_pago')->insert([
            ['nombre' => 'Efectivo'],
            ['nombre' => 'Crédito'],
            ['nombre' => 'Débito'],
            ['nombre' => 'Transferencia'],
            ['nombre' => 'Cheque'],
        ]);

        DB::table('estado')->insert([
            ['nombre' => 'Iniciado'],
            ['nombre' => 'Pendiente'],
            ['nombre' => 'Completada'],
            ['nombre' => 'Pagado'],
        ]);
    }
}
