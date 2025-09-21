<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\DetalleOrdenDeTrabajo;
use App\Models\OrdenDeTrabajo;

class DetalleOrdenDeTrabajoFactory extends Factory
{
    protected $model = DetalleOrdenDeTrabajo::class;

    public function definition(): array
    {
        return [
            'orden_de_trabajo_id' => OrdenDeTrabajo::factory(),
            'descripcion'         => $this->faker->sentence,
            'cantidad'            => $this->faker->numberBetween(1, 10),
            'valor'     => $this->faker->randomFloat(2, 100, 5000),
            'colocacion_incluida' => $this->faker->boolean,
        ];
    }
}
