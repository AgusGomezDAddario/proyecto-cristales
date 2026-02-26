import React, { useState } from 'react';
import { Plus, Trash2, Calendar, CreditCard, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

type Pago = {
    medio_de_pago_id: number | string;
    monto: number | string;
    fecha: string;
    observacion: string;
};

type Props = {
    pagos: Pago[];
    setPagos: (pagos: Pago[]) => void;
    mediosDePago: Array<{ id: number; nombre: string }>;
    totalOrden: number;
    errors?: Record<string, string>;
    fechaOrden: string; // Para validar que pagos no sean anteriores a la orden
};

export default function PagosSection({ pagos, setPagos, mediosDePago, totalOrden, errors = {}, fechaOrden }: Props) {
    const [showAgregarPago, setShowAgregarPago] = useState(false);

    const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0);
    const saldoPendiente = totalOrden - totalPagado;
    const porcentajePagado = totalOrden > 0 ? (totalPagado / totalOrden) * 100 : 0;

    const nuevoPago: Pago = {
        medio_de_pago_id: '',
        monto: '',
        fecha: new Date().toISOString().split('T')[0],
        observacion: '',
    };

    const agregarPago = () => {
        setPagos([...pagos, { ...nuevoPago }]);
        setShowAgregarPago(false);
    };

    const eliminarPago = (index: number) => {
        setPagos(pagos.filter((_, i) => i !== index));
    };

    const actualizarPago = (index: number, campo: keyof Pago, valor: any) => {
        const nuevosPagos = [...pagos];
        nuevosPagos[index] = { ...nuevosPagos[index], [campo]: valor };
        setPagos(nuevosPagos);
    };

    const getEstadoPago = () => {
        if (totalPagado === 0) return { color: 'red', texto: 'Sin pagos', icon: AlertCircle };
        if (saldoPendiente > 0) return { color: 'yellow', texto: 'Pago parcial', icon: AlertCircle };
        if (saldoPendiente === 0) return { color: 'green', texto: 'Pagado totalmente', icon: CheckCircle };
        return { color: 'blue', texto: 'Sobrepago', icon: AlertCircle };
    };

    const estadoPago = getEstadoPago();
    const Icon = estadoPago.icon;

    return (
        <div className="space-y-6">
            {/* Header con estado visual */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Pagos y Facturación</h3>
                        <p className="text-sm text-gray-500">Registrá los pagos recibidos para esta orden</p>
                    </div>
                </div>

                {/* Badge de estado */}
                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                        estadoPago.color === 'green'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : estadoPago.color === 'yellow'
                            ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                            : estadoPago.color === 'red'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}
                >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-semibold">{estadoPago.texto}</span>
                </div>
            </div>

            {/* Resumen visual del pago */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Total de la orden</p>
                        <p className="text-2xl font-bold text-slate-900">${totalOrden.toLocaleString('es-AR')}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Total pagado</p>
                        <p className="text-2xl font-bold text-green-600">${totalPagado.toLocaleString('es-AR')}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Saldo pendiente</p>
                        <p className={`text-2xl font-bold ${saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${Math.abs(saldoPendiente).toLocaleString('es-AR')}
                        </p>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Progreso de pago</span>
                        <span className="font-semibold text-slate-900">{Math.min(porcentajePagado, 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                porcentajePagado >= 100 ? 'bg-green-500' : porcentajePagado > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(porcentajePagado, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Lista de pagos */}
            <div className="space-y-3">
                {pagos.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">No hay pagos registrados</p>
                        <p className="text-slate-400 text-xs mt-1">Agregá el primer pago haciendo click en el botón de abajo</p>
                    </div>
                ) : (
                    pagos.map((pago, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                {/* Fecha */}
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Fecha del pago *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="date"
                                            value={pago.fecha}
                                            min={fechaOrden}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => actualizarPago(index, 'fecha', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition ${
                                                errors[`pagos.${index}.fecha`] ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                        />
                                    </div>
                                    {errors[`pagos.${index}.fecha`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`pagos.${index}.fecha`]}</p>
                                    )}
                                </div>

                                {/* Medio de pago */}
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Medio de pago *</label>
                                    <select
                                        value={pago.medio_de_pago_id}
                                        onChange={(e) => actualizarPago(index, 'medio_de_pago_id', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition ${
                                            errors[`pagos.${index}.medio_de_pago_id`] ? 'border-red-300' : 'border-slate-200'
                                        }`}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {mediosDePago.map((mp) => (
                                            <option key={mp.id} value={mp.id}>
                                                {mp.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors[`pagos.${index}.medio_de_pago_id`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`pagos.${index}.medio_de_pago_id`]}</p>
                                    )}
                                </div>

                                {/* Monto */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Monto *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
                                        <input
                                            type="number"
                                            value={pago.monto}
                                            onChange={(e) => actualizarPago(index, 'monto', e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            className={`w-full pl-7 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition ${
                                                errors[`pagos.${index}.monto`] ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                        />
                                    </div>
                                    {errors[`pagos.${index}.monto`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`pagos.${index}.monto`]}</p>
                                    )}
                                </div>

                                {/* Observación */}
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Observación</label>
                                    <input
                                        type="text"
                                        value={pago.observacion}
                                        onChange={(e) => actualizarPago(index, 'observacion', e.target.value)}
                                        placeholder="Ej: Seña inicial"
                                        maxLength={255}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                                    />
                                </div>

                                {/* Botón eliminar */}
                                <div className="md:col-span-1 flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => eliminarPago(index)}
                                        className="w-full md:w-auto p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Eliminar pago"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Botón agregar pago */}
            <button
                type="button"
                onClick={agregarPago}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl border-2 border-blue-200 transition-all hover:border-blue-300"
            >
                <Plus className="h-5 w-5" />
                Agregar pago
            </button>

            {/* Advertencia si no está completamente pagado */}
            {saldoPendiente > 0 && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900">Pago incompleto</p>
                        <p className="text-sm text-amber-700 mt-1">
                            Falta registrar ${saldoPendiente.toLocaleString('es-AR')} para completar el pago total de la orden.
                            <span className="font-semibold"> No podrás finalizar la orden</span> hasta que esté completamente pagada.
                        </p>
                    </div>
                </div>
            )}

            {/* Error general de pagos */}
            {errors.pagos && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{errors.pagos}</p>
                </div>
            )}
        </div>
    );
}