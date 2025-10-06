// resources/js/pages/ingresos/create.tsx

import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Camera, Upload, DollarSign, Search, X } from 'lucide-react';

// Definimos MainLayout inline o usamos un contenedor base
const MainLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50">
        {children}
    </div>
);

// Definimos tipos
interface OrdenTrabajo {
    id: number;
    numero: string;
    cliente: string;
    patente: string;
    total: number;
    total_pagado: number;
    pendiente: number;
    con_factura: boolean;
}

interface FormData {
    fecha: string;
    monto: string;
    metodoPago: string;
    comprobante: File | null;
    concepto: string;
    ordenesSeleccionadas: OrdenTrabajo[];
    busqueda: string;
}

export default function CreateIngreso() {
    const [formData, setFormData] = useState<FormData>({
        fecha: new Date().toISOString().split("T")[0],
        monto: "",
        metodoPago: "efectivo",
        comprobante: null,
        concepto: "Cobro OT",
        ordenesSeleccionadas: [],
        busqueda: "",
    });
    const [ordenesDisponibles, setOrdenesDisponibles] = useState<OrdenTrabajo[]>([]);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    const conceptos = ["Cobro OT", "Cobro FC", "Anticipo", "Otro"];
    const metodosPago = ["Efectivo", "Transferencia", "Cheque", "Tarjeta de Crédito", "Tarjeta de Débito"];

    // Buscar órdenes de trabajo pendientes
    const buscarOrdenes = () => {
        if (!formData.busqueda.trim()) {
            setOrdenesDisponibles([]);
            return;
        }

        setLoading(true);

        // Simulamos una llamada API. Reemplazar con `axios` o `fetch` real si es necesario
        // Por ahora usamos datos de ejemplo
        const ejemplo: OrdenTrabajo[] = [
            { id: 1, numero: "OT-001", cliente: "Juan Pérez", patente: "AB123CD", total: 100000, total_pagado: 40000, pendiente: 60000, con_factura: false },
            { id: 2, numero: "FC-002", cliente: "Ana López", patente: "XY987ZW", total: 150000, total_pagado: 0, pendiente: 150000, con_factura: true },
            { id: 3, numero: "OT-003", cliente: "Carlos Díaz", patente: "JK456LM", total: 80000, total_pagado: 80000, pendiente: 0, con_factura: false }, // Pagada
        ];

        // Filtramos por número, cliente o patente
        const resultados = ejemplo.filter(ot => {
            const busca = formData.busqueda.toLowerCase();
            return (
                ot.numero.toLowerCase().includes(busca) ||
                ot.cliente.toLowerCase().includes(busca) ||
                ot.patente.toLowerCase().includes(busca)
            ) && ot.pendiente > 0; // Solo órdenes con saldo pendiente
        });

        setOrdenesDisponibles(resultados);
        setLoading(false);
    };

    // Agregar orden a la lista de seleccionadas
    const agregarOrden = (orden: OrdenTrabajo) => {
        if (!formData.ordenesSeleccionadas.some(o => o.id === orden.id)) {
            setFormData({
                ...formData,
                ordenesSeleccionadas: [...formData.ordenesSeleccionadas, orden],
            });
        }
        setOrdenesDisponibles([]); // Limpiar búsqueda
        setFormData({...formData, busqueda: ''});
    };

    // Remover orden de la lista
    const removerOrden = (id: number) => {
        setFormData({
            ...formData,
            ordenesSeleccionadas: formData.ordenesSeleccionadas.filter(ot => ot.id !== id),
        });
    };

    // Calcular total pendiente de las órdenes seleccionadas
    const totalPendiente = formData.ordenesSeleccionadas.reduce((sum, ot) => sum + ot.pendiente, 0);

    // Calcular total pagado de las órdenes seleccionadas
    const totalPagado = formData.ordenesSeleccionadas.reduce((sum, ot) => sum + ot.total_pagado, 0);

    // Manejar submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, boolean> = {};

        if (formData.ordenesSeleccionadas.length === 0) {
            newErrors.ordenes = true;
        }
        if (!formData.monto) newErrors.monto = true;
        if (Number.parseFloat(formData.monto) <= 0) newErrors.monto = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            alert(`Ingreso guardado correctamente

Fecha: ${formData.fecha}
Monto: $${Number.parseFloat(formData.monto).toLocaleString()}
Método de Pago: ${formData.metodoPago}
Concepto: ${formData.concepto}
Órdenes asociadas: ${formData.ordenesSeleccionadas.map(ot => ot.numero).join(', ')}`);

            router.visit('/ingresos');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, comprobante: file });
        }
    };

    useEffect(() => {
        if (formData.busqueda) {
            const timeout = setTimeout(() => {
                buscarOrdenes();
            }, 500);
            return () => clearTimeout(timeout);
        } else {
            setOrdenesDisponibles([]);
        }
    }, [formData.busqueda]);

    return (
        <MainLayout>
            <Head title="Nuevo Ingreso" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link
                        href="/ingresos"
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                        ← Volver a Ingresos
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Registrar Nuevo Ingreso</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Fecha */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                    className="h-10 w-full rounded-md border border-input bg-white text-foreground px-3 focus:border-primary focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Concepto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Concepto <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.concepto}
                                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                                    className="h-10 w-full rounded-md border border-input bg-white text-foreground px-3 focus:border-primary focus:ring-2 focus:ring-primary appearance-none"
                                >
                                    {conceptos.map((c) => (
                                        <option key={c} value={c} className="bg-white text-foreground">
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Búsqueda de Órdenes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar Órdenes de Trabajo
                                </label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={formData.busqueda}
                                        onChange={(e) => setFormData({ ...formData, busqueda: e.target.value })}
                                        placeholder="Buscar por número, cliente o patente..."
                                        className="h-10 w-full rounded-md border border-input bg-white text-foreground pr-3 pl-9 focus:border-primary focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Resultados de búsqueda */}
                                {ordenesDisponibles.length > 0 && (
                                    <div className="mt-3 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                                        {ordenesDisponibles.map((ot) => (
                                            <div
                                                key={ot.id}
                                                className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                                onClick={() => agregarOrden(ot)}
                                            >
                                                <div>
                                                    <div className="font-medium">{ot.numero}</div>
                                                    <div className="text-sm text-gray-600">{ot.cliente} - {ot.patente}</div>
                                                </div>
                                                <div className="text-sm font-semibold text-green-600">
                                                    Pendiente: ${ot.pendiente.toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Órdenes seleccionadas */}
                            {formData.ordenesSeleccionadas.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Órdenes Seleccionadas
                                    </label>
                                    <div className="space-y-2">
                                        {formData.ordenesSeleccionadas.map((ot) => (
                                            <div key={ot.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                <div>
                                                    <div className="font-medium">{ot.numero}</div>
                                                    <div className="text-sm text-gray-600">
                                                        Cliente: {ot.cliente} - Pendiente: ${ot.pendiente.toLocaleString()}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removerOrden(ot.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-sm text-gray-600">
                                        Total pendiente de las órdenes seleccionadas: <span className="font-semibold">${totalPendiente.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            {/* Monto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monto <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.monto}
                                        onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                                        className={`h-10 w-full rounded-md border pr-3 pl-9 focus:border-primary focus:ring-2 focus:ring-primary bg-white text-foreground ${
                                            errors.monto ? 'border-destructive' : 'border-input'
                                        }`}
                                    />
                                </div>
                                {errors.monto && <p className="text-sm text-destructive mt-1">Este campo es obligatorio</p>}
                            </div>

                            {/* Método de Pago */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                                <select
                                    value={formData.metodoPago}
                                    onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                                    className="h-10 w-full rounded-md border border-input bg-white text-foreground px-3 focus:border-primary focus:ring-2 focus:ring-primary appearance-none"
                                >
                                    {metodosPago.map((metodo) => (
                                        <option key={metodo} value={metodo.toLowerCase()} className="bg-white text-foreground">
                                            {metodo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Comprobante */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Comprobante</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {formData.comprobante ? (
                                        <div className="space-y-2">
                                            <Camera className="mx-auto w-8 h-8 text-green-600" />
                                            <p className="text-sm text-green-600 font-medium">{formData.comprobante.name}</p>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, comprobante: null })}
                                                className="text-sm text-red-600 hover:text-red-800"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="mx-auto w-8 h-8 text-gray-400" />
                                            <div>
                                                <label className="cursor-pointer">
                                                    <span className="text-green-600 hover:text-green-800 font-medium">📷 Adjuntar imagen</span>
                                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Botón Guardar y Cancelar */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 h-11 rounded-md bg-green-600 font-semibold text-primary-foreground transition-colors hover:bg-green-700"
                                >
                                    💾 Guardar Ingreso
                                </button>
                                <Link
                                    href="/ingresos"
                                    className="flex-1 h-11 rounded-md bg-red-600 px-4 font-semibold text-primary-foreground transition-colors hover:bg-red-700 flex items-center justify-center"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}