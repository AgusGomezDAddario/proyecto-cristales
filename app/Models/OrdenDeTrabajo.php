<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenDeTrabajo extends Model
{
    protected $table = 'orden_de_trabajo';
    public function titular()
    {
        return $this->belongsTo(Titular::class, 'titular_id');
    }
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'estado_id');
    }
    public function medioDePago()
    {
        return $this->belongsTo(MedioDePago::class, 'medio_de_pago_id');
    }
    
}
