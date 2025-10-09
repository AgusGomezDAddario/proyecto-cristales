<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Movimiento;
use App\Models\OrdenDeTrabajo;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $hoy = Carbon::today();

        // Obtener todos los egresos del día (usando whereDate para comparar solo la fecha)
        $egresosHoy = Movimiento::whereDate('fecha', $hoy)->where('tipo','=','egreso')->get();
        
        // Calcular el total de egresos del día
        $totalEgresos = $egresosHoy->sum('monto');
        
        // Últimos 5 egresos (de cualquier fecha, ordenados por creación)
        $ultimosEgresos = Movimiento::with(['concepto', 'medioDePago'])
            ->where('tipo','=','egreso')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Obtener todos los ingresos del día (usando whereDate para comparar solo la fecha)
        $ingresosHoy = Movimiento::whereDate('fecha', $hoy)->where('tipo','=','ingreso')->get();
        
        // Calcular el total de ingresos del día
        $totalIngresos = $ingresosHoy->sum('monto');
        
        // Últimos 5 ingresos (de cualquier fecha, ordenados por creación)
        $ultimosIngresos = Movimiento::with(['concepto', 'medioDePago'])
            ->where('tipo','=','ingreso')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Obtener todos los ordenes del día (usando whereDate para comparar solo la fecha)
        $ordenesHoy = OrdenDeTrabajo::whereDate('fecha', $hoy)->get();
        
        // Calcular el total de ordenes del día
        $totalOrdenes = count($ordenesHoy);
        
        // Balance del día (ingresos - egresos)
        $balanceDelDia = $totalIngresos - $totalEgresos;

        $stats = [
            'totalEgresos' => (float) $totalEgresos,
            'totalIngresos' => (float) $totalIngresos,
            'totalOrdenes' => $totalOrdenes,
            'balanceDelDia' => (float) $balanceDelDia,
        ];

        // Renderizar vista según el rol del usuario
        if ($user->role_id == 1) {
            // Administrador - Dashboard completo
            return Inertia::render('Administrador/inicio', [
                'stats' => $stats,
                'ultimosEgresos' => $ultimosEgresos,
                'ultimosIngresos' => $ultimosIngresos
            ]);
        }

        // Empleado - Dashboard básico (sin gestión de usuarios)
        return Inertia::render('Empleado/inicio', [
            'stats' => $stats,
            'ultimosEgresos' => $ultimosEgresos,
            'ultimosIngresos' => $ultimosIngresos
        ]);
    }
}