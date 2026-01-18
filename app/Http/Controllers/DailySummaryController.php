<?php

namespace App\Http\Controllers;

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

        return Inertia::render('DailySummary/index', [
            'fecha' => $date,
            'kpis' => [
                'ingresos' => $totals['ingresos'],
                'egresos' => $totals['egresos'],
                'neto' => $neto,
            ],
            'ingresosPorMedio' => $ingresosPorMedio,
            'egresosPorMedio' => $egresosPorMedio,
            'today' => Carbon::today()->toDateString(),
        ]);
    }

    public function print(Request $request)
{
    $date = $request->query('date', Carbon::today()->toDateString());

    // KPIs
    $totals = Movimiento::totalsForDate($date);
    $ingresos = (float) ($totals['ingresos'] ?? 0);
    $egresos  = (float) ($totals['egresos'] ?? 0);
    $neto     = $ingresos - $egresos;

    // Tablas por medio de pago
    $ingresosPorMedio = Movimiento::groupedByMedioPago($date, Movimiento::TIPO_INGRESO);
    $egresosPorMedio  = Movimiento::groupedByMedioPago($date, Movimiento::TIPO_EGRESO);

    return view('daily-summary.print', [
        'fecha' => $date,
        'kpis' => [
            'ingresos' => $ingresos,
            'egresos' => $egresos,
            'neto' => $neto,
        ],
        'ingresosPorMedio' => $ingresosPorMedio,
        'egresosPorMedio' => $egresosPorMedio,
    ]);
}

}
