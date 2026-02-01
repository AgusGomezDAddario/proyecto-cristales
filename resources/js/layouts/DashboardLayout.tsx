import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface Props extends PropsWithChildren {
    title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const { url } = usePage();
    const { auth } = usePage().props as any;

    const isActive = (path: string) => url.startsWith(path);
    const isAdmin = auth?.user?.role_id === 1;
    const isAdminSection =
        isActive('/admin/users') ||
        isActive('/catalogo-vehiculos') ||
        isActive('/clientes') ||
        isActive('/companias-seguros') ||
        isActive('/medio-de-pago') ||
        isActive('/conceptos') ||
        isActive('/admin/metrics');

    /* TOAST */
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        if (mobileMenuOpen) setAdminDropdownOpen(false);
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (!isAdmin) setAdminDropdownOpen(false);
    }, [isAdmin]);

    useEffect(() => {
        if (moreMenuOpen) setAdminDropdownOpen(false);
    }, [moreMenuOpen]);

    useEffect(() => {
        if (adminDropdownOpen) setMoreMenuOpen(false);
    }, [adminDropdownOpen]);

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
            {/* Toast */}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: '#1f2937',
                        color: '#fff',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* 🔹 NAVBAR */}
            <nav className="border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo + nombre */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <div className="hidden lg:block">
                                <h1 className="text-l font-bold text-gray-900">Sistema de Gestión Integral</h1>
                            </div>
                        </div>

                        {/* Menú de navegación (desktop) */}
                        <div className="hidden items-center gap-2 lg:flex">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/admin"
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive('/admin') && !isActive('/admin/users')
                                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    📊 Panel de Control
                                </Link>

                                <Link
                                    href="/egresos"
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive('/egresos') ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    💸 Egresos
                                </Link>

                                <Link
                                    href="/ingresos"
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive('/ingresos') ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    💰 Ingresos
                                </Link>

                                <Link
                                    href="/resumen-del-dia"
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive('/resumen-del-dia') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    🧾 Resumen del día
                                </Link>

                                <Link
                                    href="/ordenes"
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive('/ordenes') ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    🚗 Órdenes de Trabajo
                                </Link>
                            </div>

                            {isAdmin && (
                                <div className="relative">
                                    <button
                                        onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                                        className="flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold whitespace-nowrap text-gray-700 transition-all hover:bg-gray-200"
                                    >
                                        ⚙️ Administración
                                        <svg
                                            className={`h-4 w-4 transition-transform ${adminDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {adminDropdownOpen && (
                                        <div className="absolute top-full right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                            <Link
                                                href="/clientes"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                    isActive('/clientes') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                }`}
                                            >
                                                👥 Clientes
                                            </Link>
                                            <Link
                                                href="/catalogo-vehiculos"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                    isActive('/catalogo-vehiculos') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                }`}
                                            >
                                                🚙 Vehículos
                                            </Link>
                                            <Link
                                                href="/companias-seguros"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                    isActive('/companias-seguros') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                }`}
                                            >
                                                🛡️ Seguros
                                            </Link>
                                            <Link
                                                href="/articulos"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                    isActive('/articulos') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                }`}
                                            >
                                                📦 Artículos
                                            </Link>
                                            <Link href="#" className="block cursor-not-allowed px-4 py-2 text-sm text-gray-400">
                                                🏭 Proveedores
                                            </Link>
                                            <Link
                                                href="/medio-de-pago"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                    isActive('/medio-de-pago') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                }`}
                                            >
                                                💳 Medios de pago
                                            </Link>
                                            {/* 🏷️ CONCEPTOS */}
                                            <Link
                                                href="/conceptos"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                    isActive('/conceptos') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                }`}
                                            >
                                                🏷️ Conceptos
                                            </Link>
                                            <Link
                                                href="/admin/metrics"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                    isActive('/admin/metrics') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                }`}
                                            >
                                                📈 Métricas
                                            </Link>
                                            <div className="my-1 border-t border-gray-100"></div>
                                            <Link
                                                href="/admin/users"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                    isActive('/admin/users') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                }`}
                                            >
                                                👤 Usuarios
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Botón de logout */}
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="ml-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap text-red-600 transition-all hover:bg-red-50"
                            >
                                🚪 Salir
                            </Link>
                        </div>

                        {/* Menú de navegación (tablet) */}
                        <div className="hidden items-center gap-2 md:flex lg:hidden">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/admin"
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive('/admin') && !isActive('/admin/users')
                                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    📊 Panel de Control
                                </Link>

                                <Link
                                    href="/egresos"
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive('/egresos') ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    💸 Egresos
                                </Link>

                                <Link
                                    href="/ingresos"
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive('/ingresos') ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    💰 Ingresos
                                </Link>

                                <Link
                                    href="/ordenes"
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                        isActive('/ordenes') ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    🚗 Órdenes de Trabajo
                                </Link>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                                    className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold whitespace-nowrap text-gray-700 transition-all hover:bg-gray-200"
                                >
                                    ➕ Más
                                    <svg
                                        className={`h-4 w-4 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {moreMenuOpen && (
                                    <div className="absolute top-full right-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                        <Link
                                            href="/resumen-del-dia"
                                            onClick={() => setMoreMenuOpen(false)}
                                            className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                isActive('/resumen-del-dia') ? 'font-medium text-blue-700' : 'text-gray-700'
                                            }`}
                                        >
                                            🧾 Resumen del día
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <div className="my-1 border-t border-gray-100"></div>
                                                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">⚙️ Administración</div>
                                                <Link
                                                    href="/clientes"
                                                    onClick={() => setMoreMenuOpen(false)}
                                                    className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                        isActive('/clientes') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                    }`}
                                                >
                                                    👥 Clientes
                                                </Link>
                                                <Link
                                                    href="/catalogo-vehiculos"
                                                    onClick={() => setMoreMenuOpen(false)}
                                                    className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                        isActive('/catalogo-vehiculos') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                    }`}
                                                >
                                                    🚙 Vehículos
                                                </Link>
                                                <Link
                                                    href="/companias-seguros"
                                                    onClick={() => setMoreMenuOpen(false)}
                                                    className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                        isActive('/companias-seguros') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                    }`}
                                                >
                                                    🛡️ Seguros
                                                </Link>
                                                <Link href="#" className="block cursor-not-allowed px-4 py-2 text-sm text-gray-400">
                                                    📦 Artículos
                                                </Link>
                                                <Link href="#" className="block cursor-not-allowed px-4 py-2 text-sm text-gray-400">
                                                    🏭 Proveedores
                                                </Link>
                                                <Link
                                                    href="/medio-de-pago"
                                                    onClick={() => setMoreMenuOpen(false)}
                                                    className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                        isActive('/medio-de-pago') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                    }`}
                                                >
                                                    💳 Medios de pago
                                                </Link>
                                                {/* 🏷️ CONCEPTOS */}
                                                <Link
                                                    href="/conceptos"
                                                    onClick={() => setMoreMenuOpen(false)}
                                                    className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                        isActive('/conceptos') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                    }`}
                                                >
                                                    🏷️ Conceptos
                                                </Link>
                                                <Link
                                                    href="/admin/metrics"
                                                    onClick={() => setMoreMenuOpen(false)}
                                                    className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                        isActive('/admin/metrics') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                    }`}
                                                >
                                                    📈 Métricas
                                                </Link>
                                                <Link
                                                    href="/admin/users"
                                                    onClick={() => setMoreMenuOpen(false)}
                                                    className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                                                        isActive('/admin/users') ? 'font-medium text-orange-600' : 'text-gray-700'
                                                    }`}
                                                >
                                                    👤 Usuarios
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold whitespace-nowrap text-red-600 transition-all hover:bg-red-50"
                            >
                                🚪 Salir
                            </Link>
                        </div>

                        {/* Botón de menú móvil */}
                        <div className="flex items-center md:hidden">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                {mobileMenuOpen && (
                    <div className="border-t border-gray-200 bg-white md:hidden">
                        <div className="space-y-1 px-4 py-2">
                            <Link
                                href="/admin"
                                className={`block rounded-lg px-4 py-2 font-semibold ${
                                    isActive('/admin') && !isActive('/admin/users') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                📊 Panel de Control
                            </Link>

                            <Link
                                href="/egresos"
                                className={`block rounded-lg px-4 py-2 font-semibold ${
                                    isActive('/egresos') ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                💸 Egresos
                            </Link>
                            <Link
                                href="/ingresos"
                                className={`block rounded-lg px-4 py-2 font-semibold ${
                                    isActive('/ingresos') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                💰 Ingresos
                            </Link>
                            <Link
                                href="/resumen-del-dia"
                                className={`block rounded-lg px-4 py-2 font-semibold ${
                                    isActive('/resumen-del-dia') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                🧾 Resumen del día
                            </Link>

                            <Link
                                href="/ordenes"
                                className={`block rounded-lg px-4 py-2 font-semibold ${
                                    isActive('/ordenes') ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                🚗 Órdenes de Trabajo
                            </Link>

                            {isAdmin && (
                                <>
                                    <div className="my-2 border-t border-gray-200"></div>
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">⚙️ Administración</div>
                                    <Link
                                        href="/clientes"
                                        className={`block rounded-lg px-4 py-2 font-semibold ${
                                            isActive('/clientes') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        👥 Clientes
                                    </Link>
                                    <Link
                                        href="/catalogo-vehiculos"
                                        className={`block rounded-lg px-4 py-2 font-semibold ${
                                            isActive('/catalogo-vehiculos') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        🚙 Vehículos
                                    </Link>
                                    <Link
                                        href="/companias-seguros"
                                        className={`block rounded-lg px-4 py-2 font-semibold ${
                                            isActive('/companias-seguros') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        🛡️ Seguros
                                    </Link>
                                    <Link href="#" className="block cursor-not-allowed rounded-lg px-4 py-2 text-gray-400">
                                        📦 Artículos
                                    </Link>
                                    <Link href="#" className="block cursor-not-allowed rounded-lg px-4 py-2 text-gray-400">
                                        🏭 Proveedores
                                    </Link>
                                    <Link
                                        href="/medio-de-pago"
                                        className={`block rounded-lg px-4 py-2 font-semibold ${
                                            isActive('/medio-de-pago') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        💳 Medios de pago
                                    </Link>
                                    {/* 🏷️ CONCEPTOS */}
                                    <Link
                                        href="/conceptos"
                                        className={`block rounded-lg px-4 py-2 font-semibold ${
                                            isActive('/conceptos') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        🏷️ Conceptos
                                    </Link>
                                    <Link
                                        href="/admin/metrics"
                                        className={`block rounded-lg px-4 py-2 font-semibold ${
                                            isActive('/admin/metrics') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        📈 Métricas
                                    </Link>
                                    <Link
                                        href="/admin/users"
                                        className={`block rounded-lg px-4 py-2 font-semibold ${
                                            isActive('/admin/users') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        👤 Usuarios
                                    </Link>
                                </>
                            )}

                            <div className="my-2 border-t border-gray-200"></div>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="block w-full rounded-lg px-4 py-2 text-left font-semibold text-red-600 hover:bg-red-50"
                            >
                                🚪 Salir
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* 🔹 CONTENIDO PRINCIPAL */}
            <main className="flex-1">
                <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
                    {title && <h2 className="mb-4 text-2xl font-bold text-gray-800">{title}</h2>}
                    {children}
                </div>
            </main>

            {/* 🔹 FOOTER */}
            <footer className="mt-auto border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">© 2025 Yets Solutions - Todos los derechos reservados</p>
                </div>
            </footer>
        </div>
    );
}