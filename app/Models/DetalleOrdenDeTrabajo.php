<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleOrdenDeTrabajo extends Model
{
    use HasFactory;
    protected $table = 'detalle_orden_de_trabajo';
    protected $fillable = [
        'descripcion',
        'valor',
        'cantidad',
        'colocacion_incluida',
        'orden_de_trabajo_id'
    ];
    public function ordenDeTrabajo()
    {
        return $this->belongsTo(OrdenDeTrabajo::class, 'orden_de_trabajo_id');
    }
}