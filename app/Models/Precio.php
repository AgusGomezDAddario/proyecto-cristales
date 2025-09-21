<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Precio extends Model
{
    protected $table = 'precio';
    public function medioDePago()
    {
        return $this->belongsTo(MedioDePago::class, 'medio_de_pago_id');
    }
    public function ordenDeTrabajo()
    {
        return $this->belongsTo(OrdenDeTrabajo::class, 'orden_de_trabajo_id');
    }
}
