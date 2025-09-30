<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
<<<<<<< HEAD
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
=======

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
>>>>>>> feature-backend_ABM_ODT
