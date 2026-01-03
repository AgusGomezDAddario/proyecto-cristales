<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompaniaSeguro extends Model
{
    protected $table = 'companias_seguros';

    protected $fillable = [
        'nombre',
        'activo',
    ];
}
