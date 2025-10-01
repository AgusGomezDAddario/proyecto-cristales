// resources/js/types/movimiento.ts

export interface Concepto {
    id: number;
    nombre: string;
}

export interface MedioDePago {
    id: number;
    nombre: string;
}

export interface Movimiento {
    id: number;
    fecha: string;
    monto: number;
    concepto_id: number;
    medio_de_pago_id: number | null;
    comprobante: string | null;
    concepto?: Concepto;
    medio_de_pago?: MedioDePago;  // Cambiar de medioDePago a medio_de_pago
    created_at: string;
    updated_at: string;
}

export interface MovimientoFormData {
    fecha: string;
    monto: string | number;
    concepto_id: string | number;
    medio_de_pago_id: string | number;
    comprobante: string;
}