<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Marca extends Model
{
    use HasFactory;

    protected $table = 'marcas';

    protected $fillable = [
        'nombre',
    ];

    // 🔹 Relación: Una marca tiene muchos modelos
    public function modelos()
    {
        return $this->hasMany(Modelo::class, 'marca_id');
    }

    // 🔹 Relación: Una marca tiene muchos vehículos
    public function vehiculos()
    {
        return $this->hasMany(Vehiculo::class, 'marca_id');
    }
}
