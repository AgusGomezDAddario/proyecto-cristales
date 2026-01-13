import React, { useMemo, useState } from "react";
import DeleteButton from "@/components/botones/boton-eliminar";

interface MedioPago {
  id: number;
  nombre: string;
}

interface Pago {
  medio_de_pago_id: number;
  monto: number;
  observacion?: string | null;
}

interface Props {
  mediosDePago: MedioPago[];
  formData: any;
  // IMPORTANTE: este setter debe recibir PATCH, no el form completo
  setFormData: (patch: any) => void;
  errors: Record<string, string>;
  totalOrden: number;
}

export default function MedioPagoSection({
  mediosDePago,
  formData,
  setFormData,
  errors,
  totalOrden,
}: Props) {
  const [selectedMedio, setSelectedMedio] = useState<string>("");
  const [monto, setMonto] = useState<string>("");
  const [observacion, setObservacion] = useState<string>("");

  const pagos: Pago[] = formData.pagos || [];

  const totalPagado = useMemo(() => {
    return pagos.reduce((acc: number, curr: Pago) => acc + (Number(curr.monto) || 0), 0);
  }, [pagos]);

  const saldoRestante = Math.max(0, totalOrden - totalPagado);
  const exceso = Math.max(0, totalPagado - totalOrden);

  const handleAddPago = () => {
    if (!selectedMedio || !monto) return;

    const medioId = Number(selectedMedio);
    const montoNum = Number(monto);

    if (!Number.isFinite(medioId) || medioId <= 0) return;
    if (!Number.isFinite(montoNum) || montoNum <= 0) return;

    const obs = observacion.trim();
    const nuevosPagos: Pago[] = [
      ...pagos,
      {
        medio_de_pago_id: medioId,
        monto: montoNum,
        observacion: obs.length ? obs : null,
      },
    ];

    // ✅ PATCH ONLY (no spread del formData)
    setFormData({ pagos: nuevosPagos });

    setSelectedMedio("");
    setMonto("");
    setObservacion("");
  };

  const handleRemovePago = (index: number) => {
    const nuevosPagos = pagos.filter((_, i) => i !== index);
    // ✅ PATCH ONLY
    setFormData({ pagos: nuevosPagos });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-800">Medios de Pago</label>

      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={selectedMedio}
            onChange={(e) => setSelectedMedio(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
          >
            <option value="">Seleccione medio...</option>
            {mediosDePago.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
          />

          <input
            type="text"
            placeholder="Observación (opcional)"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
          />
        </div>

        <button
          type="button"
          onClick={handleAddPago}
          disabled={!selectedMedio || !monto}
          className="h-[50px] px-6 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-sm"
        >
          +
        </button>
      </div>

      <div className="space-y-2">
        {pagos.map((pago: Pago, index: number) => {
          const medioNombre = mediosDePago.find((m) => m.id === pago.medio_de_pago_id)?.nombre;

          return (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">
                  {medioNombre || "Medio desconocido"} - ${Number(pago.monto).toLocaleString()}
                </span>
                {!!pago.observacion && <span className="text-sm text-gray-500">{pago.observacion}</span>}
              </div>

              <DeleteButton 
                onClick={() => handleRemovePago(index)} 
              />
            </div>
          );
        })}
      </div>

      {pagos.length > 0 && (
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Orden:</span>
            <span className="font-semibold text-gray-900">${totalOrden.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Pagado:</span>
            <span className="font-bold text-green-600">${totalPagado.toLocaleString()}</span>
          </div>

          {saldoRestante > 0 && (
            <div className="flex justify-between items-center bg-yellow-50 p-2 rounded-lg border border-yellow-200">
              <span className="text-yellow-800 font-medium">Resta Pagar:</span>
              <span className="font-bold text-yellow-700">${saldoRestante.toLocaleString()}</span>
            </div>
          )}

          {exceso > 0 && (
            <div className="flex justify-between items-center bg-blue-50 p-2 rounded-lg border border-blue-200">
              <span className="text-blue-800 font-medium">A favor del cliente:</span>
              <span className="font-bold text-blue-700">${exceso.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {errors.pagos && <p className="text-sm text-red-600 mt-1">{errors.pagos}</p>}
    </div>
  );
}
