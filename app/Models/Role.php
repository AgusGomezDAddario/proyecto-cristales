<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $table = 'rol'; // 👈 nombre exacto de la tabla
    protected $primaryKey = 'role_id'; // 👈 clave primaria REAL
    public $timestamps = false; // 👈 si tu tabla `roles` no tiene created_at / updated_at

    protected $fillable = [
        'descripcion',
    ];

    
}
