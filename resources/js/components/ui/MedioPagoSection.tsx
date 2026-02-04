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
  companiaSeguroId?: number | null;
}

// Nombre del medio de pago especial para seguros
const VOUCHER_SEGURO_NOMBRE = "Voucher de Compañía de Seguros";

export default function MedioPagoSection({
  mediosDePago,
  formData,
  setFormData,
  errors,
  totalOrden,
  companiaSeguroId,
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

  // Filtrar medios de pago: el voucher de seguros solo se muestra si hay compañía seleccionada
  const mediosFiltrados = useMemo(() => {
    return mediosDePago.filter((m) => {
      // Si es el voucher de seguros, solo mostrarlo si hay compañía de seguros seleccionada
      if (m.nombre === VOUCHER_SEGURO_NOMBRE) {
        return !!companiaSeguroId;
      }
      return true;
    });
  }, [mediosDePago, companiaSeguroId]);

  // Handler para cambio de medio de pago (sin autocompletado)
  const handleMedioChange = (value: string) => {
    setSelectedMedio(value);
  };

  // Cargar saldo restante en el campo de monto
  const handleCargarTodo = () => {
    if (saldoRestante > 0) {
      setMonto(saldoRestante.toString());
    }
  };

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
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-800">Medios de Pago</label>
        {pagos.length > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {pagos.length} pago{pagos.length > 1 ? 's' : ''} agregado{pagos.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Formulario para agregar nuevo pago (ARRIBA) */}
      <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <p className="text-xs font-medium text-gray-600 mb-3">
          {pagos.length === 0 ? '➕ Agregá un medio de pago:' : '➕ Agregar otro medio de pago:'}
        </p>
        <div className="flex items-center gap-2">
          <select
            value={selectedMedio}
            onChange={(e) => handleMedioChange(e.target.value)}
            className="w-40 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900 text-sm"
          >
            <option value="">Medio...</option>
            {mediosFiltrados.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="$0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-24 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900 text-sm"
            />
            {saldoRestante > 0 && (
              <button
                type="button"
                onClick={handleCargarTodo}
                className="px-2 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs font-medium whitespace-nowrap"
              >
                Cargar total
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Obs."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900 text-sm"
          />

          <button
            type="button"
            onClick={handleAddPago}
            disabled={!selectedMedio || !monto}
            className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-sm text-sm"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Lista de pagos agregados (ABAJO) */}
      {pagos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">Pagos agregados:</p>
          {pagos.map((pago: Pago, index: number) => {
            const medioNombre = mediosDePago.find((m) => m.id === pago.medio_de_pago_id)?.nombre;

            return (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
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
      )}
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
