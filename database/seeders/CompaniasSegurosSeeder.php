<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CompaniaSeguro;

class CompaniasSegurosSeeder extends Seeder
{
    public function run(): void
    {
        $nombres = [
            'La Caja',
            'San Cristóbal',
            'Sancor Seguros',
            'Federación Patronal',
            'Rivadavia',
            'Mercantil Andina',
            'Allianz',
            'Mapfre',
            'Zurich',
            'Provincia Seguros',
        ];

        foreach ($nombres as $nombre) {
            CompaniaSeguro::updateOrCreate(
                ['nombre' => $nombre],
                ['activo' => true]
            );
        }
    }
}
