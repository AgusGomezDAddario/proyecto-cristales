<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $table = 'estado';
    public function ordenesDeTrabajo()
    {
        return $this->hasMany(OrdenDeTrabajo::class, 'estado_id');
    }
    protected $fillable = ['nombre'];

    // 🔒 IDs FIJOS (no tocar)
    public const INICIADO   = 1;
    public const PENDIENTE  = 2;
    public const COMPLETADA = 3;

    // 🛠 Estados que aparecen como "pendientes" en taller
    public const ESTADOS_TALLER = [
        self::INICIADO,
        self::PENDIENTE,
    ];

    // 🔁 Estados permitidos para cambiar desde taller
    public const ESTADOS_CAMBIO_TALLER = [
        self::INICIADO,
        self::PENDIENTE,
        self::COMPLETADA,
    ];

}
