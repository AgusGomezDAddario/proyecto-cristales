// resources/js/pages/ingresos/index.tsx

import { Head, Link } from '@inertiajs/react';

// Definimos el tipo Ingreso localmente para evitar el import
interface Ingreso {
    id: number;
    fecha: string;
    concepto: {
        nombre: string;
    } | null;
    medio_de_pago: {
        nombre: string;
    } | null;
    comprobante: string | null;
    monto: number;
}

// Definimos MainLayout inline o usamos un div base
// Si no tenés MainLayout, usamos un contenedor base
const MainLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50">
        {children}
    </div>
);

interface Props {
    ingresos: Ingreso[];
}

export default function IngresosIndex({ ingresos }: Props) {
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
        <MainLayout>
            <Head title="Ingresos" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Ingresos</h1>
                        <p className="text-gray-600 mt-2">Listado de ingresos registrados</p>
                    </div>
                    <Link
                        href="/ingresos/create"
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-lg hover:shadow-xl"
                    >
                        + Nuevo Ingreso
                    </Link>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {ingresos.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg font-semibold mb-2">No hay ingresos registrados</p>
                            <p className="text-gray-400 text-sm mb-4">Comienza registrando tu primer ingreso</p>
                            <Link
                                href="/ingresos/create"
                                className="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
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
                                    {ingresos.map((ingreso) => (
                                        <tr key={ingreso.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(ingreso.fecha)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {ingreso.concepto?.nombre || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {ingreso.medio_de_pago?.nombre || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {ingreso.comprobante || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 text-right">
                                                {formatMoney(ingreso.monto)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/ingresos/${ingreso.id}`}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        Ver
                                                    </Link>
                                                    <Link
                                                        href={`/ingresos/${ingreso.id}/edit`}
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
                {ingresos.length > 0 && (
                    <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Total de ingresos:</span>
                            <span className="text-2xl font-bold text-green-600">
                                {formatMoney(ingresos.reduce((sum, i) => sum + Number(i.monto), 0))}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}