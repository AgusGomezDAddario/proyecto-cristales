import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

interface Movimiento {
    id: number;
    monto: number;
    created_at: string;
    concepto?: { nombre: string };
    medioDePago?: { nombre: string };
}

interface DashboardStats {
    totalEgresos: number;
    totalIngresos: number;
    totalOrdenes: number;
    balanceDelDia: number;
}

interface Props {
    stats: DashboardStats;
    ultimosEgresos: Movimiento[];
    ultimosIngresos: Movimiento[];
}

export default function AdminDashboard({ stats, ultimosEgresos, ultimosIngresos }: Props) {
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
        <DashboardLayout>
            <Head title="Panel de Control - Administrador" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
                    <p className="mt-2 text-gray-600">Resumen de actividad del día</p>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Balance del día */}
                    <div
                        className={`rounded-2xl p-6 text-white shadow-lg ${
                            stats.balanceDelDia >= 0
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                : 'bg-gradient-to-br from-orange-500 to-orange-600'
                        }`}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold opacity-90">Balance del Día</h3>
                            <div className="bg-opacity-20 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                                <svg
                                    className="h-6 w-6 text-[#1862fd]" // 👈 color de trazo
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <p className="mb-1 text-3xl font-bold">{formatMoney(stats.balanceDelDia)}</p>
                        <p className="text-sm opacity-80">Ingresos - Egresos</p>
                    </div>

                    {/* Total Ingresos */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-600">Ingresos del Día</h3>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                            </div>
                        </div>
                        <p className="mb-1 text-3xl font-bold text-green-600">{formatMoney(stats.totalIngresos)}</p>
                        <Link href="/ingresos" className="text-sm font-medium text-green-600 hover:text-green-700">
                            Ver detalles →
                        </Link>
                    </div>

                    {/* Total Egresos */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-600">Egresos del Día</h3>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                            </div>
                        </div>
                        <p className="mb-1 text-3xl font-bold text-red-600">{formatMoney(stats.totalEgresos)}</p>
                        <Link href="/egresos" className="text-sm font-medium text-red-600 hover:text-red-700">
                            Ver detalles →
                        </Link>
                    </div>

                    {/* Total Órdenes */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-600">Órdenes de Trabajo</h3>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className="mb-1 text-3xl font-bold text-purple-600">{stats.totalOrdenes}</p>
                        <Link href="/ordenes" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                            Ver detalles →
                        </Link>
                    </div>
                </div>

                {/* Accesos rápidos */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Últimos Ingresos */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Últimos Ingresos</h2>
                            <Link href="/ingresos" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                Ver todos →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {ultimosIngresos && ultimosIngresos.length > 0 ? (
                                <>
                                    {ultimosIngresos.map((ingreso) => (
                                        <div
                                            key={ingreso.id}
                                            className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{ingreso.concepto?.nombre || 'Sin concepto'}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatTimeAgo(ingreso.created_at)}
                                                    {ingreso.medioDePago && <span className="ml-2">• {ingreso.medioDePago.nombre}</span>}
                                                </p>
                                            </div>
                                            <span className="ml-4 font-bold text-green-600">{formatMoney(ingreso.monto)}</span>
                                        </div>
                                    ))}
                                    <Link
                                        href="/ingresos/create"
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 py-3 font-semibold text-green-600 transition hover:bg-green-100"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Registrar nuevo ingreso
                                    </Link>
                                </>
                            ) : (
                                <div className="py-8 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <p className="mb-3 font-medium text-gray-500">No hay ingresos registrados</p>
                                    <Link
                                        href="/ingresos/create"
                                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Registrar el primero
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Últimos Egresos */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Últimos Egresos</h2>
                            <Link href="/egresos" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                Ver todos →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {ultimosEgresos && ultimosEgresos.length > 0 ? (
                                <>
                                    {ultimosEgresos.map((egreso) => (
                                        <div
                                            key={egreso.id}
                                            className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{egreso.concepto?.nombre || 'Sin concepto'}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatTimeAgo(egreso.created_at)}
                                                    {egreso.medioDePago && <span className="ml-2">• {egreso.medioDePago.nombre}</span>}
                                                </p>
                                            </div>
                                            <span className="ml-4 font-bold text-red-600">{formatMoney(egreso.monto)}</span>
                                        </div>
                                    ))}
                                    <Link
                                        href="/egresos/create"
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-100"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Registrar nuevo egreso
                                    </Link>
                                </>
                            ) : (
                                <div className="py-8 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <p className="mb-3 font-medium text-gray-500">No hay egresos registrados</p>
                                    <Link
                                        href="/egresos/create"
                                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Registrar el primero
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Últimas Órdenes de Trabajo */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Últimas OT</h2>
                            <Link href="/ordenes" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                Ver todas →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            <div className="py-8 text-center">
                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                    <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <p className="mb-2 font-medium text-gray-500">Sección en desarrollo</p>
                                <p className="text-sm text-gray-400">Las órdenes de trabajo estarán disponibles pronto</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
