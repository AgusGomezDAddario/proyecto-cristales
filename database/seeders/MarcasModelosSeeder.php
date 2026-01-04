<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Marca;
use App\Models\Modelo;

class MarcasModelosSeeder extends Seeder
{
    public function run(): void
    {
        $marcasConModelos = [
            'Toyota' => ['Corolla', 'Hilux', 'Etios', 'Yaris', 'RAV4', 'Camry'],
            'Ford' => ['Focus', 'Ranger', 'Fiesta', 'EcoSport', 'Ka', 'Mondeo'],
            'Chevrolet' => ['Onix', 'Cruze', 'S10', 'Tracker', 'Prisma', 'Spin'],
            'Volkswagen' => ['Gol', 'Polo', 'Amarok', 'Vento', 'Tiguan', 'Suran'],
            'Fiat' => ['Cronos', 'Argo', 'Toro', 'Palio', 'Strada', 'Pulse'],
            'Renault' => ['Sandero', 'Logan', 'Duster', 'Kangoo', 'Captur', 'Alaskan'],
            'Peugeot' => ['208', '308', '408', '2008', '3008', 'Partner'],
            'Citroën' => ['C3', 'C4', 'Berlingo', 'C4 Cactus', 'Jumper'],
            'Honda' => ['Civic', 'HR-V', 'CR-V', 'Fit', 'City', 'Accord'],
            'Nissan' => ['Versa', 'Kicks', 'Frontier', 'Sentra', 'X-Trail', 'March'],
            'Hyundai' => ['Creta', 'Tucson', 'i30', 'Elantra', 'Santa Fe', 'Venue'],
            'Jeep' => ['Renegade', 'Compass', 'Grand Cherokee', 'Wrangler'],
            'Mercedes-Benz' => ['Clase A', 'Clase C', 'Clase E', 'GLA', 'GLC', 'Sprinter'],
            'BMW' => ['Serie 1', 'Serie 3', 'Serie 5', 'X1', 'X3', 'X5'],
            'Audi' => ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
        ];

        foreach ($marcasConModelos as $nombreMarca => $modelos) {
            // Crear la marca
            $marca = Marca::create(['nombre' => $nombreMarca]);

            // Crear los modelos de esa marca
            foreach ($modelos as $nombreModelo) {
                Modelo::create([
                    'marca_id' => $marca->id,
                    'nombre' => $nombreModelo
                ]);
            }
        }

        $this->command->info('✅ Marcas y modelos cargados correctamente.');
    }
}
