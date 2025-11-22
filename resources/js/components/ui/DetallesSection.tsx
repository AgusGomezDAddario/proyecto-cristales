import React from "react";
import { Plus, Trash2, DollarSign, Layers } from "lucide-react";

interface Detalle {
  descripcion: string;
  // ahora puede venir como string vacío o número
  valor: number | string;
  cantidad: number;
  colocacion_incluida: boolean;
}

interface Props {
  detalles: Detalle[];
  setDetalles: (detalles: Detalle[]) => void;
}

export default function DetallesSection({ detalles, setDetalles }: Props) {
  const handleChange = (index: number, field: keyof Detalle, value: any) => {
    const nuevos = [...detalles];
    (nuevos[index] as any)[field] = value;
    setDetalles(nuevos);
  };

  const handleAdd = () => {
    setDetalles([
      ...detalles,
      { descripcion: "", valor: "", cantidad: 1, colocacion_incluida: false },
    ]);
  };

  const handleRemove = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  // convierte string vacío a 0 para el total
  const total = detalles.reduce((sum, d) => {
    const v = d.valor === "" ? 0 : Number(d.valor);
    return sum + (isNaN(v) ? 0 : v) * (Number(d.cantidad) || 0);
  }, 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
            <Layers className="text-white w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Detalles de la Orden</h2>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Agregar ítem
        </button>
      </div>

      {/* Lista de ítems */}
      <div className="space-y-6">
        {detalles.map((detalle, index) => (
          <div key={index} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Descripción (6/12) */}
              <div className="md:col-span-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Descripción *
                </label>
                <input
                  type="text"
                  value={detalle.descripcion}
                  onChange={(e) => handleChange(index, "descripcion", e.target.value)}
                  placeholder="Ej: Parabrisas delantero"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
                />
              </div>

              {/* Valor (3/12) – ahora con placeholder y sin '0' inicial */}
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Valor *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    // si valor === "" mostramos vacío
                    value={detalle.valor === "" ? "" : detalle.valor}
                    onChange={(e) =>
                      handleChange(index, "valor", e.target.value === "" ? "" : e.target.value)
                    }
                    placeholder="0"
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
                  />
                </div>
              </div>

              {/* Cantidad + Coloc. + Eliminar (3/12) */}
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Cantidad *
                </label>

                {/* ⬇️ Todo a la IZQUIERDA y dentro del recuadro */}
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="number"
                    min={1}
                    value={detalle.cantidad}
                    onChange={(e) =>
                      handleChange(index, "cantidad", Math.max(1, Number(e.target.value)))
                    }
                    className="w-[96px] px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
                  />

                  <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 whitespace-nowrap select-none bg-white">
                  <input
                    type="checkbox"
                    checked={detalle.colocacion_incluida}
                    onChange={(e) => handleChange(index, "colocacion_incluida", e.target.checked)}
                    className="w-5 h-5 rounded bg-white border border-gray-400
                              accent-[#2596be] focus:ring-2 focus:ring-[#1862fd] cursor-pointer"
                  />
                  Coloc.
                </label>

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-lg bg-[#2596be] text-white hover:bg-[#1862fd] transition"
                  aria-label="Eliminar ítem"
                  title="Eliminar ítem"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                </div>
              </div>
            </div>

            {index < detalles.length - 1 && <div className="border-t border-gray-200 pt-3" />}
          </div>
        ))}

        {detalles.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center text-gray-600">
            Aún no agregaste ítems. Usá el botón <strong>“Agregar ítem”</strong>.
          </div>
        )}
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-200 flex items-center justify-end">
        <p className="text-lg font-medium text-gray-800">
          Total estimado:&nbsp;
          <span className="text-2xl font-extrabold text-green-600">
            ${total.toLocaleString("es-AR")}
          </span>
        </p>
      </div>
    </div>
  );
}
43342