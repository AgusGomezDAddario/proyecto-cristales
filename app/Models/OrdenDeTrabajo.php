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
        'compania_seguro_id',
        'estado_id',
        'fecha',
        'con_factura',
        'observacion',
    ];

    protected $casts = [
        'fecha' => 'datetime',     // en DB es datetime
        'con_factura' => 'boolean',
    ];

    public function titularVehiculo()
    {
        return $this->belongsTo(TitularVehiculo::class, 'titular_vehiculo_id');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'estado_id');
    }

    // ✅ Pagos múltiples por tabla precio
    public function pagos()
    {
        return $this->hasMany(Precio::class, 'orden_de_trabajo_id');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleOrdenDeTrabajo::class, 'orden_de_trabajo_id');
    }
}
