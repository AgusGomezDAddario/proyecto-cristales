// resources/js/layouts/MainLayout.tsx

import { Link } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

interface Props extends PropsWithChildren {
    title?: string;
}

export default function MainLayout({ children, title }: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Determinar qué sección está activa
    const isActive = (path: string) => {
        return window.location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo y nombre */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="hidden md:block">
                                    <h1 className="text-xl font-bold text-gray-900">Sistema Parabrisas</h1>
                                    <p className="text-xs text-gray-500">Gestión integral</p>
                                </div>
                            </div>

                            {/* Links de navegación - Desktop */}
                            <div className="hidden md:ml-10 md:flex md:space-x-2">
                                <Link
                                    href="/dashboard"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        isActive('/dashboard')
                                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    📊 Panel de Control
                                </Link>
                                <Link
                                    href="/movimientos"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        isActive('/movimientos')
                                            ? 'bg-red-50 text-red-700 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    💸 Carga de Egresos
                                </Link>
                                <Link
                                    href="/ingresos"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        isActive('/ingresos')
                                            ? 'bg-green-50 text-green-700 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    💰 Carga de Ingresos
                                </Link>
                                <Link
                                    href="/ordenes-trabajo"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        isActive('/ordenes-trabajo')
                                            ? 'bg-purple-50 text-purple-700 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    🚗 Órdenes de Trabajo
                                </Link>
                            </div>
                        </div>

                        {/* Botones de usuario */}
                        <div className="flex items-center gap-3">
                            {/* Botón usuario */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">U</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">Usuario</span>
                            </div>

                            {/* Botón mobile menu */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            <Link
                                href="/dashboard"
                                className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                                    isActive('/dashboard')
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                📊 Panel de Control
                            </Link>
                            <Link
                                href="/movimientos"
                                className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                                    isActive('/movimientos')
                                        ? 'bg-red-50 text-red-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                💸 Carga de Egresos
                            </Link>
                            <Link
                                href="/ingresos"
                                className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                                    isActive('/ingresos')
                                        ? 'bg-green-50 text-green-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                💰 Carga de Ingresos
                            </Link>
                            <Link
                                href="/ordenes-trabajo"
                                className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                                    isActive('/ordenes-trabajo')
                                        ? 'bg-purple-50 text-purple-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                🚗 Órdenes de Trabajo
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Contenido principal */}
            <main className="py-6">
                {children}
            </main>

            {/* Footer opcional */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        © 2025 Sistema de Gestión de Parabrisas - Todos los derechos reservados
                    </p>
                </div>
            </footer>
        </div>
    );
}