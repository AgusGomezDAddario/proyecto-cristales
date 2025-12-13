import React from "react";
import { Plus, Trash2, DollarSign, Layers } from "lucide-react";

export type ArticuloCatalog = {
  id: number;
  nombre: string;
  categorias: {
    id: number;
    nombre: string;
    subcategorias: { id: number; nombre: string }[];
  }[];
};

export interface Detalle {
  articulo_id: number | null;
  atributos: Record<number, number | null>; // categoria_id -> subcategoria_id
  descripcion: string;
  valor: number | string;
  cantidad: number;
  colocacion_incluida: boolean;
}

interface Props {
  detalles: Detalle[];
  setDetalles: (detalles: Detalle[]) => void;
  articulosCatalog?: ArticuloCatalog[];
}

export default function DetallesSection({ detalles, setDetalles, articulosCatalog = [] }: Props) {
  const handleChange = (index: number, field: keyof Detalle, value: any) => {
    const nuevos = [...detalles];
    (nuevos[index] as any)[field] = value;
    setDetalles(nuevos);
  };

  const handleChangeAtributo = (index: number, categoriaId: number, subcategoriaId: number | null) => {
    const nuevos = [...detalles];
    const item = nuevos[index];
    item.atributos = { ...(item.atributos || {}), [categoriaId]: subcategoriaId };
    setDetalles(nuevos);
  };

  const handleChangeArticulo = (index: number, articuloId: number | null) => {
    const nuevos = [...detalles];
    const item = nuevos[index];

    item.articulo_id = articuloId;
    // Reset de atributos al cambiar artículo (evita inconsistencias)
    item.atributos = {};

    setDetalles(nuevos);
  };

  const handleAdd = () => {
    setDetalles([
      ...detalles,
      {
        articulo_id: null,
        atributos: {},
        descripcion: "",
        valor: "",
        cantidad: 1,
        colocacion_incluida: false,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const total = detalles.reduce((sum, d) => {
    const v = d.valor === "" ? 0 : Number(d.valor);
    return sum + (isNaN(v) ? 0 : v) * (Number(d.cantidad) || 0);
  }, 0);

  const getArticulo = (detalle: Detalle) =>
    articulosCatalog.find((a) => a.id === detalle.articulo_id) || null;

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
        {detalles.map((detalle, index) => {
          const articulo = getArticulo(detalle);

          return (
            <div key={index} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Artículo */}
                <div className="md:col-span-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Artículo *</label>
                  <select
                    value={detalle.articulo_id ?? ""}
                    onChange={(e) =>
                      handleChangeArticulo(index, e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
                  >
                    <option value="">Seleccionar…</option>
                    {articulosCatalog.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    (Este catálogo lo gestiona el Administrador)
                  </p>
                </div>

                {/* Descripción libre */}
                <div className="md:col-span-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Descripción (opcional)</label>
                  <input
                    type="text"
                    value={detalle.descripcion}
                    onChange={(e) => handleChange(index, "descripcion", e.target.value)}
                    placeholder="Ej: Observación puntual del trabajo"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
                  />
                </div>

                {/* Valor */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Valor *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={detalle.valor === "" ? "" : detalle.valor}
                      onChange={(e) => handleChange(index, "valor", e.target.value === "" ? "" : e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
                    />
                  </div>
                </div>

                {/* Categorías dinámicas */}
                {articulo?.categorias?.length ? (
                  <div className="md:col-span-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {articulo.categorias.map((cat) => (
                        <div key={cat.id}>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            {cat.nombre}
                          </label>
                          <select
                            value={detalle.atributos?.[cat.id] ?? ""}
                            onChange={(e) =>
                              handleChangeAtributo(
                                index,
                                cat.id,
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
                          >
                            <option value="">Seleccionar…</option>
                            {cat.subcategorias.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-12">
                    <p className="text-sm text-gray-500">
                      {detalle.articulo_id
                        ? "Este artículo no tiene categorías configuradas."
                        : "Seleccioná un artículo para habilitar las categorías."}
                    </p>
                  </div>
                )}

                {/* Cantidad + Colocación + Eliminar */}
                <div className="md:col-span-12">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Cantidad *</label>
                      <input
                        type="number"
                        min={1}
                        value={detalle.cantidad}
                        onChange={(e) => handleChange(index, "cantidad", Math.max(1, Number(e.target.value)))}
                        className="w-[120px] px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
                      />
                    </div>

                    <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 whitespace-nowrap select-none mt-8">
                      <input
                        type="checkbox"
                        checked={detalle.colocacion_incluida}
                        onChange={(e) => handleChange(index, "colocacion_incluida", e.target.checked)}
                        className="w-5 h-5 rounded bg-white border border-gray-400 accent-[#2596be] focus:ring-2 focus:ring-[#1862fd] cursor-pointer"
                      />
                      Colocación incluida
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="mt-8 p-2 rounded-lg bg-[#2596be] text-white hover:bg-[#1862fd] transition"
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
          );
        })}

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
