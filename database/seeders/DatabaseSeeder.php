<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\MetricsDemoSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DatosInicialesSeeder::class,
            CatalogoArticulosSeeder::class,
            CompaniasSegurosSeeder::class,
            ConceptoSeeder::class,
            MarcasModelosSeeder::class,
            MetricsDemoSeeder::class,
        ]);
    }
}
