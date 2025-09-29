<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Precio;
use App\Models\OrdenDeTrabajo;
use App\Models\MedioDePago;

class PrecioFactory extends Factory
{
    protected $model = Precio::class;

    public function definition(): array
    {
        return [
            'orden_de_trabajo_id' => OrdenDeTrabajo::factory(),
            'medio_de_pago_id'    => MedioDePago::inRandomOrder()->first()->id ?? 1,
            'valor'               => $this->faker->randomFloat(2, 1000, 20000),
            'valor_pagado'        => $this->faker->randomFloat(2, 0, 20000),
        ];
    }
}
