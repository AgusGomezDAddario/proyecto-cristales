import React from "react";
import { router, usePage, useForm } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface MedioPagoRow {
  medio_de_pago_id: number;
  medio: string;
  total: number;
  cantidad: number;
  porcentaje: number;
}

interface PageProps extends InertiaPageProps {
  fecha: string;
  today: string;
  kpis: {
    ingresos: number;
    egresos: number;
    neto: number;
  };
  ingresosPorMedio: MedioPagoRow[];
  egresosPorMedio: MedioPagoRow[];
  cashbox: {
    status: "NOT_OPENED" | "OPEN" | "CLOSED";
    opening_balance?: number;
    opened_at?: string;
    closed_at?: string;
  };
}


export default function Index() {
  const {
    fecha,
    today,
    kpis,
    ingresosPorMedio,
    egresosPorMedio,
    cashbox,
  } = usePage<PageProps>().props;

  /* ======================
   * Forms
   * ====================== */

  const openForm = useForm({
    opening_balance: "",
    notes: "",
  });

  const closeForm = useForm({
    notes: "",
  });

  /* ======================
   * Helpers
   * ====================== */

  const isToday = fecha === today;
  const canOpen = isToday && cashbox.status === "NOT_OPENED";
  const canClose = isToday && cashbox.status === "OPEN";

function formatCurrency(value: number | null | undefined) {
  const safe = Number(value ?? 0);
  return safe.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}


  /* ======================
   * Handlers
   * ====================== */

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    router.get("/resumen-del-dia", { date: e.target.value });
  }

  function submitOpen(e: React.FormEvent) {
    e.preventDefault();
    openForm.post("/caja/abrir");
  }

  function submitClose(e: React.FormEvent) {
    e.preventDefault();
    closeForm.post("/caja/cerrar");
  }

  /* ======================
   * Render
   * ====================== */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 Resumen del día</h1>

        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={fecha}
            onChange={handleDateChange}
            className="border p-2"
          />

          <button
            onClick={() =>
              window.open(`/resumen-del-dia/imprimir?date=${fecha}`, "_blank")
            }
            className="border px-4 py-2 rounded"
          >
            Imprimir
          </button>
        </div>
      </div>

      {/* Estado caja */}
      <div className="p-4 border rounded">
        <p>
          <strong>Estado de caja:</strong>{" "}
          {cashbox.status === "NOT_OPENED" && "Sin apertura"}
          {cashbox.status === "OPEN" && "Abierta"}
          {cashbox.status === "CLOSED" && "Cerrada"}
        </p>

        {cashbox.opening_balance !== undefined && (
          <p>
            Saldo inicial:{" "}
            <strong>{formatCurrency(cashbox.opening_balance)}</strong>
          </p>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded">
          <p className="text-sm">Ingresos</p>
          <p className="text-xl font-bold">{formatCurrency(kpis.ingresos)}</p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm">Egresos</p>
          <p className="text-xl font-bold">{formatCurrency(kpis.egresos)}</p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm">Neto</p>
          <p className="text-xl font-bold">{formatCurrency(kpis.neto)}</p>
        </div>
      </div>

      {/* Ingresos por medio de pago */}
      <div>
        <h2 className="font-bold mb-2">Ingresos por medio de pago</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Medio</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">%</th>
            </tr>
          </thead>
          <tbody>
            {ingresosPorMedio.map((row) => (
              <tr key={row.medio_de_pago_id}>
                <td className="border p-2">{row.medio}</td>
                <td className="border p-2 text-center">{row.cantidad}</td>
                <td className="border p-2 text-right">
                  {formatCurrency(row.total)}
                </td>
                <td className="border p-2 text-right">{row.porcentaje}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Egresos por medio de pago */}
      <div>
        <h2 className="font-bold mb-2">Egresos por medio de pago</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Medio</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">%</th>
            </tr>
          </thead>
          <tbody>
            {egresosPorMedio.map((row) => (
              <tr key={row.medio_de_pago_id}>
                <td className="border p-2">{row.medio}</td>
                <td className="border p-2 text-center">{row.cantidad}</td>
                <td className="border p-2 text-right">
                  {formatCurrency(row.total)}
                </td>
                <td className="border p-2 text-right">{row.porcentaje}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Acciones */}
      <div className="flex gap-6">
        {/* Abrir caja */}
        <form onSubmit={submitOpen} className="border p-4 rounded w-1/2">
          <h3 className="font-bold mb-2">Abrir caja</h3>

          <input
            type="number"
            placeholder="Saldo inicial"
            value={openForm.data.opening_balance}
            onChange={(e) =>
              openForm.setData("opening_balance", e.target.value)
            }
            className="border p-2 w-full mb-2"
            disabled={!canOpen}
          />

          <textarea
            placeholder="Observaciones"
            value={openForm.data.notes}
            onChange={(e) => openForm.setData("notes", e.target.value)}
            className="border p-2 w-full mb-2"
            disabled={!canOpen}
          />

          <button
            type="submit"
            disabled={!canOpen || openForm.processing}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Abrir caja
          </button>
        </form>

        {/* Cerrar caja */}
        <form onSubmit={submitClose} className="border p-4 rounded w-1/2">
          <h3 className="font-bold mb-2">Cerrar caja</h3>

          <textarea
            placeholder="Observaciones"
            value={closeForm.data.notes}
            onChange={(e) => closeForm.setData("notes", e.target.value)}
            className="border p-2 w-full mb-2"
            disabled={!canClose}
          />

          <button
            type="submit"
            disabled={!canClose || closeForm.processing}
            className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Cerrar caja
          </button>
        </form>
      </div>
    </div>
  );
}
