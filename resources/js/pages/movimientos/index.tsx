// resources/js/pages/movimientos/index.tsx

import { Head, Link } from '@inertiajs/react';
import { Movimiento } from '@/types/movimiento';
import DashboardLayout from '@/layouts/DashboardLayout';

interface Props {
    movimientos: Movimiento[];
    tipo: string;   // 'ingreso' o 'egreso'
    label: string;  // 'Ingreso' o 'Egreso'
}

export default function Index({ movimientos, tipo, label }: Props) {
    const labelPlural = label.endsWith('s') ? label : `${label}s`;
    const tipoPlural = tipo.endsWith('s') ? tipo : `${tipo}s`;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    return (
        <DashboardLayout>
            <Head title={label} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{labelPlural}</h1>
                        <p className="text-gray-600 mt-2">Listado de {tipoPlural} registrados</p>
                    </div>
                    <Link
                        href={`/${tipoPlural}/create`}
                        className={`${tipo === 'egreso'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            } text-white font-medium py-2.5 px-6 rounded-lg transition shadow-lg hover:shadow-xl`}
                    >
                        + Nuevo {tipo}
                    </Link>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {movimientos.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg font-semibold mb-2">No hay {tipoPlural.toLowerCase()} registrados</p>
                            <p className="text-gray-400 text-sm mb-4">Comienza registrando tu primer {tipo.toLowerCase()}</p>
                            <Link
                                href={`/${tipoPlural}/create`}
                                className={`inline-block mt-2 ${tipo === 'egreso'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                    } text-white px-6 py-2.5 rounded-lg font-semibold transition`}
                            >
                                Registrar el primero →
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Concepto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Medio de Pago
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Comprobante
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {movimientos.map((movimiento) => (
                                        <tr key={movimiento.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(movimiento.fecha)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {movimiento.concepto?.nombre || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {movimiento.medio_de_pago?.nombre || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {movimiento.comprobante || '-'}
                                            </td>
                                            <td
                                                className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${tipo === 'egreso' ? 'text-red-600' : 'text-green-600'
                                                    }`}
                                            >
                                                {formatMoney(movimiento.monto)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/${tipoPlural}/${movimiento.id}`}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        Ver
                                                    </Link>
                                                    <Link
                                                        href={`/${tipoPlural}/${movimiento.id}/edit`}
                                                        className="text-green-600 hover:text-green-800 font-medium"
                                                    >
                                                        Editar
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Resumen */}
                {movimientos.length > 0 && (
                    <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Total de {tipoPlural.toLowerCase()}:</span>
                            <span
                                className={`text-2xl font-bold ${tipo === 'egreso' ? 'text-red-600' : 'text-green-600'
                                    }`}
                            >
                                {formatMoney(movimientos.reduce((sum, m) => sum + Number(m.monto), 0))}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}