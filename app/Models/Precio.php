<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Precio extends Model
{
    use HasFactory;

    protected $table = 'precio';

    protected $fillable = [
        'orden_de_trabajo_id',
        'medio_de_pago_id',
        'valor',
        'fecha',
        'observacion'
    ];

    protected $casts = [
        'fecha' => 'date',
        'valor' => 'decimal:2',
    ];

    public function medioDePago()
    {
        return $this->belongsTo(MedioDePago::class, 'medio_de_pago_id');
    }

    public function ordenDeTrabajo()
    {
        return $this->belongsTo(OrdenDeTrabajo::class, 'orden_de_trabajo_id');
    }
}