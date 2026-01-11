import React, { useMemo } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

type Estado = { id: number; nombre: string };
type MedioDePago = { id: number; nombre: string };

type Detalle = {
  articulo_id: number;
  descripcion: string;
  valor: number | string;
  cantidad: number | string;
  colocacion_incluida: boolean;
};

type Pago = {
  medio_de_pago_id: number | string;
  monto: number | string;
  observacion: string;
};

type Orden = {
  id: number;
  estado_id: number;
  fecha: string;
  observacion: string | null;
  con_factura: boolean;
  detalles: Array<{
    articulo_id: number;
    descripcion: string | null;
    valor: number | string;
    cantidad: number | string;
    colocacion_incluida: boolean;
  }>;
  pagos: Array<{
    medio_de_pago_id: number;
    valor: number | string;
    observacion: string | null;
    medio_de_pago?: { id: number; nombre: string };
  }>;
};

export default function Edit({
  orden,
  estados,
  mediosDePago,
}: {
  orden: Orden;
  estados: Estado[];
  mediosDePago: MedioDePago[];
}) {
  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get("return") || `/ordenes/${orden.id}`;

  const { data, setData, put, processing, errors } = useForm({
    estado_id: orden.estado_id,
    fecha: orden.fecha ? String(orden.fecha).substring(0, 10) : "",
    observacion: orden.observacion ?? "",
    con_factura: orden.con_factura ? 1 : 0,

    detalles: (orden.detalles || []).map((d) => ({
      articulo_id: d.articulo_id,
      descripcion: d.descripcion ?? "",
      valor: d.valor ?? 0,
      cantidad: d.cantidad ?? 1,
      colocacion_incluida: !!d.colocacion_incluida,
    })) as Detalle[],

    pagos: (orden.pagos || []).map((p) => ({
      medio_de_pago_id: p.medio_de_pago_id,
      monto: p.valor ?? 0,
      observacion: p.observacion ?? "",
    })) as Pago[],
  });

  const totalOrden = useMemo(() => {
    return (data.detalles || []).reduce((acc, d) => {
      const v = Number(d.valor || 0);
      const c = Number(d.cantidad || 0);
      return acc + v * c;
    }, 0);
  }, [data.detalles]);

  const totalPagado = useMemo(() => {
    return (data.pagos || []).reduce((acc, p) => acc + Number(p.monto || 0), 0);
  }, [data.pagos]);

  const saldo = totalOrden - totalPagado;

  function updateDetalle(index: number, patch: Partial<Detalle>) {
    const next = [...data.detalles];
    next[index] = { ...next[index], ...patch };
    setData("detalles", next);
  }

  function addDetalle() {
    setData("detalles", [
      ...data.detalles,
      { articulo_id: 1, descripcion: "", valor: 0, cantidad: 1, colocacion_incluida: false },
    ]);
  }

  function removeDetalle(index: number) {
    const next = data.detalles.filter((_, i) => i !== index);
    setData("detalles", next);
  }

  function updatePago(index: number, patch: Partial<Pago>) {
    const next = [...data.pagos];
    next[index] = { ...next[index], ...patch };
    setData("pagos", next);
  }

  function addPago() {
    setData("pagos", [
      ...data.pagos,
      { medio_de_pago_id: mediosDePago[0]?.id ?? "", monto: 0, observacion: "" },
    ]);
  }

  function removePago(index: number) {
    const next = data.pagos.filter((_, i) => i !== index);
    setData("pagos", next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    put(`/ordenes/${orden.id}`);
  }

  return (
    <DashboardLayout>
      <Head title={`Editar OT #${orden.id}`} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Editar Orden #{orden.id}</h1>
          <Link href={returnUrl} className="text-sm text-gray-600 hover:text-gray-900">
            Volver
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cabecera */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                <select
                  value={data.estado_id}
                  onChange={(e) => setData("estado_id", Number(e.target.value))}
                  className="w-full rounded-lg border-gray-300 text-sm"
                >
                  {estados.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
                {errors.estado_id && <p className="text-red-600 text-sm mt-1">{errors.estado_id}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Factura</label>
                <select
                  value={data.con_factura}
                  onChange={(e) => setData("con_factura", Number(e.target.value))}
                  className="w-full rounded-lg border-gray-300 text-sm"
                >
                  <option value={1}>Con factura</option>
                  <option value={0}>Sin factura</option>
                </select>
                {errors.con_factura && <p className="text-red-600 text-sm mt-1">{errors.con_factura}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
                <input
                  type="date"
                  value={data.fecha}
                  onChange={(e) => setData("fecha", e.target.value)}
                  className="w-full rounded-lg border-gray-300 text-sm"
                />
                {errors.fecha && <p className="text-red-600 text-sm mt-1">{errors.fecha}</p>}
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Observación</label>
                <textarea
                  value={data.observacion}
                  onChange={(e) => setData("observacion", e.target.value)}
                  className="w-full rounded-lg border-gray-300 text-sm"
                  rows={3}
                />
                {errors.observacion && <p className="text-red-600 text-sm mt-1">{errors.observacion}</p>}
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">Detalles</h2>
              <button
                type="button"
                onClick={addDetalle}
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
              >
                + Agregar detalle
              </button>
            </div>

            {errors.detalles && <p className="text-red-600 text-sm mb-2">{String(errors.detalles)}</p>}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase border-b">
                  <tr>
                    <th className="py-2 text-left">Artículo ID</th>
                    <th className="py-2 text-left">Descripción</th>
                    <th className="py-2 text-right">Valor</th>
                    <th className="py-2 text-center">Cant.</th>
                    <th className="py-2 text-center">Coloc.</th>
                    <th className="py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.detalles.map((d, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-2">
                        <input
                          value={d.articulo_id}
                          onChange={(e) => updateDetalle(i, { articulo_id: Number(e.target.value) })}
                          className="w-28 rounded-lg border-gray-300 text-sm"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          value={d.descripcion}
                          onChange={(e) => updateDetalle(i, { descripcion: e.target.value })}
                          className="w-full rounded-lg border-gray-300 text-sm"
                        />
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <input
                          value={d.valor}
                          onChange={(e) => updateDetalle(i, { valor: e.target.value })}
                          className="w-32 rounded-lg border-gray-300 text-sm text-right"
                        />
                      </td>
                      <td className="py-2 pr-2 text-center">
                        <input
                          value={d.cantidad}
                          onChange={(e) => updateDetalle(i, { cantidad: e.target.value })}
                          className="w-20 rounded-lg border-gray-300 text-sm text-center"
                        />
                      </td>
                      <td className="py-2 pr-2 text-center">
                        <input
                          type="checkbox"
                          checked={d.colocacion_incluida}
                          onChange={(e) => updateDetalle(i, { colocacion_incluida: e.target.checked })}
                        />
                      </td>
                      <td className="py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeDetalle(i)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Total OT</div>
                <div className="text-lg font-bold text-gray-900">
                  ${totalOrden.toLocaleString("es-AR")}
                </div>
              </div>
            </div>
          </div>

          {/* Pagos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">Pagos</h2>
              <button
                type="button"
                onClick={addPago}
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
              >
                + Agregar pago
              </button>
            </div>

            {errors.pagos && <p className="text-red-600 text-sm mb-2">{String(errors.pagos)}</p>}

            <div className="space-y-3">
              {data.pagos.map((p, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Medio</label>
                    <select
                      value={p.medio_de_pago_id as any}
                      onChange={(e) => updatePago(i, { medio_de_pago_id: Number(e.target.value) })}
                      className="w-full rounded-lg border-gray-300 text-sm"
                    >
                      {mediosDePago.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Monto</label>
                    <input
                      value={p.monto}
                      onChange={(e) => updatePago(i, { monto: e.target.value })}
                      className="w-full rounded-lg border-gray-300 text-sm"
                    />
                  </div>

                  <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Observación</label>
                    <input
                      value={p.observacion}
                      onChange={(e) => updatePago(i, { observacion: e.target.value })}
                      className="w-full rounded-lg border-gray-300 text-sm"
                    />
                  </div>

                  <div className="md:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removePago(i)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <div className="text-right space-y-1">
                <div className="text-sm text-gray-600">
                  Total pagado: <span className="font-semibold text-gray-900">${totalPagado.toLocaleString("es-AR")}</span>
                </div>
                <div className={`text-sm font-medium ${saldo > 0 ? "text-red-600" : "text-green-600"}`}>
                  Saldo: ${saldo.toLocaleString("es-AR")}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3">
            <Link
              href={returnUrl}
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
