<?php

namespace App\Observers;

use App\Models\OrdenDeTrabajo;
use App\Models\Movimiento;
use Illuminate\Support\Facades\Log;

class OrdenDeTrabajoObserver
{
    /**
     * No ejecutamos nada en created() porque los pagos aún no existen
     */
    public function created(OrdenDeTrabajo $orden)
    {
        // Los pagos se crean DESPUÉS de la OT, así que no hacemos nada aquí
    }

    /**
     * Detecta cuando se actualiza una OT y cambia a estado "Pagado"
     */
    public function updated(OrdenDeTrabajo $orden)
    {
        // Verificar si cambió el estado a "Pagado" (id: 1)
        if ($orden->isDirty('estado_id') && $orden->estado_id == 1) {
            Log::info("Estado cambió a Pagado para OT #{$orden->id}, registrando ingresos...");
            $this->registrarIngresos($orden);
        }
    }

    /**
     * Registra los ingresos basados en los pagos de la OT
     */
    private function registrarIngresos(OrdenDeTrabajo $orden)
    {
        try {
            // Cargar los pagos de la orden
            $pagos = $orden->pagos;

            if ($pagos->isEmpty()) {
                Log::warning("La OT #{$orden->id} no tiene pagos registrados.");
                return;
            }

            // Crear un movimiento de ingreso por cada pago
            foreach ($pagos as $pago) {
                Movimiento::create([
                    'fecha' => $orden->fecha,
                    'monto' => $pago->valor,
                    'concepto_id' => 3, // "Cobro a clientes"
                    'medio_de_pago_id' => $pago->medio_de_pago_id,
                    'comprobante' => "OT-{$orden->id}",
                    'tipo' => 'ingreso',
                ]);
            }

            Log::info("✅ Ingresos registrados automáticamente para la OT #{$orden->id}");
        } catch (\Exception $e) {
            Log::error("❌ Error al registrar ingresos para OT #{$orden->id}: " . $e->getMessage());
        }
    }
}