<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedioDePago extends Model
{
    protected $table = 'medio_de_pago';
    public function ordenesDeTrabajo()
    {
        return $this->hasMany(OrdenDeTrabajo::class, 'medio_de_pago_id');
    }
    public function precios()
    {
        return $this->hasMany(Precio::class, 'medio_de_pago_id');
    }
}
