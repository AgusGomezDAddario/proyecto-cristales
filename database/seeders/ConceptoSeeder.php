<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Concepto;

class ConceptoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
$conceptos = [
    ['nombre' => 'Venta de productos'],
    ['nombre' => 'Venta de servicios'],
    ['nombre' => 'Cobro a clientes'],
    // ... etc
];

        foreach ($conceptos as $concepto) {
            Concepto::create($concepto);
        }
    }
}