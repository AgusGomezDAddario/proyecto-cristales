<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Movimiento extends Model
{
    use HasFactory;

    protected $table = 'movimiento';

    protected $fillable = [
        'fecha',
        'monto',
        'concepto_id',
        'medio_de_pago_id',
        'comprobante',
    ];

    protected $casts = [
        'fecha' => 'date',
        'monto' => 'decimal:2',
    ];

    public function concepto()
    {
        return $this->belongsTo(Concepto::class, 'concepto_id');
    }

    public function medioDePago()
    {
        return $this->belongsTo(MedioDePago::class, 'medio_de_pago_id');
    }
}
