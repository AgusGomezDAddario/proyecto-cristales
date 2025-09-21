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

class SeederDatosDePrueba extends Seeder
{
    public function run(): void
    {
        $this->command->info('🏁 Iniciando el seeder de datos de prueba...');

        // Crear titulares con vehículos
        Titular::factory()
            ->count(10)
            ->create()
            ->each(function ($titular) {
                // Cada titular con 2 vehículos
                $titular->vehiculos()->saveMany(
                    Vehiculo::factory()->count(2)->make()
                );
            });

        $this->command->info('✅ Titulares y vehículos creados.');

        // Crear órdenes de trabajo
        $ordenes = OrdenDeTrabajo::factory()
            ->count(20)
            ->create([
                'estado_id'        => Estado::inRandomOrder()->first()->id ?? 1,
                'medio_de_pago_id' => MedioDePago::inRandomOrder()->first()->id ?? 1,
            ]);

        $this->command->info('✅ Órdenes de trabajo creadas.');

        // Crear detalles y precios para cada OT
        $ordenes->each(function ($ot) {
            // 1 a 3 detalles por orden
            DetalleOrdenDeTrabajo::factory()
                ->count(rand(1, 3))
                ->create([
                    'orden_de_trabajo_id' => $ot->id,
                ]);

            // Precio asociado a la orden
            Precio::factory()->create([
                'orden_de_trabajo_id' => $ot->id,
                'medio_de_pago_id'    => $ot->medio_de_pago_id, // ✅ corregido
            ]);
        });

        $this->command->info('✅ Detalles y precios generados.');

        $this->command->info('🎉 Seeder de prueba finalizado con éxito.');
    }
}
