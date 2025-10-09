<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Titular extends Model
{
    use HasFactory;

    protected $table = 'titular';

    protected $fillable = [
        'nombre',
        'apellido',
        'telefono',
        'email',
    ];

    // 🔹 Relación muchos a muchos con vehículos
    public function vehiculos()
    {
        return $this->belongsToMany(Vehiculo::class, 'titular_vehiculo')
                    ->withTimestamps();
    }

    // 🔹 Relación con pivot para acceder directo
    public function titularVehiculos()
    {
        return $this->hasMany(TitularVehiculo::class);
    }
}
