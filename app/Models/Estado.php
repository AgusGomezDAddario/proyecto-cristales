<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $table = 'estado';

    public const ESTADOS_TALLER = [1, 2, 3];
    public const ESTADOS_CAMBIO_TALLER = [1, 2, 3];

    public function ordenesDeTrabajo()
    {
        return $this->hasMany(OrdenDeTrabajo::class, 'estado_id');
    }
}
