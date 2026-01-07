<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class Movimiento extends Model
{
    use HasFactory;

    protected $table = 'movimiento';

    public const TIPO_INGRESO = 'ingreso';
    public const TIPO_EGRESO  = 'egreso';

    protected $fillable = [
        'fecha',
        'monto',
        'concepto_id',
        'medio_de_pago_id',
        'comprobante',
        'tipo',
    ];

    /**
     * Importante:
     * - 'decimal:2' devuelve string (poco práctico para KPIs/porcentajes).
     * - en DB mantenés DECIMAL(12,2) (correcto).
     * - en PHP lo casteamos a float para sumar y serializar sin fricción.
     */
    protected $casts = [
        'fecha' => 'date:Y-m-d',
        'monto' => 'float',
    ];

    /* ======================
     * Relations
     * ====================== */

    public function concepto(): BelongsTo
    {
        return $this->belongsTo(Concepto::class, 'concepto_id');
    }

    public function medioDePago(): BelongsTo
    {
        return $this->belongsTo(MedioDePago::class, 'medio_de_pago_id');
    }

    /* ======================
     * Scopes
     * ====================== */

    public function scopeForDate($query, string $date)
    {
        return $query->whereDate('fecha', $date);
    }

    public function scopeOfTipo($query, string $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    public function scopeIngresos($query)
    {
        return $query->where('tipo', self::TIPO_INGRESO);
    }

    public function scopeEgresos($query)
    {
        return $query->where('tipo', self::TIPO_EGRESO);
    }

    /* ======================
     * Queries del resumen
     * ====================== */

    /**
     * Totales de ingresos/egresos para una fecha (Y-m-d).
     */
    public static function totalsForDate(string $date): array
    {
        $row = self::query()
            ->selectRaw("
                COALESCE(SUM(CASE WHEN tipo = ? THEN monto ELSE 0 END), 0) as ingresos,
                COALESCE(SUM(CASE WHEN tipo = ? THEN monto ELSE 0 END), 0) as egresos
            ", [self::TIPO_INGRESO, self::TIPO_EGRESO])
            ->whereDate('fecha', $date)
            ->first();

        return [
            'ingresos' => (float) ($row->ingresos ?? 0),
            'egresos'  => (float) ($row->egresos ?? 0),
        ];
    }

    /**
     * Agrupación por medio de pago para una fecha y tipo.
     * Devuelve: medio_de_pago_id, medio, total, cantidad, porcentaje
     */
    public static function groupedByMedioPago(string $date, string $tipo): Collection
    {
        if (!in_array($tipo, [self::TIPO_INGRESO, self::TIPO_EGRESO], true)) {
            throw new \InvalidArgumentException("Tipo de movimiento inválido: {$tipo}");
        }

        // Total para calcular % (por tipo)
        $total = (float) self::query()
            ->whereDate('fecha', $date)
            ->where('tipo', $tipo)
            ->sum('monto');

        $rows = DB::table('movimiento as m')
            ->leftJoin('medio_de_pago as mp', 'mp.id', '=', 'm.medio_de_pago_id')
            ->selectRaw("
                COALESCE(m.medio_de_pago_id, 0) as medio_de_pago_id,
                COALESCE(mp.nombre, 'Sin medio') as medio,
                COALESCE(SUM(m.monto), 0) as total,
                COUNT(*) as cantidad
            ")
            ->whereDate('m.fecha', $date)
            ->where('m.tipo', $tipo)
            ->groupBy('m.medio_de_pago_id', 'mp.nombre')
            ->orderByDesc('total')
            ->get();

        return $rows->map(function ($r) use ($total) {
            $r->total = (float) $r->total;
            $r->cantidad = (int) $r->cantidad;
            $r->porcentaje = $total > 0 ? round(($r->total / $total) * 100, 2) : 0.0;
            return $r;
        });
    }
}
