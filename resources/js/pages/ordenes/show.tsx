import React, { useState } from "react";
import { Link, Head, router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { User, Phone, Mail, Car, Calendar, FileText, DollarSign, CreditCard, AlertCircle, CheckCircle, ArrowLeft, Printer, Lock, Ban } from "lucide-react";
import PrintableODT from "@/components/print/PrintableODT";
import { formatDateToArgentina, formatDateTimeToArgentina } from '@/utils/dateFormat';
import ConfirmAnularModal from "@/components/ConfirmAnularModal";

type Atributo = {
  id: number;
  categoria: { id: number; nombre: string };
  subcategoria: { id: number; nombre: string };
};

type Detalle = {
  descripcion: string;
  valor: number;
  cantidad: number;
  colocacion_incluida: boolean;
  articulo: { id: number; nombre: string } | null;
  atributos: Atributo[];
};

type Pago = {
  id: number;
  valor: number;
  observacion: string | null;
  fecha: string;
  pagado: boolean;
  bloqueado: boolean;
  medio_de_pago: { nombre: string };
};

type Orden = {
  id: number;
  fecha: string;
  observacion: string | null;
  estado: { nombre: string };
  titular_vehiculo: {
    titular: { nombre: string; apellido: string; telefono: string; email: string | null };
    vehiculo: {
      patente: string;
      marca?: { id: number; nombre: string };
      modelo?: { id: number; nombre: string };
      anio: number | null;
    };
  };
  pagos: Pago[];
  detalles: Detalle[];
  historial_estados?: HistorialEstado[];
};

type HistorialEstado = {
  id: number;
  created_at: string;
  estado: { id: number; nombre: string };
  user?: { id: number; name: string } | null;
};

export default function Show({
  orden,
  totalOrden = 0,
  totalPagado = 0,
  totalRegistrado = 0,
  saldoPendiente = 0
}: {
  orden: Orden;
  totalOrden?: number;
  totalPagado?: number;
  totalRegistrado?: number;
  saldoPendiente?: number;
}) {

  const companiaNombre =
    (orden as any).compania_seguro?.nombre ?? "Sin seguro / Particular";

  const isAnulada = orden.estado.nombre === 'Anulada';
  const isFinalizada = orden.estado.nombre === 'Finalizada';
  const canModify = !isAnulada && !isFinalizada;

  const [showAnularModal, setShowAnularModal] = useState(false);

  function handleAnular() {
    router.delete(`/ordenes/${orden.id}`);
    setShowAnularModal(false);
  }

  return (
    <DashboardLayout>
      <Head title={`Orden #${orden.id}`} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden">
        {/* Banner Anulada */}
        {isAnulada && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
            <Ban className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-800">Orden Anulada</p>
              <p className="text-sm text-red-600">Esta orden fue anulada. Los movimientos de reversa fueron generados automáticamente.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/ordenes"
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orden de Trabajo #{orden.id}</h1>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDateTimeToArgentina(orden.fecha)}</span>
                <span className="mx-1">•</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${orden.estado.nombre === 'Entregado' ? 'bg-green-100 text-green-700 border-green-200' :
                  orden.estado.nombre === 'Cancelado' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                  {orden.estado.nombre}
                </span>
                <div>
                  <span className="text-sm text-gray-500">Compañía de seguros</span>
                  <div className="font-semibold text-gray-900">{companiaNombre}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            {canModify && (
              <Link
                href={`/ordenes/${orden.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition shadow-md hover:shadow-lg"
              >
                Editar Orden
              </Link>
            )}
            {canModify && (
              <button
                onClick={() => setShowAnularModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition shadow-md hover:shadow-lg"
              >
                <Ban className="w-4 h-4" />
                Anular
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal (Izquierda) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Detalles de la Orden */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h2 className="font-bold text-gray-900">Detalles del Trabajo</h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        <th className="pb-3 pl-2">Descripción</th>
                        <th className="pb-3 text-center">Cant.</th>
                        <th className="pb-3 text-right">Unitario</th>
                        <th className="pb-3 text-right pr-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orden.detalles.map((detalle, index) => (
                        <tr key={index} className="text-sm text-gray-700">
                          <td className="py-3 pl-2">
                            <div className="font-medium text-gray-900">
                              {detalle.articulo?.nombre || 'Artículo no especificado'}
                            </div>
                            {detalle.atributos && detalle.atributos.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {detalle.atributos.map((attr) => (
                                  <span
                                    key={attr.id}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                                  >
                                    {attr.categoria?.nombre}: {attr.subcategoria?.nombre}
                                  </span>
                                ))}
                              </div>
                            )}
                            {detalle.descripcion && (
                              <div className="text-sm text-gray-500 mt-1">{detalle.descripcion}</div>
                            )}
                            {detalle.colocacion_incluida ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 mt-1">
                                🔧 Colocación
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 mt-1">
                                🏪 Retiro en local
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-center">{detalle.cantidad}</td>
                          <td className="py-3 text-right">${Number(detalle.valor).toLocaleString("es-AR")}</td>
                          <td className="py-3 text-right font-medium pr-2">
                            ${(Number(detalle.valor) * Number(detalle.cantidad)).toLocaleString("es-AR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-100">
                        <td colSpan={3} className="pt-4 text-right font-bold text-gray-900">Total:</td>
                        <td className="pt-4 text-right font-bold text-green-600 text-lg pr-2">
                          ${totalOrden.toLocaleString("es-AR")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Estado de Pago Visual */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <h2 className="font-bold text-gray-900">Estado de Pago</h2>
                </div>
                {/* Badge de estado */}
                {saldoPendiente === 0 && totalPagado > 0 ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Pagado totalmente</span>
                  </span>
                ) : saldoPendiente > 0 ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Pago parcial</span>
                  </span>
                ) : saldoPendiente < 0 ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Sobrepago</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Sin pagos</span>
                  </span>
                )}
              </div>

              <div className="p-6">
                {/* Resumen visual */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 min-w-0">
                    <p className="text-sm text-slate-600 mb-1">Total de la orden</p>
                    <p className="text-base font-bold text-slate-900 break-all">${totalOrden.toLocaleString("es-AR")}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200 min-w-0">
                    <p className="text-sm text-green-700 mb-1">Total cobrado</p>
                    <p className="text-base font-bold text-green-600 break-all">${totalPagado.toLocaleString("es-AR")}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 min-w-0">
                    <p className="text-sm text-blue-700 mb-1">Registrado sin cobrar</p>
                    <p className="text-base font-bold text-blue-600 break-all">${(totalRegistrado - totalPagado).toLocaleString("es-AR")}</p>
                  </div>
                  <div className={`rounded-xl p-4 border min-w-0 ${saldoPendiente > 0 ? 'bg-red-50 border-red-200' : saldoPendiente < 0 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                    <p className={`text-sm mb-1 ${saldoPendiente > 0 ? 'text-red-700' : saldoPendiente < 0 ? 'text-blue-700' : 'text-green-700'}`}>Saldo pendiente</p>
                    <p className={`text-base font-bold break-all ${saldoPendiente > 0 ? 'text-red-600' : saldoPendiente < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      ${Math.abs(saldoPendiente).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600 font-medium">Progreso de cobro</span>
                    <span className="font-bold text-slate-900">
                      {totalOrden > 0 ? Math.min((totalPagado / totalOrden) * 100, 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${totalPagado >= totalOrden ? 'bg-green-500' : totalPagado > 0 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${totalOrden > 0 ? Math.min((totalPagado / totalOrden) * 100, 100) : 0}%` }}
                    />
                  </div>
                </div>

                {/* Historial de pagos */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Historial de Pagos</h3>
                  {orden.pagos.length > 0 ? (
                    <div className="space-y-3">
                      {orden.pagos.map((pago) => (
                        <div
                          key={pago.id}
                          className={`flex items-start justify-between p-4 rounded-xl border transition ${pago.bloqueado
                            ? 'bg-slate-50/50 border-slate-300'
                            : pago.pagado
                              ? 'bg-green-50/50 border-green-200'
                              : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                            }`}
                        >
                          <div className="flex gap-4 flex-1">
                            {/* Badge de bloqueado */}
                            {pago.bloqueado && (
                              <div className="flex flex-col items-center justify-center px-3 py-2 bg-slate-200 rounded-lg border border-slate-400 shadow-sm min-w-[90px]">
                                <Lock className="w-4 h-4 text-slate-600 mb-1" />
                                <span className="text-xs font-bold text-slate-700">BLOQUEADO</span>
                              </div>
                            )}

                            {/* Estado de cobro */}
                            {!pago.bloqueado && (
                              <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border shadow-sm min-w-[90px] ${pago.pagado ? 'bg-green-100 border-green-300' : 'bg-slate-100 border-slate-300'
                                }`}>
                                {pago.pagado ? (
                                  <>
                                    <CheckCircle className="w-5 h-5 text-green-600 mb-1" />
                                    <span className="text-xs font-bold text-green-700">COBRADO</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-5 h-5 text-slate-500 mb-1" />
                                    <span className="text-xs font-bold text-slate-600">SIN COBRAR</span>
                                  </>
                                )}
                              </div>
                            )}

                            {/* Fecha */}
                            <div className="flex flex-col items-center justify-center px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm min-w-[80px]">
                              <Calendar className="w-4 h-4 text-slate-400 mb-1" />
                              <span className="text-xs font-medium text-slate-600">
                                {formatDateTimeToArgentina(pago.fecha)}
                              </span>
                            </div>

                            {/* Detalles del pago */}
                            <div className="flex gap-3 flex-1">
                              <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{pago.medio_de_pago.nombre}</p>
                                {pago.observacion && (
                                  <p className="text-sm text-gray-500 mt-0.5">{pago.observacion}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Monto */}
                          <span className={`font-bold text-lg ml-4 ${Number(pago.valor) < 0 ? 'text-red-600' : 'text-gray-900'
                            }`}>
                            {Number(pago.valor) < 0 ? '-' : ''}${Math.abs(Number(pago.valor)).toLocaleString("es-AR")}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                      <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No hay pagos registrados</p>
                    </div>
                  )}
                </div>

                {/* Advertencia si hay pagos negativos */}
                {orden.pagos.some(p => Number(p.valor) < 0) && (
                  <div className="mt-4 flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900">Ajustes de pago detectados</p>
                      <p className="text-sm text-purple-700 mt-1">
                        Los montos negativos representan correcciones de errores de cobro anteriores.
                      </p>
                    </div>
                  </div>
                )}

                {/* Advertencia si hay saldo pendiente */}
                {saldoPendiente > 0 && (
                  <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900">Pago incompleto</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Esta orden tiene un saldo pendiente de ${saldoPendiente.toLocaleString("es-AR")}.
                        No podrá ser finalizada hasta completar el cobro total.
                      </p>
                    </div>
                  </div>
                )}

                {/* Info sobre pagos registrados sin cobrar */}
                {(totalRegistrado - totalPagado) > 0 && (
                  <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Pagos registrados pendientes de cobro</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Hay ${(totalRegistrado - totalPagado).toLocaleString("es-AR")} en pagos registrados pero aún no cobrados.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Historial de Estados */}
            {orden.historial_estados && orden.historial_estados.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <h2 className="font-bold text-gray-900">Historial de Estados</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {orden.historial_estados.map((h, index) => (
                      <div key={h.id} className="relative pl-6">

                        {/* Línea vertical */}
                        {index !== orden.historial_estados!.length - 1 && (
                          <div className="absolute left-2 top-4 bottom-0 w-px bg-gray-200"></div>
                        )}

                        {/* Punto */}
                        <div className="absolute left-0 top-1.5 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow"></div>

                        <div className="ml-4">
                          <div className="font-semibold text-gray-900">
                            {h.estado?.nombre}
                          </div>

                          <div className="text-sm text-gray-500">
                            {formatDateTimeToArgentina(h.created_at)}
                          </div>

                          <div className="text-xs text-gray-400 mt-1">
                            {h.user?.name ?? "Sistema"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Observaciones */}
            {orden.observacion && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <h2 className="font-bold text-gray-900">Observaciones Generales</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{orden.observacion}</p>
                </div>
              </div>
            )}

          </div>

          {/* Columna Lateral (Derecha) */}
          <div className="space-y-6">
            {/* Cliente */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <h2 className="font-bold text-gray-900">Cliente</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nombre completo</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {orden.titular_vehiculo.titular.nombre} {orden.titular_vehiculo.titular.apellido}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium text-gray-900">
                      {orden.titular_vehiculo.titular.telefono || "No registrado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {orden.titular_vehiculo.titular.email || "No registrado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehículo */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Car className="w-5 h-5 text-gray-500" />
                <h2 className="font-bold text-gray-900">Vehículo</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Patente</p>
                  <p className="text-2xl font-mono font-bold text-gray-900 tracking-widest">
                    {orden.titular_vehiculo.vehiculo.patente}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Marca</p>
                    <p className="font-medium text-gray-900">
                      {orden.titular_vehiculo.vehiculo.marca?.nombre ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Modelo</p>
                    <p className="font-medium text-gray-900">
                      {orden.titular_vehiculo.vehiculo.modelo?.nombre ?? "-"}
                    </p>
                  </div>
                </div>

                {orden.titular_vehiculo.vehiculo.anio && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Año</p>
                    <p className="font-medium text-gray-900">{orden.titular_vehiculo.vehiculo.anio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de impresión profesional */}
      <PrintableODT orden={orden as any} />

      {/* Modal de confirmación de anulación */}
      <ConfirmAnularModal
        open={showAnularModal}
        onClose={() => setShowAnularModal(false)}
        onConfirm={handleAnular}
        ordenId={orden.id}
      />
    </DashboardLayout>
  );
}