import React from "react";
import { Plus, Trash2, DollarSign, Layers } from "lucide-react";

interface Detalle {
  descripcion: string;
  valor: number;
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
      { descripcion: "", valor: 0, cantidad: 1, colocacion_incluida: false },
    ]);
  };

  const handleRemove = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const total = detalles.reduce((sum, d) => sum + d.valor * d.cantidad, 0);

  return (
    <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold text-foreground">
          <Layers className="mr-2 h-7 w-7 text-primary" />
          Detalles de la orden
        </h2>
        <button
          type="button"
          onClick={handleAdd}
          aria-label="Agregar ítem"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-white text-base hover:bg-primary/90 transition"
        >
          <Plus className="h-5 w-5" /> Agregar ítem
        </button>
      </div>

      {/* Lista de ítems */}
      <div className="space-y-5">
        {detalles.map((detalle, index) => (
          <div
            key={index}
            className="p-5 rounded-xl border bg-muted/50 hover:bg-muted/80 transition flex flex-col sm:flex-row sm:items-end gap-4"
          >
            {/* Descripción */}
            <div className="flex-1">
              <label className="block text-lg font-medium text-foreground mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={detalle.descripcion}
                onChange={(e) =>
                  handleChange(index, "descripcion", e.target.value)
                }
                placeholder="Ej: Parabrisas delantero"
                className="w-full h-12 rounded-lg border px-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Valor */}
            <div className="w-40">
              <label className="block text-lg font-medium text-foreground mb-1">
                Valor
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={detalle.valor}
                  onChange={(e) =>
                    handleChange(index, "valor", Number(e.target.value))
                  }
                  className="w-full h-12 rounded-lg border pl-9 pr-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Cantidad */}
            <div className="w-28">
              <label className="block text-lg font-medium text-foreground mb-1">
                Cant.
              </label>
              <input
                type="number"
                min={1}
                value={detalle.cantidad}
                onChange={(e) =>
                  handleChange(index, "cantidad", Math.max(1, +e.target.value))
                }
                className="w-full h-12 rounded-lg border px-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Colocación y eliminar */}
            <div className="flex items-center gap-3 sm:ml-3">
              <label className="flex items-center gap-2 text-lg text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={detalle.colocacion_incluida}
                  onChange={(e) =>
                    handleChange(index, "colocacion_incluida", e.target.checked)
                  }
                  className="w-5 h-5 accent-primary"
                />
                Colocación
              </label>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label="Eliminar ítem"
                className="p-2 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
              >
                <Trash2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      {detalles.length > 0 && (
        <div className="text-right pt-2 border-t">
          <p className="text-lg font-medium text-foreground">
            Total estimado:{" "}
            <span className="text-2xl font-bold text-primary">
              ${total.toLocaleString("es-AR")}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}