<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TitularVehiculo extends Model
{
    use HasFactory;

    protected $table = 'titular_vehiculo';

    protected $fillable = [
        'titular_id',
        'vehiculo_id',
    ];

    // 👉 Relación con Titular
    public function titular()
    {
        return $this->belongsTo(Titular::class, 'titular_id');
    }

    // 👉 Relación con Vehiculo
    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class, 'vehiculo_id');
    }

    // 👉 Relación con Ordenes de Trabajo
    public function ordenesDeTrabajo()
    {
        return $this->hasMany(OrdenDeTrabajo::class, 'titular_vehiculo_id');
    }
}
