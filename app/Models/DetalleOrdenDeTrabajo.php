<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleOrdenDeTrabajo extends Model
{
    use HasFactory;

    protected $table = 'detalle_orden_de_trabajo';

    protected $fillable = [
        'orden_de_trabajo_id',
        'articulo_id',
        'descripcion',
        'valor',
        'cantidad',
        'colocacion_incluida',
    ];

    // =========================
    // Relaciones
    // =========================

    public function ordenDeTrabajo()
    {
        return $this->belongsTo(OrdenDeTrabajo::class, 'orden_de_trabajo_id');
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'articulo_id');
    }

    public function atributos()
    {
        return $this->hasMany(
            DetalleOrdenAtributo::class,
            'detalle_orden_de_trabajo_id'
        );
    }
}
