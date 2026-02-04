import React from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { User, Phone, Mail, Car, Calendar, FileText, DollarSign, CreditCard, ArrowLeft, Printer } from "lucide-react";

type Detalle = {
  descripcion: string;
  valor: number;
  cantidad: number;
  colocacion_incluida: boolean;
};

type Pago = {
  id: number;
  valor: number;
  observacion: string | null;
  medio_de_pago: { nombre: string };
};

type Orden = {
  id: number;
  fecha: string;
  observacion: string | null;
  estado: { nombre: string };
  titular_vehiculo: {
    titular: { nombre: string; apellido: string; telefono: string; email: string | null };
    vehiculo: { patente: string; marca: string; modelo: string; anio: number | null };
  };
  pagos: Pago[];
  detalles: Detalle[];
};

export default function Show({ orden }: { orden: Orden }) {
  const totalOrden = orden.detalles.reduce((acc, curr) => {
    return acc + Number(curr.valor) * Number(curr.cantidad);
  }, 0);

  const totalPagado = orden.pagos.reduce((acc, curr) => acc + Number(curr.valor), 0);
  const saldoPendiente = totalOrden - totalPagado;
  const { auth } = usePage().props as any;
  const esTaller = auth?.role_id === 3; // 👈 ajustá si tu ID es otro
  const esAdmin  = auth?.role_id === 1;
  const backUrl = esTaller ? '/taller/ots' : '/ordenes';



  return (
    <DashboardLayout>
      <Head title={`Orden #${orden.id}`} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href={backUrl}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orden de Trabajo #{orden.id}</h1>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(orden.fecha).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="mx-1">•</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${orden.estado.nombre === 'Entregado' ? 'bg-green-100 text-green-700 border-green-200' :
                  orden.estado.nombre === 'Cancelado' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                  {orden.estado.nombre}
                </span>
              </div>
            </div>
          </div>
          {!esTaller && (
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <Link
              href={`/ordenes/${orden.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
              Editar Orden
            </Link>
          </div>
          )}
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
                        {!esTaller && (
                        <><th className="pb-3 text-right">Unitario</th>
                        <th className="pb-3 text-right pr-2">Subtotal</th>
                        </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orden.detalles.map((detalle, index) => (
                        <tr key={index} className="text-sm text-gray-700">
                          <td className="py-3 pl-2">
                            <div className="font-medium text-gray-900">{detalle.descripcion}</div>
                            {detalle.colocacion_incluida && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 mt-1">
                                Colocación incluida
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-center">{detalle.cantidad}</td>
                          {!esTaller && (<>
                            <td className="py-3 text-right">${Number(detalle.valor).toLocaleString("es-AR")}</td>
                            <td className="py-3 text-right font-medium pr-2">
                              ${(Number(detalle.valor) * Number(detalle.cantidad)).toLocaleString("es-AR")}
                            </td>
                          </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    {!esTaller && (
                    <tfoot>
                      <tr className="border-t border-gray-100">
                        <td colSpan={3} className="pt-4 text-right font-bold text-gray-900">Total:</td>
                        <td className="pt-4 text-right font-bold text-green-600 text-lg pr-2">
                          ${totalOrden.toLocaleString("es-AR")}
                        </td>
                      </tr>
                    </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>

            {/* Pagos */}
            {!esTaller && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <h2 className="font-bold text-gray-900">Pagos Registrados</h2>
              </div>
              <div className="p-6">
                {orden.pagos.length > 0 ? (
                  <div className="space-y-4">
                    {orden.pagos.map((pago) => (
                      <div key={pago.id} className="flex items-start justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex gap-3">
                          <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <CreditCard className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{pago.medio_de_pago.nombre}</p>
                            {pago.observacion && (
                              <p className="text-sm text-gray-500 mt-0.5">{pago.observacion}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">
                          ${Number(pago.valor).toLocaleString("es-AR")}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-end pt-2 border-t border-gray-100">
                      <div className="text-right space-y-1">
                        <div className="text-sm text-gray-600">
                          Total Pagado: <span className="font-semibold text-gray-900">${totalPagado.toLocaleString("es-AR")}</span>
                        </div>
                        {saldoPendiente > 0 && (
                          <div className="text-sm text-red-600 font-medium">
                            Saldo Pendiente: ${saldoPendiente.toLocaleString("es-AR")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay pagos registrados.</p>
                )}
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
                    <p className="font-medium text-gray-900">{orden.titular_vehiculo.vehiculo.marca}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Modelo</p>
                    <p className="font-medium text-gray-900">{orden.titular_vehiculo.vehiculo.modelo}</p>
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
    </DashboardLayout>
  );
}
