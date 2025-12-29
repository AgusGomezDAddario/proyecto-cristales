<?php

namespace App\Http\Controllers;

use App\Models\CajaDiaria;
use App\Models\Movimiento;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailySummaryController extends Controller
{
    public function show(Request $request)
    {
        $date = $request->query('date', Carbon::today()->toDateString());

        $totals = Movimiento::totalsForDate($date);
        $neto = $totals['ingresos'] - $totals['egresos'];

        $ingresosPorMedio = Movimiento::groupedByMedioPago($date, 'ingreso');
        $egresosPorMedio = Movimiento::groupedByMedioPago($date, 'egreso');

        $caja = CajaDiaria::whereDate('fecha', $date)->first();

        return Inertia::render('DailySummary/Index', [
            'fecha' => $date,
            'kpis' => [
                'ingresos' => $totals['ingresos'],
                'egresos' => $totals['egresos'],
                'neto' => $neto,
            ],
            'ingresosPorMedio' => $ingresosPorMedio,
            'egresosPorMedio' => $egresosPorMedio,
            'cashbox' => [
                'status' => !$caja ? 'NOT_OPENED' : ($caja->isClosed() ? 'CLOSED' : 'OPEN'),
                'opening_balance' => $caja?->opening_balance,
                'opened_at' => $caja?->opened_at,
                'closed_at' => $caja?->closed_at,
            ],
            'today' => Carbon::today()->toDateString(),
        ]);
    }
}
