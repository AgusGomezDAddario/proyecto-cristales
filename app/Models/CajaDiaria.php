<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CajaDiaria extends Model
{
    protected $table = 'caja_diaria';

    protected $fillable = [
        'fecha',
        'opened_at',
        'opening_balance',
        'opened_by_user_id',
        'closed_at',
        'closed_by_user_id',
        'closing_notes',
        'totals_snapshot',
    ];

    protected $casts = [
        'fecha' => 'date',
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
        'totals_snapshot' => 'array',
        'opening_balance' => 'float',
    ];

    /* ======================
     * Scopes / helpers
     * ====================== */

    public static function today(): ?self
    {
        return self::whereDate('fecha', Carbon::today())->first();
    }

    public function isOpen(): bool
    {
        return $this->opened_at !== null && $this->closed_at === null;
    }

    public function isClosed(): bool
    {
        return $this->closed_at !== null;
    }
}
