<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    use HasFactory;

    protected $table = 'vehiculo';

    protected $fillable = [
        'patente',
        'marca_id',
        'modelo_id',
        'anio',
    ];

    // 🔹 Relación: Un vehículo pertenece a una marca
    public function marca()
    {
        return $this->belongsTo(Marca::class, 'marca_id');
    }

    // 🔹 Relación: Un vehículo pertenece a un modelo
    public function modelo()
    {
        return $this->belongsTo(Modelo::class, 'modelo_id');
    }

    // 🔹 Relación muchos a muchos con titulares
    public function titulares()
    {
        return $this->belongsToMany(Titular::class, 'titular_vehiculo')
            ->withTimestamps();
    }

    // 🔹 Relación con pivot
    public function titularVehiculos()
    {
        return $this->hasMany(TitularVehiculo::class);
    }
}
