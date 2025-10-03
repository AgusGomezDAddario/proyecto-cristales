<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedioDePago extends Model
{
    use HasFactory;
    
    protected $table = 'medio_de_pago';
    
    protected $fillable = [
        'nombre',
        'tipo',
    ];
    
    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'medio_de_pago_id');
    }
    
}
