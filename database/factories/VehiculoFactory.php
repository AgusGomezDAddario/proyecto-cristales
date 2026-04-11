<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Vehiculo;
use App\Models\Titular;

class VehiculoFactory extends Factory
{
    protected $model = Vehiculo::class;

    public function definition(): array
    {
        return [
            'patente'    => strtoupper($this->faker->bothify('??###')), // ej: AB123
            'marca'      => $this->faker->company,
            'modelo'     => $this->faker->word,
            'anio'       => $this->faker->year,
            'titular_id' => Titular::factory(), // relación
        ];
    }
}
