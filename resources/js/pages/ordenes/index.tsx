import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

type Vehiculo = {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
};

type Titular = {
  id: number;
  nombre: string;
  apellido: string;
};

type TitularVehiculo = {
  id: number;
  titular: Titular | null;
  vehiculo: Vehiculo | null;
};

type Estado = {
  id: number;
  nombre: string;
};

type MedioDePago = {
  id: number;
  nombre: string;
};

type Orden = {
  id: number;
  fecha: string;
  observacion: string | null;
  titular_vehiculo: TitularVehiculo | null;
  estado: Estado;
  medio_de_pago: MedioDePago;
};

export default function Index({ ordenes }: { ordenes: any }) {
  const { delete: destroy } = useForm();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  function handleDelete(id: number) {
    if (confirm("¿Seguro que querés eliminar esta orden?")) {
      destroy(`/ordenes/${id}`);
    }
  }

  // Accedemos a ordenes.data porque viene paginado desde Laravel
  const listaOrdenes = ordenes.data || [];

  return (
    <DashboardLayout>
      <Head title="Órdenes de Trabajo" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Órdenes de Trabajo</h1>
            <p className="text-gray-600 mt-2">
              Listado general de órdenes registradas
            </p>
          </div>
          <Link
            href="/ordenes/create"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-lg hover:shadow-xl"
          >
            + Nueva Orden
          </Link>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {listaOrdenes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-semibold mb-2">
                No hay órdenes registradas
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Comienza creando tu primera orden
              </p>
              <Link
                href="/ordenes/create"
                className="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
              >
                Crear ahora →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titular
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medio de Pago
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {listaOrdenes.map((orden: Orden) => (
                    <tr
                      key={orden.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(orden.fecha)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {orden.titular_vehiculo?.titular
                          ? `${orden.titular_vehiculo.titular.nombre} ${orden.titular_vehiculo.titular.apellido}`
                          : "Sin titular"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {orden.titular_vehiculo?.vehiculo
                          ? `${orden.titular_vehiculo.vehiculo.patente} - ${orden.titular_vehiculo.vehiculo.marca} ${orden.titular_vehiculo.vehiculo.modelo}`
                          : "Sin vehículo"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 rounded text-white text-xs bg-blue-500">
                          {orden.estado?.nombre ?? "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {/* Como ahora son múltiples pagos, mostramos 'Ver detalle' o el primero */}
                        {orden.medio_de_pago?.nombre ?? "Ver detalle"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/ordenes/${orden.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/ordenes/${orden.id}/edit`}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(orden.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
