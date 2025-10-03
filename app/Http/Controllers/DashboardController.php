<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Movimiento;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $hoy = Carbon::today();

        // Obtener todos los egresos del día (usando whereDate para comparar solo la fecha)
        $egresosHoy = Movimiento::whereDate('fecha', $hoy)->get();
        
        // Calcular el total de egresos del día
        $totalEgresos = $egresosHoy->sum('monto');
        
        // Últimos 5 egresos (de cualquier fecha, ordenados por creación)
        $ultimosEgresos = Movimiento::with(['concepto', 'medioDePago'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Por ahora, ingresos y órdenes en 0 (cuando los implementes, los agregas)
        $totalIngresos = 0; // TODO: Implementar cuando tengas ingresos
        $totalOrdenes = 0;  // TODO: Implementar cuando tengas OT
        
        // Balance del día (ingresos - egresos)
        $balanceDelDia = $totalIngresos - $totalEgresos;

        $stats = [
            'totalEgresos' => (float) $totalEgresos,
            'totalIngresos' => (float) $totalIngresos,
            'totalOrdenes' => $totalOrdenes,
            'balanceDelDia' => (float) $balanceDelDia,
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'ultimosEgresos' => $ultimosEgresos,
        ]);
    }
}