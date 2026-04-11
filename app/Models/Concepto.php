<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Concepto extends Model
{
    use HasFactory;

    protected $table = 'concepto';

    protected $fillable = [
        'nombre',
        'tipo',
    ];

    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'concepto_id');
    }
}
