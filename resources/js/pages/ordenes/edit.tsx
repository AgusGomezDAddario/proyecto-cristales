import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

type Estado = { id: number; nombre: string };
type CompaniaSeguro = { id: number; nombre: string };

type Orden = {
  id: number;
  estado_id: number;
  fecha: string;
  observacion: string | null;
  con_factura: boolean;
  compania_seguro_id: number | null;
};

export default function Edit({
  orden,
  estados,
  companiasSeguros,
}: {
  orden: Orden;
  estados: Estado[];
  companiasSeguros: CompaniaSeguro[];
}) {
  const { data, setData, put, processing, errors } = useForm({
    estado_id: orden.estado_id,
    fecha: orden.fecha ? String(orden.fecha).substring(0, 10) : "",
    observacion: orden.observacion ?? "",
    con_factura: orden.con_factura ? 1 : 0,
    compania_seguro_id: orden.compania_seguro_id ?? "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    put(`/ordenes/${orden.id}`);
  }

  return (
    <DashboardLayout>
      <Head title={`Editar OT #${orden.id}`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Editar Orden #{orden.id}</h1>
          <Link href={`/ordenes/${orden.id}`} className="text-sm text-gray-600 hover:text-gray-900">
            Volver
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          {/* Estado */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
            <select
              value={data.estado_id}
              onChange={(e) => setData("estado_id", Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
            >
              {estados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
            {errors.estado_id && <p className="text-red-600 text-sm mt-1">{errors.estado_id}</p>}
          </div>

          {/* Factura */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Factura</label>
            <select
              value={data.con_factura}
              onChange={(e) => setData("con_factura", Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
            >
              <option value={1}>Con factura</option>
              <option value={0}>Sin factura</option>
            </select>
            {errors.con_factura && <p className="text-red-600 text-sm mt-1">{errors.con_factura}</p>}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
            <input
              type="date"
              value={data.fecha}
              onChange={(e) => setData("fecha", e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
            />
            {errors.fecha && <p className="text-red-600 text-sm mt-1">{errors.fecha}</p>}
          </div>

          {/* Compañía de seguro */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Compañía de seguro</label>
            <select
              value={data.compania_seguro_id as any}
              onChange={(e) => setData("compania_seguro_id", e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
            >
              <option value="">Sin seguro</option>
              {companiasSeguros.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errors.compania_seguro_id && <p className="text-red-600 text-sm mt-1">{errors.compania_seguro_id}</p>}
          </div>

          {/* Observación */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Observación</label>
            <textarea
              value={data.observacion}
              onChange={(e) => setData("observacion", e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
              rows={4}
            />
            {errors.observacion && <p className="text-red-600 text-sm mt-1">{errors.observacion}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href={`/ordenes/${orden.id}`}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
