<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modelo extends Model
{
    use HasFactory;

    protected $table = 'modelos';

    protected $fillable = [
        'marca_id',
        'nombre',
    ];

    // 🔹 Relación: Un modelo pertenece a una marca
    public function marca()
    {
        return $this->belongsTo(Marca::class, 'marca_id');
    }

    // 🔹 Relación: Un modelo tiene muchos vehículos
    public function vehiculos()
    {
        return $this->hasMany(Vehiculo::class, 'modelo_id');
    }
}
