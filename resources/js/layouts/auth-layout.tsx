import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  title?: string;
  description?: string;
}

export default function AuthLayout({ children, title, description }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Logo + nombre del sistema */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg
            className="w-8 h-8 text-white"
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
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Sistema Parabrisas</h1>
        <p className="text-sm text-gray-500">Gestión Integral</p>
      </div>

      {/* Tarjeta de login */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md p-8">
        {title && (
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm text-gray-500 mb-6 text-center">
            {description}
          </p>
        )}

        {children}
      </div>

      
    </div>
  );
}
