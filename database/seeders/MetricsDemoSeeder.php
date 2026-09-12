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

        /* =====================
         * Estados actualizados
         * ===================== */

        $estadoIniciadoId = Estado::where('nombre', 'Iniciado')->value('id');
        $estadoEnTallerId = Estado::where('nombre', 'En taller')->value('id');
        $estadoParaRetirarId = Estado::where('nombre', Estado::NOMBRE_FINALIZADA)->value('id');
        $estadoRetiradaId = Estado::where('nombre', Estado::NOMBRE_RETIRADA)->value('id');

        if (!$estadoIniciadoId || !$estadoEnTallerId || !$estadoParaRetirarId || !$estadoRetiradaId) {
            throw new \Exception('Faltan estados requeridos para MetricsDemoSeeder');
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

        /* =====================
         * Marca / Modelo
         * ===================== */

        $marcaId = Marca::query()->value('id');
        $modeloId = Modelo::query()->value('id');

        if (!$marcaId || !$modeloId) {
            $marca = Marca::query()->firstOrCreate(['nombre' => 'Genérica']);
            $modelo = Modelo::query()->firstOrCreate([
                'nombre' => 'Base',
                'marca_id' => $marca->id
            ]);
            $marcaId = $marca->id;
            $modeloId = $modelo->id;
        }

        /* =====================
         * Titulares + Vehículos
         * ===================== */

        if (TitularVehiculo::count() < 10) {
            for ($i = 0; $i < 12; $i++) {

                $titular = Titular::create([
                    'nombre' => $faker->firstName,
                    'apellido' => $faker->lastName,
                    'telefono' => $faker->phoneNumber,
                    'email' => $faker->unique()->safeEmail,
                ]);

                $vehiculo = Vehiculo::create([
                    'patente' => strtoupper($faker->bothify('??###??')),
                    'marca_id' => $marcaId,
                    'modelo_id' => $modeloId,
                    'anio' => $faker->numberBetween(2008, (int) $to->format('Y')),
                ]);

                TitularVehiculo::firstOrCreate([
                    'titular_id' => $titular->id,
                    'vehiculo_id' => $vehiculo->id,
                ]);
            }
        }

        $titularVehiculoIds = TitularVehiculo::pluck('id');

        /* =====================
         * Órdenes de trabajo
         * ===================== */

        $ordenes = collect();

        OrdenDeTrabajo::withoutEvents(function () use (
            $faker,
            $from,
            $to,
            $titularVehiculoIds,
            $estadoIniciadoId,
            $estadoEnTallerId,
            $estadoParaRetirarId,
            $estadoRetiradaId,
            &$ordenes
        ) {
            for ($i = 0; $i < 40; $i++) {

                $fechaOt = Carbon::instance(
                    $faker->dateTimeBetween($from->toDateString(), $to->toDateString())
                );

                $estadoId = $faker->randomElement([
                    $estadoParaRetirarId,
                    $estadoParaRetirarId,
                    $estadoEnTallerId,
                    $estadoEnTallerId,
                    $estadoIniciadoId,
                    $estadoRetiradaId,
                ]);

                $orden = OrdenDeTrabajo::create([
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
                    'fecha_entrega_estimada' => $fechaOt->copy()->addDays(
                        $faker->numberBetween(1, 7)
                    )->toDateString(),
                    'numero_orden' => 'OT-' . strtoupper(bin2hex(random_bytes(4))),
                    'es_garantia' => (bool) $faker->boolean(10),
                ]);

                $ordenes->push($orden);
            }
        });

        /* =====================
         * Movimientos
         * ===================== */

        foreach ($ordenes as $orden) {

            if (!in_array($orden->estado_id, [$estadoParaRetirarId, $estadoRetiradaId], true)) {
                continue;
            }

            if ($faker->boolean(75)) {
                Movimiento::create([
                    'fecha' => Carbon::parse($orden->fecha)->toDateString(),
                    'monto' => $faker->randomFloat(2, 25000, 220000),
                    'concepto_id' => $conceptoIngresoIds->random(),
                    'medio_de_pago_id' => $medioPagoIds->random(),
                    'tipo' => Movimiento::TIPO_INGRESO,
                ]);
            }
        }

        for ($i = 0; $i < 70; $i++) {

            $fecha = Carbon::instance(
                $faker->dateTimeBetween($from->toDateString(), $to->toDateString())
            )->toDateString();

            $conceptoId = $conceptoEgresoIds->random();

            $monto = match (Concepto::find($conceptoId)?->nombre) {
                'Colocación / Mano de obra' => $faker->randomFloat(2, 12000, 60000),
                'Reposición de vidrios' => $faker->randomFloat(2, 15000, 120000),
                'Impuestos y tasas' => $faker->randomFloat(2, 8000, 50000),
                default => $faker->randomFloat(2, 5000, 40000),
            };

            Movimiento::create([
                'fecha' => $fecha,
                'monto' => $monto,
                'concepto_id' => $conceptoId,
                'medio_de_pago_id' => $medioPagoIds->random(),
                'tipo' => Movimiento::TIPO_EGRESO,
            ]);
        }

        $this->command?->info('✅ Datos demo de Métricas generados correctamente.');
    }
}