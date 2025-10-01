// resources/js/pages/movimientos/index.tsx

import { Head, Link } from '@inertiajs/react';
import { Movimiento } from '@/types/movimiento';

interface Props {
    movimientos: Movimiento[];
}

export default function Index({ movimientos }: Props) {
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
        <>
            <Head title="Egresos" />

            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Egresos</h1>
                            <p className="text-gray-600 mt-2">Listado de movimientos registrados</p>
                        </div>
                        <Link
                            href="/movimientos/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition"
                        >
                            + Nuevo Egreso
                        </Link>
                    </div>

                    {/* Tabla */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {movimientos.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No hay egresos registrados</p>
                                <Link
                                    href="/movimientos/create"
                                    className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 text-right">
                                                    {formatMoney(movimiento.monto)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/movimientos/${movimiento.id}`}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={`/movimientos/${movimiento.id}/edit`}
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
                        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Total de egresos:</span>
                                <span className="text-xl font-bold text-red-600">
                                    {formatMoney(movimientos.reduce((sum, m) => sum + Number(m.monto), 0))}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}