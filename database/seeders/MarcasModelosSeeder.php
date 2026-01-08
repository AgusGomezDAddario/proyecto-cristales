<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Marca;
use App\Models\Modelo;
use Illuminate\Support\Facades\DB;

class MarcasModelosSeeder extends Seeder
{
    public function run(): void
    {
        // Lista Masiva de Marcas y sus Modelos
        // Estructura: 'NombreMarca' => ['Modelo1', 'Modelo2', ...]
        $vehiculos = [
            'Volkswagen' => [
                'Amarok',
                'Gol Trend',
                'Gol Power',
                'Polo',
                'Virtus',
                'Vento',
                'Bora',
                'Fox',
                'Suran',
                'CrossFox',
                'Up!',
                'T-Cross',
                'Nivus',
                'Taos',
                'Tiguan',
                'Saveiro',
                'Voyage',
                'Scirocco',
                'Beetle'
            ],
            'Fiat' => [
                'Cronos',
                'Strada',
                'Toro',
                'Argo',
                'Mobi',
                'Pulse',
                'Fastback',
                'Fiorino',
                'Palio',
                'Siena',
                'Grand Siena',
                'Punto',
                'Uno',
                'Uno Way',
                '500',
                'Ducato',
                'Idea',
                'Doblo'
            ],
            'Ford' => [
                'Ranger',
                'Ranger Raptor',
                'F-100',
                'EcoSport',
                'Fiesta Kinetic',
                'Fiesta One',
                'Focus',
                'Ka',
                'Ka+',
                'Territory',
                'Maverick',
                'Bronco',
                'Kuga',
                'Mondeo',
                'Transit',
                'Falcon',
                'Escort'
            ],
            'Chevrolet' => [
                'Cruze',
                'Onix',
                'Joy',
                'Prisma',
                'Tracker',
                'S10',
                'Trailblazer',
                'Spin',
                'Agile',
                'Cobalt',
                'Sonic',
                'Spark',
                'Captiva',
                'Corsa Classic',
                'Astra',
                'Vectra',
                'Meriva',
                'Aveo'
            ],
            'Renault' => [
                'Sandero',
                'Sandero Stepway',
                'Logan',
                'Kangoo',
                'Duster',
                'Duster Oroch',
                'Kwid',
                'Alaskan',
                'Captur',
                'Koleos',
                'Fluence',
                'Megane',
                'Clio Mío',
                'Clio',
                'Master',
                'Trafic',
                'Symbol',
                'Scenic'
            ],
            'Peugeot' => [
                '208',
                '2008',
                '3008',
                '5008',
                'Partner',
                '308',
                '408',
                '207 Compact',
                '206',
                'Expert',
                'Boxer',
                'Rifter'
            ],
            'Toyota' => [
                'Hilux',
                'Corolla',
                'Corolla Cross',
                'Etios',
                'Yaris',
                'SW4',
                'RAV4',
                'Camry',
                'Prius',
                'Hiace',
                'GT86'
            ],
            'Citroën' => [
                'C3',
                'C3 Aircross',
                'C4 Cactus',
                'Berlingo',
                'C4 Lounge',
                'C4',
                'Jumper',
                'C-Elysée',
                'Xsara Picasso',
                'DS3'
            ],
            'Nissan' => [
                'Frontier',
                'Kicks',
                'Versa',
                'Sentra',
                'March',
                'Note',
                'Tiida',
                'X-Trail'
            ],
            'Jeep' => [
                'Renegade',
                'Compass',
                'Commander',
                'Grand Cherokee',
                'Wrangler',
                'Gladiator'
            ],
            'Honda' => [
                'Civic',
                'HR-V',
                'CR-V',
                'Fit',
                'City',
                'WR-V',
                'Accord',
                'Pilot'
            ],
            'Mercedes-Benz' => [
                'Sprinter',
                'Clase A',
                'Clase C',
                'GLA',
                'GLC',
                'Vito'
            ],
            'BMW' => [
                'Serie 1',
                'Serie 3',
                'Serie 5',
                'X1',
                'X3',
                'X5'
            ],
            'Audi' => [
                'A1',
                'A3',
                'A4',
                'Q3',
                'Q5'
            ],
            'Hyundai' => [
                'Tucson',
                'Creta',
                'H1',
                'Santa Fe',
                'i10',
                'i30',
                'Veloster'
            ],
            'Kia' => [
                'Seltos',
                'Sportage',
                'Rio',
                'Picanto',
                'Carnival',
                'Sorento'
            ],
            'Chery' => [
                'Tiggo',
                'Tiggo 2',
                'Tiggo 4',
                'Tiggo 8',
                'QQ'
            ],
            'RAM' => [
                '1500',
                '2500'
            ],
            'Iveco' => [
                'Daily'
            ]
        ];

        // Desactivar temporalmente protección de timestamps para inserción masiva rápida
        // (Opcional, pero recomendado si son muchos datos)

        foreach ($vehiculos as $nombreMarca => $listaModelos) {
            // 1. Buscamos la marca o la creamos si no existe
            // firstOrCreate devuelve el objeto Marca (con su ID numérico asignado)
            $marca = Marca::firstOrCreate(
                ['nombre' => $nombreMarca]
            );

            // 2. Preparamos el array de modelos para insertar
            foreach ($listaModelos as $nombreModelo) {
                // Usamos firstOrCreate para evitar duplicados si corres el seeder 2 veces
                Modelo::firstOrCreate([
                    'marca_id' => $marca->id,
                    'nombre' => $nombreModelo
                ]);
            }
        }

        $this->command->info('✅ Base de datos poblada exitosamente manteniendo estructura estándar.');
    }
}