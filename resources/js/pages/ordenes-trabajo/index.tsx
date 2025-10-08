// resources/js/pages/ordenes-trabajo/index.tsx

import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';

export default function OrdenesTrabajo() {
    return (
        <MainLayout>
            <Head title="Órdenes de Trabajo" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Órdenes de Trabajo</h1>
                    <p className="text-gray-600 mt-2">Gestión de trabajos de colocación de parabrisas</p>
                </div>

                {/* Placeholder Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Sección en Desarrollo</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Esta sección estará disponible próximamente. Aquí podrás gestionar las órdenes de trabajo de los vehículos.
                        </p>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-lg mx-auto">
                            <h3 className="font-semibold text-purple-900 mb-2">Funcionalidades planeadas:</h3>
                            <ul className="text-sm text-purple-800 space-y-1">
                                <li>✅ Registro de entrada de vehículos</li>
                                <li>✅ Datos del trabajo (patente, precio, detalles)</li>
                                <li>✅ Control de estado de órdenes</li>
                                <li>✅ Historial de trabajos realizados</li>
                                <li>✅ Generación de comprobantes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}