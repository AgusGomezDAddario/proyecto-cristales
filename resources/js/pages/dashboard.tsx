// resources/js/pages/dashboard.tsx

import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Movimiento } from '@/types/movimiento';

interface DashboardStats {
    totalEgresos: number;
    totalIngresos: number;
    totalOrdenes: number;
    balanceDelDia: number;
}

interface Props {
    stats: DashboardStats;
    ultimosEgresos: Movimiento[];
}

export default function Dashboard({ stats, ultimosEgresos }: Props) {
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(amount);
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `Hace ${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''}`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return `Hace ${days} día${days !== 1 ? 's' : ''}`;
        }
    };

    return (
        <MainLayout>
            <Head title="Panel de Control" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
                    <p className="text-gray-600 mt-2">Resumen de actividad del día</p>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Balance del día */}
                    <div className={`rounded-2xl shadow-lg p-6 text-white ${
                        stats.balanceDelDia >= 0 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                            : 'bg-gradient-to-br from-orange-500 to-orange-600'
                    }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold opacity-90">Balance del Día</h3>
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold mb-1">{formatMoney(stats.balanceDelDia)}</p>
                        <p className="text-sm opacity-80">Ingresos - Egresos</p>
                    </div>

                    {/* Total Ingresos */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-600">Ingresos del Día</h3>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-green-600 mb-1">{formatMoney(stats.totalIngresos)}</p>
                        <Link href="/ingresos" className="text-sm text-green-600 hover:text-green-700 font-medium">
                            Ver detalles →
                        </Link>
                    </div>

                    {/* Total Egresos */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-600">Egresos del Día</h3>
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-red-600 mb-1">{formatMoney(stats.totalEgresos)}</p>
                        <Link href="/movimientos" className="text-sm text-red-600 hover:text-red-700 font-medium">
                            Ver detalles →
                        </Link>
                    </div>

                    {/* Total Órdenes */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-600">Órdenes de Trabajo</h3>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-purple-600 mb-1">{stats.totalOrdenes}</p>
                        <Link href="/ordenes-trabajo" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                            Ver detalles →
                        </Link>
                    </div>
                </div>

                {/* Accesos rápidos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Últimos Egresos */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Últimos Egresos</h2>
                            <Link href="/movimientos" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                                Ver todos →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {ultimosEgresos && ultimosEgresos.length > 0 ? (
                                <>
                                    {ultimosEgresos.map((egreso) => (
                                        <div key={egreso.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">
                                                    {egreso.concepto?.nombre || 'Sin concepto'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatTimeAgo(egreso.created_at)}
                                                    {egreso.medio_de_pago && (
                                                        <span className="ml-2">• {egreso.medio_de_pago.nombre}</span>
                                                    )}
                                                </p>
                                            </div>
                                            <span className="text-red-600 font-bold ml-4">
                                                {formatMoney(egreso.monto)}
                                            </span>
                                        </div>
                                    ))}
                                    <Link
                                        href="/movimientos/create"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition mt-4"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Registrar nuevo egreso
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium mb-3">No hay egresos registrados</p>
                                    <Link
                                        href="/movimientos/create"
                                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Registrar el primero
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Últimas Órdenes de Trabajo */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Últimas OT</h2>
                            <Link href="/ordenes-trabajo" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                                Ver todas →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {/* Placeholder - cuando implementes OT, reemplaza esto */}
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium mb-2">Sección en desarrollo</p>
                                <p className="text-sm text-gray-400">Las órdenes de trabajo estarán disponibles pronto</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}