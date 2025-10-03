// resources/js/pages/ingresos/index.tsx

import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';

export default function Ingresos() {
    return (
        <MainLayout>
            <Head title="Carga de Ingresos" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Carga de Ingresos</h1>
                    <p className="text-gray-600 mt-2">Gestión de ingresos y cobros</p>
                </div>

                {/* Placeholder Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Sección en Desarrollo</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Esta sección estará disponible próximamente. Aquí podrás gestionar todos los ingresos de la empresa.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-lg mx-auto">
                            <h3 className="font-semibold text-green-900 mb-2">Funcionalidades planeadas:</h3>
                            <ul className="text-sm text-green-800 space-y-1">
                                <li>✅ Registro de ingresos por orden de trabajo</li>
                                <li>✅ Resumen de cobros del día</li>
                                <li>✅ Historial de ingresos</li>
                                <li>✅ Reportes y estadísticas</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}