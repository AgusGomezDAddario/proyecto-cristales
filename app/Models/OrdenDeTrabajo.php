<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenDeTrabajo extends Model
{
    use HasFactory;

    protected $table = 'orden_de_trabajo';

    protected $fillable = [
        'titular_vehiculo_id',
        'estado_id',
        'fecha',
        'observacion',
    ];

    protected $casts = [
        'fecha' => 'date'
    ];

    // 🔹 Relación con la asociativa titular-vehículo
    public function titularVehiculo()
    {
        return $this->belongsTo(TitularVehiculo::class, 'titular_vehiculo_id');
    }

    // 🔹 Relación con estado
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'estado_id');
    }

    // 🔹 Relación con medio de pago
    public function medioDePago()
    {
        return $this->belongsTo(MedioDePago::class, 'medio_de_pago_id');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleOrdenDeTrabajo::class, 'orden_de_trabajo_id');
    }

    public function pagos()
    {
        return $this->hasMany(Precio::class, 'orden_de_trabajo_id');
    }

}