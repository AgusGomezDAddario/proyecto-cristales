// resources/js/types/movimiento.ts

export interface Movimiento {
    id: number;
    fecha: string;
    monto: number;
    tipo: 'ingreso' | 'egreso';
    comprobante?: string | null;
    orden_de_trabajo_id?: number | null; // NUEVO
    concepto_id: number;
    medio_de_pago_id?: number | null;
    created_at?: string;
    updated_at?: string;
    
    // Relaciones
    concepto?: {
        id: number;
        nombre: string;
        tipo: 'ingreso' | 'egreso';
    };
    medio_de_pago?: {
        id: number;
        nombre: string;
    };
    comprobantes?: Array<{
        id: number;
        ruta_archivo: string;
    }>;
    // NUEVA RELACIÓN
    orden_de_trabajo?: {
        id: number;
        numero_orden?: string;
        fecha: string;
    };
}