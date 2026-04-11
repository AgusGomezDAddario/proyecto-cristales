<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categorias';

    protected $fillable = [
        'articulo_id',
        'nombre',
        'obligatoria',
        'activo',
        // si más adelante incorporás tipo_input:
        // 'tipo_input',
    ];

    protected $casts = [
        'obligatoria' => 'boolean',
        'activo' => 'boolean',
    ];

    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'articulo_id');
    }

    public function subcategorias()
    {
        return $this->hasMany(Subcategoria::class, 'categoria_id');
    }
}
