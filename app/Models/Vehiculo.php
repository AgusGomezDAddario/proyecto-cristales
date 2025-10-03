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
        'marca',
        'modelo',
        'anio',
        'color',
    ];

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
