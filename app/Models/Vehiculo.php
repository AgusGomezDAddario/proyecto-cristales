<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = 'vehiculo';
    public function titular()
    {
        return $this->belongsTo(Titular::class, 'titular_id');
    }
}
