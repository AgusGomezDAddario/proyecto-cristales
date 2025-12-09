import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Movimiento } from '@/types/movimiento';

interface Props {
    movimiento: Movimiento;
    label: string;
    tipo: string;
}

export default function Show({ movimiento, label, tipo }: Props) {
    const tipoPlural = tipo.endsWith('s') ? tipo : `${tipo}s`;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <DashboardLayout>
            <Head title={`Detalle del ${label}`} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Detalle del {label}</h1>
                    <p className="text-gray-600 mt-1">Información completa del movimiento</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6">

                    <div>
                        <p className="text-sm text-gray-600 font-semibold">Fecha</p>
                        <p className="text-lg font-bold text-gray-900">{formatDate(movimiento.fecha)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 font-semibold">Monto</p>
                        <p className="text-lg font-bold text-gray-900">${movimiento.monto}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 font-semibold">Concepto</p>
                        <p className="text-lg font-bold text-gray-900">
                            {movimiento.concepto?.nombre}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 font-semibold">Medio de Pago</p>
                        <p className="text-lg font-bold text-gray-900">
                            {movimiento.medio_de_pago?.nombre ?? "—"}
                        </p>
                    </div>

                    {/* Comprobantes */}
                    <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-800">Comprobantes</p>

                        {(movimiento.comprobantes?.length ?? 0) === 0 ? (
                            <p className="text-gray-500 text-sm mt-2">No hay comprobantes cargados.</p>
                        ) : (
                            <ul className="mt-3 space-y-2">
                                {movimiento.comprobantes!.map((c: any) => (
                                    <li
                                        key={c.id}
                                        className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border"
                                    >
                                        <span className="truncate max-w-[200px]">
                                            {c.ruta_archivo.split('/').pop()}
                                        </span>

                                        <a
                                            href={`/storage/${c.ruta_archivo}`}
                                            target="_blank"
                                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                        >
                                            Ver
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-4 mt-6">
                    <Link
                        href={`/${tipoPlural}/${movimiento.id}/edit`}
                        className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-xl shadow hover:bg-yellow-600"
                    >
                        ✏️ Editar
                    </Link>

                    <Link
                        href={`/${tipoPlural}`}
                        className="px-6 py-3 bg-gray-300 font-bold rounded-xl shadow hover:bg-gray-400"
                    >
                        ← Volver
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
