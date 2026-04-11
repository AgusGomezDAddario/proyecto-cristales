<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $table = 'estado';

    protected $fillable = ['nombre'];

    public const ANULADA = 1;
    public const INICIADO = 2;
    public const EN_TALLER = 3;
    public const COMPLETADA_TALLER = 4;
    public const FINALIZADA = 5;
    public const ESTADOS_TALLER = [
        self::INICIADO,
        self::EN_TALLER,
        self::COMPLETADA_TALLER,
    ];
    public const ESTADOS_CAMBIO_TALLER = self::ESTADOS_TALLER;

    public function ordenesDeTrabajo()
    {
        return $this->hasMany(OrdenDeTrabajo::class, 'estado_id');
    }

    public static function idsParaTaller(): array
    {
        return self::ESTADOS_TALLER;
    }

    public static function idsPermitidosCambioTaller(): array
    {
        return self::ESTADOS_CAMBIO_TALLER;
    }
}
