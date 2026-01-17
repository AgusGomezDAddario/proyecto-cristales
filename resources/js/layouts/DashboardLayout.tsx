import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface Props extends PropsWithChildren {
    title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const { url } = usePage();
    const { auth } = usePage().props as any;

    const isActive = (path: string) => url.startsWith(path);
    const isAdmin = auth?.user?.role_id === 1;
    const isAdminSection = isActive('/admin/users') || isActive('/catalogo-vehiculos');

    /* TOAST */
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">

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
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo + nombre */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-xl font-bold text-gray-900">
                                    Sistema Parabrisas
                                </h1>
                                <p className="text-xs text-gray-500">Gestión integral</p>
                            </div>
                        </div>

                        {/* Menú de navegación (desktop) */}
                        <div className="hidden md:flex items-center gap-2">
                            <Link
                                href="/admin"
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/admin') && !isActive('/admin/users')
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                📊 Panel de Control
                            </Link>
                            {/* {isAdmin && (
                <Link
                  href="/admin/users"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/admin/users')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  👤 Gestión de Usuarios
                </Link>
              )} */}

                            <Link
                                href="/egresos"
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/egresos')
                                    ? 'bg-red-50 text-red-700 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                💸 Egresos
                            </Link>
                            <Link
                                href="/ingresos"
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/ingresos')
                                    ? 'bg-green-50 text-green-700 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                💰 Ingresos
                            </Link>
                            <Link
                                href="/resumen-del-dia"
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/resumen-del-dia')
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                🧾 Resumen del día
                            </Link>

                            <Link
                                href="/ordenes"
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/ordenes')
                                    ? 'bg-purple-50 text-purple-700 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                🚗 Órdenes de Trabajo
                            </Link>

                            {isAdmin && (
                                <div className="relative">
                                    <button
                                        onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 text-gray-700 bg-transparent hover:bg-gray-100"
                                    >
                                        ⚙️ Administración
                                        <svg className={`w-4 h-4 transition-transform ${adminDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {adminDropdownOpen && (
                                        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                                            >
                                                👥 Clientes
                                            </Link>
                                            <Link
                                                href="/catalogo-vehiculos"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isActive('/catalogo-vehiculos') ? 'text-blue-600 font-medium' : 'text-gray-700'
                                                    }`}
                                            >
                                                🚙 Vehículos
                                            </Link>
                                            <Link
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                                            >
                                                📦 Artículos
                                            </Link>
                                            <Link
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                                            >
                                                🏭 Proveedores
                                            </Link>
                                            <Link
                                                href="/medio-de-pago"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isActive('/medio-de-pago') ? 'text-blue-600 font-medium' : 'text-gray-700'
                                                    }`}
                                            >
                                                💳 Medios de pago
                                            </Link>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <Link
                                                href="/admin/users"
                                                className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isActive('/admin/users') ? 'text-blue-600 font-medium' : 'text-gray-700'
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
                                className="ml-4 px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-white hover:bg-red-50 transition-all"
                            >
                                🚪 Salir
                            </Link>
                        </div>

                        {/* Botón de menú móvil */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {mobileMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 py-2 space-y-1">
                            <Link
                                href="/admin"
                                className={`block px-4 py-2 rounded-lg font-semibold ${isActive('/admin') && !isActive('/admin/users')
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                📊 Panel de Control
                            </Link>

                            {isAdmin && (
                                <>
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">⚙️ Administración</div>
                                    <Link
                                        href="#"
                                        className="block px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed"
                                    >
                                        👥 Clientes
                                    </Link>
                                    <Link
                                        href="/catalogo-vehiculos"
                                        className={`block px-4 py-2 rounded-lg font-semibold ${isActive('/catalogo-vehiculos')
                                            ? 'bg-orange-50 text-orange-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        🚙 Vehículos
                                    </Link>
                                    <Link
                                        href="#"
                                        className="block px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed"
                                    >
                                        📦 Artículos
                                    </Link>
                                    <Link
                                        href="#"
                                        className="block px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed"
                                    >
                                        🏭 Proveedores
                                    </Link>
                                    <Link
                                        href="/admin/users"
                                        className={`block px-4 py-2 rounded-lg font-semibold ${isActive('/admin/users')
                                            ? 'bg-orange-50 text-orange-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        👤 Usuarios
                                    </Link>
                                    <div className="border-t border-gray-200 my-2"></div>
                                </>
                            )}

                            <Link
                                href="/movimientos"
                                className={`block px-4 py-2 rounded-lg font-semibold ${isActive('/movimientos')
                                    ? 'bg-red-50 text-red-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                💸 Egresos
                            </Link>
                            <Link
                                href="/ingresos"
                                className={`block px-4 py-2 rounded-lg font-semibold ${isActive('/ingresos')
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                💰 Ingresos
                            </Link>
                            <Link
                                href="/resumen-del-dia"
                                className={`block px-4 py-2 rounded-lg font-semibold ${isActive('/resumen-del-dia')
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                🧾 Resumen del día
                            </Link>

                            <Link
                                href="/ordenes"
                                className={`block px-4 py-2 rounded-lg font-semibold ${isActive('/ordenes')
                                    ? 'bg-purple-50 text-purple-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                🚗 Órdenes de Trabajo
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-red-600 hover:bg-red-50"
                            >
                                🚪 Salir
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* 🔹 CONTENIDO PRINCIPAL */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                    {title && (
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
                    )}
                    {children}
                </div>
            </main>

            {/* 🔹 FOOTER */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        © 2025 Yets Solutions - Todos los derechos reservados
                    </p>
                </div>
            </footer>
        </div>
    );
}