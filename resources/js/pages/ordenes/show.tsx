import React from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  User,
  Phone,
  Mail,
  Car,
  Calendar,
  FileText,
  DollarSign,
  CreditCard,
  ArrowLeft,
  Printer,
} from "lucide-react";

/* =======================
   TIPOS
======================= */

type Atributo = {
  id: number;
  categoria: { id: number; nombre: string };
  subcategoria: { id: number; nombre: string };
};

type Detalle = {
  descripcion?: string;
  valor: number;
  cantidad: number;
  colocacion_incluida: boolean;
  articulo?: { id: number; nombre: string } | null;
  atributos?: Atributo[];
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
  compania_seguro?: { nombre: string } | null;
  titular_vehiculo: {
    titular: {
      nombre: string;
      apellido: string;
      telefono: string;
      email: string | null;
    };
    vehiculo: {
      patente: string;
      marca?: { nombre: string } | string;
      modelo?: { nombre: string } | string;
      anio: number | null;
    };
  };
  pagos: Pago[];
  detalles: Detalle[];
};

/* =======================
   COMPONENTE
======================= */

export default function Show({ orden }: { orden: Orden }) {
  const { auth } = usePage().props as any;

  const esTaller = auth?.role_id === 3;
  const backUrl = esTaller ? "/taller/ots" : "/ordenes";

  const totalOrden = orden.detalles.reduce(
    (acc, d) => acc + Number(d.valor) * Number(d.cantidad),
    0
  );

  const totalPagado = orden.pagos.reduce(
    (acc, p) => acc + Number(p.valor),
    0
  );

  const saldoPendiente = totalOrden - totalPagado;

  const companiaNombre =
    orden.compania_seguro?.nombre ?? "Sin seguro / Particular";

  return (
    <DashboardLayout>
      <Head title={`Orden #${orden.id}`} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href={backUrl}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Orden de Trabajo #{orden.id}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(orden.fecha).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <span className="mx-1">•</span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                  {orden.estado.nombre}
                </span>

                {!esTaller && (
                  <div className="ml-3">
                    <span className="text-sm text-gray-500">
                      Compañía de seguros
                    </span>
                    <div className="font-semibold text-gray-900">
                      {companiaNombre}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!esTaller && (
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>

              <Link
                href={`/ordenes/${orden.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md"
              >
                Editar Orden
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-2 space-y-8">
            {/* DETALLES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h2 className="font-bold text-gray-900">
                  Detalles del Trabajo
                </h2>
              </div>

              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-semibold text-gray-500 uppercase border-b">
                      <th className="pb-3">Descripción</th>
                      <th className="pb-3 text-center">Cant.</th>
                      {!esTaller && (
                        <>
                          <th className="pb-3 text-right">Unitario</th>
                          <th className="pb-3 text-right">Subtotal</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {orden.detalles.map((d, i) => (
                      <tr key={i} className="text-sm">
                        <td className="py-3">
                          <div className="font-medium text-gray-900">
                            {d.articulo?.nombre || d.descripcion}
                          </div>

                          {d.atributos && d.atributos.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {d.atributos.map((a) => (
                                <span
                                  key={a.id}
                                  className="px-2 py-0.5 text-xs rounded bg-gray-100"
                                >
                                  {a.categoria.nombre}:{" "}
                                  {a.subcategoria.nombre}
                                </span>
                              ))}
                            </div>
                          )}

                          <span
                            className={`inline-flex mt-1 px-2 py-0.5 rounded text-xs ${
                              d.colocacion_incluida
                                ? "bg-blue-50 text-blue-700"
                                : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            {d.colocacion_incluida
                              ? "🔧 Colocación"
                              : "🏪 Retiro en local"}
                          </span>
                        </td>

                        <td className="py-3 text-center">{d.cantidad}</td>

                        {!esTaller && (
                          <>
                            <td className="py-3 text-right">
                              ${Number(d.valor).toLocaleString("es-AR")}
                            </td>
                            <td className="py-3 text-right font-medium">
                              $
                              {(
                                Number(d.valor) * Number(d.cantidad)
                              ).toLocaleString("es-AR")}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>

                  {!esTaller && (
                    <tfoot>
                      <tr className="border-t">
                        <td colSpan={3} className="pt-4 text-right font-bold">
                          Total:
                        </td>
                        <td className="pt-4 text-right font-bold text-green-600">
                          ${totalOrden.toLocaleString("es-AR")}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* PAGOS (SOLO ADMIN) */}
            {!esTaller && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <h2 className="font-bold text-gray-900">
                    Pagos Registrados
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {orden.pagos.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between p-4 bg-gray-50 rounded-xl border"
                    >
                      <div className="flex gap-3">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold">
                            {p.medio_de_pago.nombre}
                          </p>
                          {p.observacion && (
                            <p className="text-sm text-gray-500">
                              {p.observacion}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="font-bold">
                        ${Number(p.valor).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}

                  <div className="text-right pt-2 border-t">
                    <div className="text-sm">
                      Total Pagado:{" "}
                      <strong>
                        ${totalPagado.toLocaleString("es-AR")}
                      </strong>
                    </div>

                    {saldoPendiente > 0 && (
                      <div className="text-sm text-red-600">
                        Saldo Pendiente: $
                        {saldoPendiente.toLocaleString("es-AR")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-6">
            {/* CLIENTE */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <h2 className="font-bold">Cliente</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre completo</p>
                  <p className="font-semibold text-lg">
                    {orden.titular_vehiculo.titular.nombre}{" "}
                    {orden.titular_vehiculo.titular.apellido}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>
                    {orden.titular_vehiculo.titular.telefono || "No registrado"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>
                    {orden.titular_vehiculo.titular.email || "No registrado"}
                  </span>
                </div>
              </div>
            </div>

            {/* VEHÍCULO */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                <Car className="w-5 h-5 text-gray-500" />
                <h2 className="font-bold">Vehículo</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded text-center">
                  <p className="text-xs uppercase text-gray-500">Patente</p>
                  <p className="text-2xl font-mono font-bold">
                    {orden.titular_vehiculo.vehiculo.patente}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Marca</p>
                    <p>
                      {typeof orden.titular_vehiculo.vehiculo.marca === "string"
                        ? orden.titular_vehiculo.vehiculo.marca
                        : orden.titular_vehiculo.vehiculo.marca?.nombre ?? "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Modelo</p>
                    <p>
                      {typeof orden.titular_vehiculo.vehiculo.modelo === "string"
                        ? orden.titular_vehiculo.vehiculo.modelo
                        : orden.titular_vehiculo.vehiculo.modelo?.nombre ?? "-"}
                    </p>
                  </div>
                </div>

                {orden.titular_vehiculo.vehiculo.anio && (
                  <div>
                    <p className="text-sm text-gray-500">Año</p>
                    <p>{orden.titular_vehiculo.vehiculo.anio}</p>
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
