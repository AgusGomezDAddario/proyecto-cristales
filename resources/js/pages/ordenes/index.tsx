import React, { useMemo, useState } from "react";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Search, Plus, Pencil, X, AlertTriangle } from "lucide-react";
import DeleteButton from "@/components/botones/boton-eliminar";
import Edit from "./edit";
import EditButton from "@/components/botones/boton-editar";

type Vehiculo = {
  id: number;
  patente: string;
  marca?: { nombre: string }; // Ahora es objeto opcional
  modelo?: { nombre: string }; // Ahora es objeto opcional
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

type Filters = {
  q?: string;
  estado_id?: string | number;
  con_factura?: string | number; // "1" | "0"
  date_from?: string;
  date_to?: string;
  per_page?: number | string;
};

export default function Index({ ordenes }: { ordenes: any }) {
  const { delete: destroy } = useForm();

  /**
   * Requisitos para que esto funcione:
   * - El backend debe devolver:
   *   - filters: { q, estado_id, medio_pago_id, date_from, date_to, per_page }
   *   - estados: [{id, nombre}] (opcional pero recomendado)
   *   - mediosPago: [{id, nombre}] (opcional pero recomendado)
   */
  const page = usePage();
  const props = page.props as any;

  const backendFilters: Filters = props.filters || {};
  const estados: Estado[] = props.estados || [];
  // const mediosPago: MedioDePago[] = props.mediosPago || [];

  const [filters, setFilters] = useState<Required<Filters>>({
    q: backendFilters.q ?? "",
    estado_id: (backendFilters.estado_id ?? "") as any,
    con_factura: (backendFilters.con_factura ?? "") as any,
    date_from: backendFilters.date_from ?? "",
    date_to: backendFilters.date_to ?? "",
    per_page: (backendFilters.per_page ?? 10) as any,
  });

  const listaOrdenes: Orden[] = ordenes?.data || [];
  const links = ordenes?.links || [];

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

  const todayISO = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const yesterdayISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const last7FromISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6); // incluye hoy => 7 días
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  function applyFilters(next?: Partial<Filters>) {
    const payload = {
      ...filters,
      ...next,
    };

    // Limpieza: no mandar vacíos
    const cleaned: any = {};
    Object.entries(payload).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      if (typeof v === "string" && v.trim() === "") return;
      cleaned[k] = v;
    });

    router.get("/ordenes", cleaned, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }

  function resetFilters() {
    setFilters({
      q: "",
      estado_id: "",
      // medio_pago_id: "",
      con_factura: "",
      date_from: "",
      date_to: "",
      per_page: 10,
    });

    router.get(
      "/ordenes",
      {},
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  }

const returnUrl = `${window.location.pathname}${window.location.search}`;

  return (
    <DashboardLayout>
      <Head title="Órdenes de Trabajo" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Órdenes de Trabajo</h1>
            <p className="text-gray-600 mt-2">Listado general de órdenes registradas</p>
          </div>
          <Link
            href="/ordenes/create"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-lg hover:shadow-xl"
          >
            + Nueva Orden
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Búsqueda */}
            <div className="md:col-span-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Buscar (Patente / Titular)
              </label>
              <input
                value={filters.q}
                onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters();
                }}
                placeholder="Ej: EYZ529 o Gomez"
                className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
              />
            </div>

            {/* Estado */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
              <select
                value={filters.estado_id as any}
                onChange={(e) => setFilters((p) => ({ ...p, estado_id: e.target.value }))}
                className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
              >
                <option value="">Todos</option>
                {estados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Medio de pago */}
            {/* <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Medio de pago</label>
              <select
                value={filters.medio_pago_id as any}
                onChange={(e) => setFilters((p) => ({ ...p, medio_pago_id: e.target.value }))}
                className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
              >
                <option value="">Todos</option>
                {mediosPago.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Factura */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Factura</label>
              <select
                value={filters.con_factura as any}
                onChange={(e) => setFilters((p) => ({ ...p, con_factura: e.target.value }))}
                className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
              >
                <option value="">Todas</option>
                <option value="1">Con factura</option>
                <option value="0">Sin factura</option>
              </select>
            </div>

            {/* Fecha desde */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters((p) => ({ ...p, date_from: e.target.value }))}
                className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
              />
            </div>

            {/* Fecha hasta */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters((p) => ({ ...p, date_to: e.target.value }))}
                className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
              />
            </div>

            {/* Acciones */}
            <div className="md:col-span-12 flex flex-col md:flex-row md:items-end gap-3 mt-2">
              {/* Presets rápidos */}
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => applyFilters({ date_from: todayISO, date_to: todayISO })}
                  className="px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => applyFilters({ date_from: yesterdayISO, date_to: yesterdayISO })}
                  className="px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
                >
                  Ayer
                </button>
                <button
                  type="button"
                  onClick={() => applyFilters({ date_from: last7FromISO, date_to: todayISO })}
                  className="px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
                >
                  Últimos 7 días
                </button>
              </div>

              <div className="flex-1" />

              {/* Per page */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Filas</span>
                <select
                  value={filters.per_page as any}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, per_page: Number(e.target.value) }))
                  }
                  className="rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => applyFilters()}
                className="bg-gray-900 hover:bg-black text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Aplicar
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 px-4 rounded-lg border border-gray-200 transition"
              >
                Limpiar
              </button>
            </div>
          </div>
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
              <p className="text-gray-500 text-lg font-semibold mb-2">No hay órdenes registradas</p>
              <p className="text-gray-400 text-sm mb-4">Probá ajustando los filtros o crea una orden</p>
              <Link
                href="/ordenes/create"
                className="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
              >
                Crear ahora →
              </Link>
            </div>
          ) : (
            <>
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
                            ? `${orden.titular_vehiculo.vehiculo.patente} - ${orden.titular_vehiculo.vehiculo.marca?.nombre || ''} ${orden.titular_vehiculo.vehiculo.modelo?.nombre || ''}`
                            : "Sin vehículo"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 rounded text-white text-xs bg-blue-500">
                            {orden.estado?.nombre ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {"Ver detalle"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/ordenes/${orden.id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Ver
                            </Link>
                            <EditButton
                              onClick={() => router.visit(`/ordenes/${orden.id}/edit?return=${encodeURIComponent(returnUrl)}`)}
                            />
                            <DeleteButton
                              onClick={() => handleDelete(orden.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {links.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-white">
                  <div className="text-sm text-gray-600">
                    Mostrando{" "}
                    <span className="font-medium text-gray-900">
                      {ordenes.from ?? 0}
                    </span>{" "}
                    a{" "}
                    <span className="font-medium text-gray-900">
                      {ordenes.to ?? 0}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium text-gray-900">
                      {ordenes.total ?? 0}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {links.map((l: any, idx: number) => {
                      const label = String(l.label)
                        .replace("&laquo;", "«")
                        .replace("&raquo;", "»");

                      if (!l.url) {
                        return (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-400 cursor-not-allowed"
                          >
                            {label}
                          </span>
                        );
                      }

                      return (
                        <Link
                          key={idx}
                          href={l.url}
                          preserveScroll
                          className={`px-3 py-1.5 rounded-lg text-sm border transition ${l.active
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
