import { Link, usePage, Head } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

interface Props extends PropsWithChildren {
  title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { url } = usePage();
  const { auth } = usePage().props as any;

  const isActive = (path: string) => url.startsWith(path);
  const isAdmin = auth?.user?.role_id === 1;
  const isTaller = auth?.user?.role_id === 3;


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
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
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin') && !isActive('/admin/users')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📊 Panel de Control
              </Link>
              )}
              
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive('/admin/users')
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👤 Gestión de Usuarios
                </Link>
              )}
              {!isTaller && (
              <>
                <Link
                  href="/egresos"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive('/egresos')
                      ? 'bg-red-50 text-red-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  💸 Egresos
                </Link>

                <Link
                  href="/ingresos"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive('/ingresos')
                      ? 'bg-green-50 text-green-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  💰 Ingresos
                </Link>
              </>
              )}
              <Link
                href={isTaller ? '/taller/ots' : '/ordenes'}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/ordenes')
                    ? 'bg-purple-50 text-purple-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🚗 Órdenes de Trabajo
              </Link>

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
                className={`block px-4 py-2 rounded-lg font-semibold ${
                  isActive('/admin') && !isActive('/admin/users')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📊 Panel de Control
              </Link>
              
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className={`block px-4 py-2 rounded-lg font-semibold ${
                    isActive('/admin/users')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👤 Gestión de Usuarios
                </Link>
              )}

              <Link
                href="/movimientos"
                className={`block px-4 py-2 rounded-lg font-semibold ${
                  isActive('/movimientos')
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                💸 Egresos
              </Link>
              <Link
                href="/ingresos"
                className={`block px-4 py-2 rounded-lg font-semibold ${
                  isActive('/ingresos')
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                💰 Ingresos
              </Link>
              <Link
                href="/ordenes"
                className={`block px-4 py-2 rounded-lg font-semibold ${
                  isActive('/ordenes')
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