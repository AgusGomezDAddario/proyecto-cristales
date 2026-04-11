<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Titular;
use App\Models\Vehiculo;
use App\Models\OrdenDeTrabajo;
use App\Models\DetalleOrdenDeTrabajo;
use App\Models\Estado;
use App\Models\MedioDePago;
use App\Models\Precio;
use Faker\Factory as Faker;

class SeederDatosDePrueba extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_AR'); // Faker en español-Argentina
        $this->command->info('🏁 Iniciando el seeder de datos de prueba...');

        // -------------------------------
        // Titulares + Vehículos
        // -------------------------------
        $titulares = collect();

        foreach (range(1, 10) as $i) {
            $titular = Titular::create([
                'nombre'    => $faker->firstName,
                'apellido'  => $faker->lastName,
                'telefono'  => $faker->phoneNumber,
                'email'     => $faker->unique()->safeEmail,
            ]);

            // Vehículos típicos de Argentina
            $vehiculos = [
                ['marca' => 'Fiat', 'modelo' => 'Cronos'],
                ['marca' => 'Volkswagen', 'modelo' => 'Gol'],
                ['marca' => 'Toyota', 'modelo' => 'Hilux'],
                ['marca' => 'Renault', 'modelo' => 'Kangoo'],
                ['marca' => 'Peugeot', 'modelo' => '208'],
                ['marca' => 'Chevrolet', 'modelo' => 'Onix'],
                ['marca' => 'Ford', 'modelo' => 'Ranger'],
            ];

            // Cada titular tendrá 1 o 2 autos
            foreach (range(1, rand(1, 2)) as $j) {
                $vehiculo = $faker->randomElement($vehiculos);
                Vehiculo::create([
                    'patente'   => strtoupper($faker->bothify('??###')),
                    'marca'     => $vehiculo['marca'],
                    'modelo'    => $vehiculo['modelo'],
                    'anio'      => $faker->numberBetween(2005, 2023),
                    'titular_id'=> $titular->id,
                ]);
            }

            $titulares->push($titular);
        }

        $this->command->info('✅ Titulares y vehículos creados.');

        // // -------------------------------
        // // Órdenes de trabajo
        // // -------------------------------
        // $ordenes = collect();

        // foreach (range(1, 20) as $i) {
        //     $titular = $titulares->random();

        //     $orden = OrdenDeTrabajo::create([
        //         'titular_id'       => $titular->id,
        //         'estado_id'        => Estado::inRandomOrder()->first()->id ?? 1,
        //         'medio_de_pago_id' => MedioDePago::inRandomOrder()->first()->id ?? 1,
        //         'fecha'            => $faker->dateTimeBetween('-2 months', 'now'),
        //         'observacion'      => $faker->randomElement([
        //             'Cambio de parabrisas',
        //             'Colocación de cristal lateral',
        //             'Polarizado de vidrios',
        //             'Reparación de levantavidrios',
        //             'Reemplazo de luneta trasera',
        //         ]),
        //     ]);

        //     $ordenes->push($orden);
        // }

        // $this->command->info('✅ Órdenes de trabajo creadas.');

        // -------------------------------
        // Detalles + Precios
        // -------------------------------
        // $ordenes->each(function ($ot) use ($faker) {
        //     // 1 a 3 detalles por orden
        //     foreach (range(1, rand(1, 3)) as $i) {
        //         DetalleOrdenDeTrabajo::create([
        //             'orden_de_trabajo_id' => $ot->id,
        //             'descripcion' => $faker->randomElement([
        //                 'Cristal templado',
        //                 'Vidrio tonalizado',
        //                 'Kit de burletes',
        //                 'Kit de colocación',
        //                 'Servicio de mano de obra',
        //             ]),
        //             'cantidad' => rand(1, 2),
        //             'valor'    => $faker->randomFloat(2, 15000, 120000),
        //             'colocacion_incluida' => $faker->boolean,
        //         ]);
        //     }

        //     // Precio asociado
        //     Precio::create([
        //         'orden_de_trabajo_id' => $ot->id,
        //         'medio_de_pago_id'    => $ot->medio_de_pago_id,
        //         'valor'               => $faker->randomFloat(2, 20000, 200000),
        //         'valor_pagado'        => $faker->randomFloat(2, 5000, 200000),
        //     ]);
        // });

        // $this->command->info('✅ Detalles y precios generados.');
        $this->command->info('🎉 Seeder de prueba con datos realistas (AR) finalizado con éxito.');
    }
}