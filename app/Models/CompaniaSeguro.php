<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompaniaSeguro extends Model
{
    use SoftDeletes;

    protected $table = 'companias_seguros';

    protected $fillable = ['nombre', 'activo'];

    public function ordenesDeTrabajo()
    {
        return $this->hasMany(OrdenDeTrabajo::class, 'compania_seguro_id');
    }
}
