<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\OrdenDeTrabajo;
use App\Models\Titular;
use App\Models\Estado;
use App\Models\MedioDePago;

class OrdenDeTrabajoFactory extends Factory
{
    protected $model = OrdenDeTrabajo::class;

    public function definition(): array
    {
        return [
            'fecha'          => $this->faker->dateTimeBetween('-1 month', 'now'),
            'titular_id'     => Titular::factory(),
            'estado_id'      => Estado::inRandomOrder()->first()->id ?? 1,
            'medio_de_pago_id' => MedioDePago::inRandomOrder()->first()->id ?? 1,
        ];
    }
}
