<?php

namespace Database\Seeders;

use App\Models\Concepto;
use App\Models\Estado;
use App\Models\Marca;
use App\Models\MedioDePago;
use App\Models\Modelo;
use App\Models\Movimiento;
use App\Models\OrdenDeTrabajo;
use App\Models\Titular;
use App\Models\TitularVehiculo;
use App\Models\Vehiculo;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class MetricsDemoSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_AR');

        $to = Carbon::today();
        $from = (clone $to)->subDays(29);

        $this->command?->info('📈 Generando datos demo para Métricas (últimos 30 días)...');

        /* =====================
         * Catálogos mínimos
         * ===================== */

        $medioPagoIds = MedioDePago::query()->pluck('id');

        if ($medioPagoIds->isEmpty()) {
            foreach (['Efectivo', 'Transferencia', 'Débito', 'Crédito', 'Cheque'] as $nombre) {
                MedioDePago::query()->firstOrCreate(['nombre' => $nombre]);
            }
            $medioPagoIds = MedioDePago::query()->pluck('id');
        }

        $estados = Estado::query()->pluck('id', 'nombre');
        if ($estados->isEmpty()) {
            foreach (['Iniciado', 'Pendiente', 'Completada', 'Pagado'] as $nombre) {
                Estado::query()->firstOrCreate(['nombre' => $nombre]);
            }
            $estados = Estado::query()->pluck('id', 'nombre');
        }

        $conceptoIngresoIds = collect([
            Concepto::query()->firstOrCreate(['nombre' => 'Cobro a clientes', 'tipo' => Movimiento::TIPO_INGRESO])->id,
            Concepto::query()->firstOrCreate(['nombre' => 'Venta de servicios', 'tipo' => Movimiento::TIPO_INGRESO])->id,
        ]);

        $conceptoEgresoIds = collect([
            Concepto::query()->firstOrCreate(['nombre' => 'Colocación / Mano de obra', 'tipo' => Movimiento::TIPO_EGRESO])->id,
            Concepto::query()->firstOrCreate(['nombre' => 'Reposición de vidrios', 'tipo' => Movimiento::TIPO_EGRESO])->id,
            Concepto::query()->firstOrCreate(['nombre' => 'Impuestos y tasas', 'tipo' => Movimiento::TIPO_EGRESO])->id,
            Concepto::query()->firstOrCreate(['nombre' => 'Otros', 'tipo' => Movimiento::TIPO_EGRESO])->id,
        ]);

        // Marcas/Modelos (para Vehículo)
        $marcaId = Marca::query()->value('id');
        $modeloId = Modelo::query()->value('id');

        if (!$marcaId || !$modeloId) {
            $marca = Marca::query()->firstOrCreate(['nombre' => 'Genérica']);
            $modelo = Modelo::query()->firstOrCreate(['nombre' => 'Base', 'marca_id' => $marca->id]);
            $marcaId = $marca->id;
            $modeloId = $modelo->id;
        }

        /* =====================
         * Titulares + Vehículos + Pivot
         * ===================== */

        $titularVehiculoIds = TitularVehiculo::query()->pluck('id');

        if ($titularVehiculoIds->count() < 10) {
            for ($i = 0; $i < 12; $i++) {
                $titular = Titular::query()->create([
                    'nombre' => $faker->firstName,
                    'apellido' => $faker->lastName,
                    'telefono' => $faker->phoneNumber,
                    'email' => $faker->unique()->safeEmail,
                ]);

                $vehiculo = Vehiculo::query()->create([
                    'patente' => strtoupper($faker->bothify('??###??')),
                    'marca_id' => $marcaId,
                    'modelo_id' => $modeloId,
                    'anio' => $faker->numberBetween(2008, (int) $to->format('Y')),
                ]);

                TitularVehiculo::query()->firstOrCreate([
                    'titular_id' => $titular->id,
                    'vehiculo_id' => $vehiculo->id,
                ]);
            }
        }

        $titularVehiculoIds = TitularVehiculo::query()->pluck('id');

        /* =====================
         * Órdenes de trabajo (últimos 30 días)
         * ===================== */

        $estadoIniciadoId = $estados->get('Iniciado');
        $estadoPendienteId = $estados->get('Pendiente');
        $estadoCompletadaId = $estados->get('Completada');
        $estadoPagadoId = $estados->get('Pagado');

        $ordenes = collect();

        OrdenDeTrabajo::withoutEvents(function () use (
            $faker,
            $from,
            $to,
            $titularVehiculoIds,
            $estadoIniciadoId,
            $estadoPendienteId,
            $estadoCompletadaId,
            $estadoPagadoId,
            &$ordenes
        ) {
            $totalOT = 40;
            for ($i = 0; $i < $totalOT; $i++) {
                $fechaOt = Carbon::instance($faker->dateTimeBetween($from->toDateString(), $to->toDateString()));

                // Distribución: más Pendiente/Completada para que se vea el KPI de cerradas
                $estadoId = $faker->randomElement([
                    $estadoCompletadaId,
                    $estadoCompletadaId,
                    $estadoPendienteId,
                    $estadoPendienteId,
                    $estadoIniciadoId,
                    $estadoPagadoId,
                ]);

                $orden = OrdenDeTrabajo::query()->create([
                    'titular_vehiculo_id' => $titularVehiculoIds->random(),
                    'compania_seguro_id' => null,
                    'estado_id' => $estadoId,
                    'fecha' => $fechaOt,
                    'con_factura' => (bool) $faker->boolean(35),
                    'observacion' => $faker->randomElement([
                        'Cambio de parabrisas',
                        'Reemplazo de luneta',
                        'Cristal lateral',
                        'Polarizado',
                        'Reparación de mecanismo',
                    ]),
                    'fecha_entrega_estimada' => $fechaOt->copy()->addDays($faker->numberBetween(1, 7))->toDateString(),
                    'numero_orden' => 'OT-' . strtoupper(bin2hex(random_bytes(4))),
                    'es_garantia' => (bool) $faker->boolean(10),
                ]);

                $ordenes->push($orden);
            }
        });

        /* =====================
         * Movimientos (ingresos/egresos) últimos 30 días
         * ===================== */

        // Ingresos (vinculados a algunas OTs para que sea más real)
        foreach ($ordenes as $orden) {
            // Solo algunas OTs generan ingresos (Completada/Pagado)
            if (!in_array($orden->estado_id, [$estadoCompletadaId, $estadoPagadoId], true)) {
                continue;
            }

            if ($faker->boolean(75)) {
                Movimiento::query()->create([
                    'fecha' => Carbon::parse($orden->fecha)->toDateString(),
                    'monto' => $faker->randomFloat(2, 25000, 220000),
                    'concepto_id' => $conceptoIngresoIds->random(),
                    'medio_de_pago_id' => $medioPagoIds->random(),
                    'tipo' => Movimiento::TIPO_INGRESO,
                ]);
            }
        }

        // Egresos (independientes, con composición marcada)
        $totalEgresos = 70;
        for ($i = 0; $i < $totalEgresos; $i++) {
            $fecha = Carbon::instance($faker->dateTimeBetween($from->toDateString(), $to->toDateString()))->toDateString();
            $conceptoId = $conceptoEgresoIds->random();

            $monto = match (Concepto::query()->find($conceptoId)?->nombre) {
                'Colocación / Mano de obra' => $faker->randomFloat(2, 12000, 60000),
                'Reposición de vidrios' => $faker->randomFloat(2, 15000, 120000),
                'Impuestos y tasas' => $faker->randomFloat(2, 8000, 50000),
                default => $faker->randomFloat(2, 5000, 40000),
            };

            Movimiento::query()->create([
                'fecha' => $fecha,
                'monto' => $monto,
                'concepto_id' => $conceptoId,
                'medio_de_pago_id' => $medioPagoIds->random(),
                'tipo' => Movimiento::TIPO_EGRESO,
            ]);
        }

        // Ingresos extra para variedad de medios de pago
        $totalIngresosExtra = 25;
        for ($i = 0; $i < $totalIngresosExtra; $i++) {
            $fecha = Carbon::instance($faker->dateTimeBetween($from->toDateString(), $to->toDateString()))->toDateString();

            Movimiento::query()->create([
                'fecha' => $fecha,
                'monto' => $faker->randomFloat(2, 10000, 140000),
                'concepto_id' => $conceptoIngresoIds->random(),
                'medio_de_pago_id' => $medioPagoIds->random(),
                'tipo' => Movimiento::TIPO_INGRESO,
            ]);
        }

        $this->command?->info('✅ Datos demo de Métricas generados.');
    }
}
