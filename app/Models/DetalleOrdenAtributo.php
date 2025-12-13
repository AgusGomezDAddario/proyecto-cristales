<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleOrdenAtributo extends Model
{
    use HasFactory;

    protected $table = 'detalle_orden_atributo';

    protected $fillable = [
        'detalle_orden_de_trabajo_id',
        'categoria_id',
        'subcategoria_id',
    ];

    public function detalleOrdenDeTrabajo()
    {
        return $this->belongsTo(DetalleOrdenDeTrabajo::class, 'detalle_orden_de_trabajo_id');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class, 'subcategoria_id');
    }
}
