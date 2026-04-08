<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $table = 'estado';

    protected $fillable = ['nombre'];

    public const INICIADO = 1;
    public const PENDIENTE = 2;
    public const COMPLETADA = 3;

    public function ordenesDeTrabajo()
    {
        return $this->hasMany(OrdenDeTrabajo::class, 'estado_id');
    }

    public static function idsParaTaller(): array
    {
        return [
            self::INICIADO,
            self::PENDIENTE,
            self::COMPLETADA,
        ];
    }

    public static function idsPermitidosCambioTaller(): array
    {
        return [
            self::INICIADO,
            self::PENDIENTE,
            self::COMPLETADA,
        ];
    }
}
