import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Ban,
    Calendar,
    Car,
    CheckCircle,
    CreditCard,
    DollarSign,
    FileText,
    Mail,
    Phone,
    Printer,
    User,
} from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PrintableODT from '@/components/print/PrintableODT';
import ConfirmAnularModal from '@/components/ConfirmAnularModal';
import { formatDateTimeToArgentina } from '@/utils/dateFormat';

type Props = {
    orden: any;
    totalOrden?: number;
    totalPagado?: number;
    totalRegistrado?: number;
    saldoPendiente?: number;
};

const getBadgeClasses = (estado: string) => {
    if (estado === 'Anulada') return 'border-red-200 bg-red-100 text-red-700';
    if (estado === 'Finalizada') return 'border-green-200 bg-green-100 text-green-700';
    return 'border-yellow-200 bg-yellow-100 text-yellow-700';
};

export default function Show({ orden, totalOrden = 0, totalPagado = 0, totalRegistrado = 0, saldoPendiente = 0 }: Props) {
    const { auth, userRoleId } = usePage().props as any;
    const esTaller = userRoleId === 3 || auth?.user?.role_id === 3;
    const backUrl = esTaller ? '/taller/ots' : '/ordenes';
    const companiaNombre = orden?.compania_seguro?.nombre ?? 'Sin seguro / Particular';
    const isAnulada = orden?.estado?.nombre === 'Anulada';
    const isFinalizada = orden?.estado?.nombre === 'Finalizada';
    const canManageOrder = !esTaller && !isAnulada && !isFinalizada;
    const pagosSinCobrar = totalRegistrado - totalPagado;
    const [showAnularModal, setShowAnularModal] = useState(false);

    function handleAnular() {
        router.delete(`/ordenes/${orden.id}`);
        setShowAnularModal(false);
    }

    return (
        <DashboardLayout>
            <Head title={`Orden #${orden.id}`} />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 print:hidden">
                {isAnulada && !esTaller && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
                        <Ban className="h-6 w-6 text-red-500" />
                        <div>
                            <p className="font-bold text-red-800">Orden anulada</p>
                            <p className="text-sm text-red-600">Esta orden fue anulada y el sistema genero los movimientos de reversa correspondientes.</p>
                        </div>
                    </div>
                )}

                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <Link
                            href={backUrl}
                            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Orden de Trabajo #{orden.id}</h1>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDateTimeToArgentina(orden.fecha)}</span>
                                <span className="mx-1">•</span>
                                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getBadgeClasses(orden.estado.nombre)}`}>
                                    {orden.estado.nombre}
                                </span>
                                {!esTaller && (
                                    <div className="ml-3">
                                        <span className="text-sm text-gray-500">Compania de seguros</span>
                                        <div className="font-semibold text-gray-900">{companiaNombre}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            <Printer className="h-4 w-4" />
                            Imprimir
                        </button>
                        {canManageOrder && (
                            <Link
                                href={`/ordenes/${orden.id}/edit`}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white shadow-md transition hover:bg-green-700"
                            >
                                Editar Orden
                            </Link>
                        )}
                        {canManageOrder && (
                            <button
                                onClick={() => setShowAnularModal(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white shadow-md transition hover:bg-red-700"
                            >
                                <Ban className="h-4 w-4" />
                                Anular
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <FileText className="h-5 w-5 text-gray-500" />
                                <h2 className="font-bold text-gray-900">Detalles del trabajo</h2>
                            </div>

                            <div className="overflow-x-auto p-6">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b text-xs font-semibold uppercase text-gray-500">
                                            <th className="pb-3">Descripcion</th>
                                            <th className="pb-3 text-center">Cant.</th>
                                            {!esTaller && <th className="pb-3 text-right">Unitario</th>}
                                            {!esTaller && <th className="pb-3 text-right">Subtotal</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {(orden.detalles || []).map((detalle: any, index: number) => (
                                            <tr key={index} className="text-sm">
                                                <td className="py-3">
                                                    <div className="font-medium text-gray-900">
                                                        {detalle.articulo?.nombre || detalle.descripcion || 'Articulo no especificado'}
                                                    </div>
                                                    {detalle.descripcion && detalle.articulo?.nombre && (
                                                        <p className="mt-1 text-sm text-gray-500">{detalle.descripcion}</p>
                                                    )}
                                                    {Array.isArray(detalle.atributos) && detalle.atributos.length > 0 && (
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {detalle.atributos.map((atributo: any) => (
                                                                <span key={atributo.id} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                                                                    {atributo.categoria?.nombre}: {atributo.subcategoria?.nombre}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <span className={`mt-1 inline-flex rounded px-2 py-0.5 text-xs ${detalle.colocacion_incluida ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                                                        {detalle.colocacion_incluida ? 'Colocacion' : 'Retiro en local'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center">{detalle.cantidad}</td>
                                                {!esTaller && <td className="py-3 text-right">${Number(detalle.valor).toLocaleString('es-AR')}</td>}
                                                {!esTaller && (
                                                    <td className="py-3 text-right font-medium">
                                                        ${(Number(detalle.valor) * Number(detalle.cantidad)).toLocaleString('es-AR')}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                    {!esTaller && (
                                        <tfoot>
                                            <tr className="border-t">
                                                <td colSpan={3} className="pt-4 text-right font-bold">Total:</td>
                                                <td className="pt-4 text-right font-bold text-green-600">${totalOrden.toLocaleString('es-AR')}</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>

                        {!esTaller && (
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-4">
                                    <DollarSign className="h-5 w-5 text-gray-500" />
                                    <h2 className="font-bold text-gray-900">Estado de pago</h2>
                                </div>
                                <div className="space-y-6 p-6">
                                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm text-slate-600">Total</p>
                                            <p className="font-bold text-slate-900">${totalOrden.toLocaleString('es-AR')}</p>
                                        </div>
                                        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                                            <p className="text-sm text-green-700">Cobrado</p>
                                            <p className="font-bold text-green-600">${totalPagado.toLocaleString('es-AR')}</p>
                                        </div>
                                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                            <p className="text-sm text-blue-700">Registrado sin cobrar</p>
                                            <p className="font-bold text-blue-600">${pagosSinCobrar.toLocaleString('es-AR')}</p>
                                        </div>
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                            <p className="text-sm text-red-700">Saldo pendiente</p>
                                            <p className="font-bold text-red-600">${Math.abs(saldoPendiente).toLocaleString('es-AR')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {(orden.pagos || []).length > 0 ? (
                                            orden.pagos.map((pago: any) => (
                                                <div key={pago.id} className="flex items-start justify-between rounded-xl border bg-gray-50 p-4">
                                                    <div className="flex gap-3">
                                                        <CreditCard className="mt-0.5 h-5 w-5 text-blue-600" />
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{pago.medio_de_pago?.nombre}</p>
                                                            <p className="text-sm text-gray-500">{formatDateTimeToArgentina(pago.fecha)}</p>
                                                            {pago.observacion && <p className="text-sm text-gray-500">{pago.observacion}</p>}
                                                            <div className="mt-1 flex gap-2">
                                                                {pago.pagado ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                                                        <CheckCircle className="h-3 w-3" />
                                                                        Cobrado
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                                                                        <AlertCircle className="h-3 w-3" />
                                                                        Pendiente
                                                                    </span>
                                                                )}
                                                                {pago.bloqueado && (
                                                                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">Bloqueado</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`font-bold ${Number(pago.valor) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {Number(pago.valor) < 0 ? '-' : ''}${Math.abs(Number(pago.valor)).toLocaleString('es-AR')}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
                                                No hay pagos registrados
                                            </div>
                                        )}
                                    </div>

                                    {saldoPendiente > 0 && (
                                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                                            <p className="text-sm text-amber-700">La orden todavia tiene un saldo pendiente de ${saldoPendiente.toLocaleString('es-AR')}.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {Array.isArray(orden.historial_estados) && orden.historial_estados.length > 0 && (
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-4">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <h2 className="font-bold text-gray-900">Historial de estados</h2>
                                </div>
                                <div className="space-y-4 p-6">
                                    {orden.historial_estados.map((item: any) => (
                                        <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                            <p className="font-semibold text-gray-900">{item.estado?.nombre}</p>
                                            <p className="text-sm text-gray-500">{formatDateTimeToArgentina(item.created_at)}</p>
                                            <p className="text-xs text-gray-400">{item.user?.name ?? 'Sistema'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {orden.observacion && (
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-4">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                    <h2 className="font-bold text-gray-900">Observaciones</h2>
                                </div>
                                <div className="p-6 text-gray-700 whitespace-pre-wrap">{orden.observacion}</div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <User className="h-5 w-5 text-gray-500" />
                                <h2 className="font-bold text-gray-900">Cliente</h2>
                            </div>
                            <div className="space-y-4 p-6">
                                <div>
                                    <p className="text-sm text-gray-500">Nombre completo</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {orden.titular_vehiculo?.titular?.nombre} {orden.titular_vehiculo?.titular?.apellido}
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Telefono</p>
                                        <p className="font-medium text-gray-900">{orden.titular_vehiculo?.titular?.telefono || 'No registrado'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">{orden.titular_vehiculo?.titular?.email || 'No registrado'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <Car className="h-5 w-5 text-gray-500" />
                                <h2 className="font-bold text-gray-900">Vehiculo</h2>
                            </div>
                            <div className="space-y-4 p-6">
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                                    <p className="text-xs uppercase text-gray-500">Patente</p>
                                    <p className="text-2xl font-bold tracking-widest text-gray-900">{orden.titular_vehiculo?.vehiculo?.patente}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Marca</p>
                                        <p className="font-medium text-gray-900">
                                            {typeof orden.titular_vehiculo?.vehiculo?.marca === 'string'
                                                ? orden.titular_vehiculo.vehiculo.marca
                                                : orden.titular_vehiculo?.vehiculo?.marca?.nombre ?? '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Modelo</p>
                                        <p className="font-medium text-gray-900">
                                            {typeof orden.titular_vehiculo?.vehiculo?.modelo === 'string'
                                                ? orden.titular_vehiculo.vehiculo.modelo
                                                : orden.titular_vehiculo?.vehiculo?.modelo?.nombre ?? '-'}
                                        </p>
                                    </div>
                                </div>
                                {orden.titular_vehiculo?.vehiculo?.anio && (
                                    <div>
                                        <p className="text-sm text-gray-500">Anio</p>
                                        <p className="font-medium text-gray-900">{orden.titular_vehiculo.vehiculo.anio}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PrintableODT orden={orden} />

            {!esTaller && (
                <ConfirmAnularModal
                    open={showAnularModal}
                    onClose={() => setShowAnularModal(false)}
                    onConfirm={handleAnular}
                    ordenId={orden.id}
                />
            )}
        </DashboardLayout>
    );
}
