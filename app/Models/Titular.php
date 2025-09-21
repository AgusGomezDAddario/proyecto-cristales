<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Titular extends Model
{
    protected $table = 'titular';
    public function vehiculos()
    {
        return $this->hasMany(Vehiculo::class, 'titular_id');
    }
    public function ordenesDeTrabajo()
    {
        return $this->hasMany(OrdenDeTrabajo::class, 'titular_id');
    }
    
}
