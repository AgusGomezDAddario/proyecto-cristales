<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TitularVehiculo;
use App\Models\Titular;
use App\Models\Vehiculo;
use App\Models\Marca;
use App\Models\Modelo;

class TitularesVehiculosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('es_AR');
        $modelo = Modelo::inRandomOrder()->first();

        $vehiculo = Vehiculo::create([
            'patente' => strtoupper($faker->bothify('??###??')),
            'marca_id' => $modelo->marca_id,
            'modelo_id' => $modelo->id,
            'anio' => $faker->numberBetween(2008, now()->year),
        ]);

        /* =====================
         * Titulares + Vehículos
         * ===================== */

        if (TitularVehiculo::count() < 10) {
            for ($i = 0; $i < 12; $i++) {

                // 👉 Crear titular
                $titular = Titular::create([
                    'nombre' => $faker->firstName,
                    'apellido' => $faker->lastName,
                    'telefono' => $faker->phoneNumber,
                    'email' => $faker->unique()->safeEmail,
                ]);

                // 👉 Elegir modelo random (y de ahí sale la marca correcta)
                $modelo = Modelo::inRandomOrder()->first();

                // ⚠️ por seguridad, si no hay modelos
                if (!$modelo) {
                    continue;
                }

                // 👉 Crear vehículo
                $vehiculo = Vehiculo::create([
                    'patente' => strtoupper($faker->bothify('??###??')),
                    'marca_id' => $modelo->marca_id,
                    'modelo_id' => $modelo->id,
                    'anio' => $faker->numberBetween(2008, now()->year),
                ]);

                // 👉 Relación titular-vehículo
                TitularVehiculo::firstOrCreate([
                    'titular_id' => $titular->id,
                    'vehiculo_id' => $vehiculo->id,
                ]);
            }
        }

        $titularVehiculoIds = TitularVehiculo::pluck('id');
    }
}
