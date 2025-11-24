// resources/js/pages/movimientos/create.tsx

import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Concepto, MedioDePago, MovimientoFormData } from '@/types/movimiento';
import DashboardLayout from '@/layouts/DashboardLayout';

interface Props {
    conceptos: Concepto[];
    mediosDePago: MedioDePago[];
    tipo: string;   // 'ingreso' o 'egreso'
    label: string;  // 'Ingreso' o 'Egreso'
}

export default function Create({ conceptos, mediosDePago, tipo, label }: Props) {
    const color = tipo === 'egreso' ? 'red' : 'green';
    const labelPlural = label.endsWith('s') ? label : `${label}s`;
    const tipoPlural = tipo.endsWith('s') ? tipo : `${tipo}s`;

    const colorClasses = {
        red: {
            bg500: 'bg-red-500',
            ring500: 'focus:ring-red-500',
            border500: 'focus:border-red-500',
            base: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
        },
        green: {
            bg500: 'bg-green-500',
            ring500: 'focus:ring-green-500',
            border500: 'focus:border-green-500',
            base: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        },
    };

    const current = colorClasses[color];

    const getFechaArgentina = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const { data, setData, post, processing, errors } = useForm<MovimientoFormData & { es_caja_chica?: boolean }>({
        fecha: getFechaArgentina(),
        monto: '',
        concepto_id: '',
        medio_de_pago_id: '',
        comprobante: '',
        es_caja_chica: tipo === 'egreso' ? false : undefined, // ✅ nuevo (solo aplica a egreso)
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/${tipoPlural}`);
    };

    return (
        <DashboardLayout>
            <Head title={`Registrar ${label}`} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 ${current.bg500} rounded-xl flex items-center justify-center shadow-lg`}>
                            {tipo === 'egreso' ? (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Registrar {tipo}</h1>
                            <p className="text-gray-600 mt-1">Complete los datos del {tipo}</p>
                        </div>
                    </div>
                </div>

                {/* Card con formulario */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Fecha */}
                        <div>
                            <label htmlFor="fecha" className="block text-sm font-semibold text-gray-800 mb-2">
                                Fecha *
                            </label>
                            <input
                                id="fecha"
                                type="date"
                                value={data.fecha}
                                onChange={(e) => setData('fecha', e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 ${current.ring500} ${current.border500} focus:bg-white outline-none transition text-gray-900 font-medium ${
                                    errors.fecha ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            />
                            {errors.fecha && (
                                <p className={`mt-2 text-sm text-red-600 flex items-center gap-1`}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.fecha}
                                </p>
                            )}
                        </div>

                        {/* Monto */}
                        <div>
                            <label htmlFor="monto" className="block text-sm font-semibold text-gray-800 mb-2">
                                Monto *
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold text-lg">$</span>
                                <input
                                    id="monto"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={data.monto}
                                    onChange={(e) => setData('monto', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 ${current.ring500} ${current.border500} focus:bg-white outline-none transition text-gray-900 font-semibold text-lg ${
                                        errors.monto ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                />
                            </div>
                            {errors.monto && (
                                <p className={`mt-2 text-sm text-red-600 flex items-center gap-1`}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.monto}
                                </p>
                            )}
                        </div>

                        {/* ✅ Caja chica (solo egresos) */}
                        {tipo === 'egreso' && (
                            <div className="flex items-center gap-3">
                                <input
                                    id="es_caja_chica"
                                    type="checkbox"
                                    checked={!!data.es_caja_chica}
                                    onChange={(e) => setData('es_caja_chica', e.target.checked)}
                                />
                                <label htmlFor="es_caja_chica" className="text-sm font-semibold text-gray-800">
                                    Pertenece a caja chica
                                </label>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Concepto */}
                            <div>
                                <label htmlFor="concepto_id" className="block text-sm font-semibold text-gray-800 mb-2">
                                    Concepto *
                                </label>
                                <select
                                    id="concepto_id"
                                    value={data.concepto_id}
                                    onChange={(e) => setData('concepto_id', e.target.value)}
                                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 ${current.ring500} ${current.border500} focus:bg-white outline-none transition text-gray-900 font-medium ${
                                        errors.concepto_id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <option value="" className="text-gray-500">Seleccione un concepto</option>
                                    {conceptos.map((concepto) => (
                                        <option key={concepto.id} value={concepto.id} className="text-gray-900">
                                            {concepto.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.concepto_id && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.concepto_id}
                                    </p>
                                )}
                            </div>

                            {/* Medio de Pago */}
                            <div>
                                <label htmlFor="medio_de_pago_id" className="block text-sm font-semibold text-gray-800 mb-2">
                                    Medio de Pago
                                </label>
                                <select
                                    id="medio_de_pago_id"
                                    value={data.medio_de_pago_id}
                                    onChange={(e) => setData('medio_de_pago_id', e.target.value)}
                                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 ${current.ring500} ${current.border500} focus:bg-white outline-none transition text-gray-900 font-medium ${
                                        errors.medio_de_pago_id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <option value="" className="text-gray-500">Seleccione un medio</option>
                                    {mediosDePago.map((medio) => (
                                        <option key={medio.id} value={medio.id} className="text-gray-900">
                                            {medio.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.medio_de_pago_id && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.medio_de_pago_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Comprobante */}
                        <div>
                            <label htmlFor="comprobante" className="block text-sm font-semibold text-gray-800 mb-2">
                                Número de Comprobante
                            </label>
                            <input
                                id="comprobante"
                                type="text"
                                placeholder="Ej: 001-00123456"
                                value={data.comprobante}
                                onChange={(e) => setData('comprobante', e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 ${current.ring500} ${current.border500} focus:bg-white outline-none transition text-gray-900 font-medium placeholder:text-gray-400 ${
                                    errors.comprobante ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            />
                            {errors.comprobante && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 01116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.comprobante}
                                </p>
                            )}
                        </div>

                        {/* Botones  */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`flex-1 ${current.base} text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]`}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Guardando...
                                    </span>
                                ) : (
                                    `💾 Guardar ${label}`
                                )}
                            </button>
                            <Link
                                href={`/${tipoPlural}`}
                                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-center shadow-sm hover:shadow"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Info adicional */}
                <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-blue-800">
                            <strong>Tip:</strong> Los campos marcados con * son obligatorios. El medio de pago y comprobante son opcionales.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
