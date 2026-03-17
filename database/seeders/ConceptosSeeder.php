<?php

namespace Database\Seeders;

use App\Models\Concepto;
use Illuminate\Database\Seeder;

class ConceptosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Conceptos de INGRESO
        Concepto::firstOrCreate(
            ['id' => 3],
            ['nombre' => 'Cobro a clientes', 'tipo' => 'ingreso']
        );

        Concepto::firstOrCreate(
            ['nombre' => 'Venta de servicios', 'tipo' => 'ingreso'],
            ['tipo' => 'ingreso']
        );

        // Conceptos de EGRESO
        Concepto::firstOrCreate(
            ['nombre' => 'Colocación / Mano de obra', 'tipo' => 'egreso'],
            ['tipo' => 'egreso']
        );

        Concepto::firstOrCreate(
            ['nombre' => 'Reposición de vidrios', 'tipo' => 'egreso'],
            ['tipo' => 'egreso']
        );

        Concepto::firstOrCreate(
            ['nombre' => 'Impuestos y tasas', 'tipo' => 'egreso'],
            ['tipo' => 'egreso']
        );

        Concepto::firstOrCreate(
            ['nombre' => 'Otros', 'tipo' => 'egreso'],
            ['tipo' => 'egreso']
        );

        // NUEVO: Concepto para ajustes negativos
        Concepto::firstOrCreate(
            ['id' => 7],
            ['nombre' => 'Ajuste de cobro', 'tipo' => 'egreso']
        );
    }
}