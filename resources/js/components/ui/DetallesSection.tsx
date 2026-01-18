import React, { useMemo } from "react";
import { Plus, Trash2, DollarSign, Layers, Tag, Wrench, Store } from "lucide-react";

export interface SubcategoriaDTO {
  id: number;
  nombre: string;
}

export interface CategoriaDTO {
  id: number;
  nombre: string;
  subcategorias: SubcategoriaDTO[];
}

export interface ArticuloDTO {
  id: number;
  nombre: string;
  categorias: CategoriaDTO[];
}

export interface Detalle {
  articulo_id: number | null;
  // opcional: aclaración libre (no reemplaza el artículo)
  descripcion: string;

  valor: number | string;
  cantidad: number;
  colocacion_incluida: boolean; // true = Colocación, false = Retiro en local

  // categoriaId -> subcategoriaId
  atributos: Record<number, number | null>;
}

interface Props {
  detalles: Detalle[];
  setDetalles: (detalles: Detalle[]) => void;
  articulos: ArticuloDTO[];
  errors?: Record<string, string>;
}

export default function DetallesSection({ detalles, setDetalles, articulos, errors }: Props) {
  const articulosById = useMemo(() => {
    const map = new Map<number, ArticuloDTO>();
    articulos.forEach((a) => map.set(a.id, a));
    return map;
  }, [articulos]);

  const handleChange = (index: number, field: keyof Detalle, value: any) => {
    const nuevos = [...detalles];
    (nuevos[index] as any)[field] = value;
    setDetalles(nuevos);
  };

  const handleChangeAtributo = (index: number, categoriaId: number, subcategoriaId: number | null) => {
    const nuevos = [...detalles];
    const actual = nuevos[index];
    nuevos[index] = {
      ...actual,
      atributos: {
        ...(actual.atributos || {}),
        [categoriaId]: subcategoriaId,
      },
    };
    setDetalles(nuevos);
  };

  const handleArticuloChange = (index: number, articuloIdRaw: string) => {
    const articuloId = articuloIdRaw ? Number(articuloIdRaw) : null;
    const articulo = articuloId ? articulosById.get(articuloId) : undefined;

    // Al cambiar artículo:
    // - setea articulo_id
    // - resetea atributos para que coincidan con categorías del nuevo artículo
    const nuevos = [...detalles];
    const prev = nuevos[index];

    const atributosReset: Record<number, number | null> = {};
    if (articulo?.categorias?.length) {
      articulo.categorias.forEach((c) => {
        atributosReset[c.id] = null;
      });
    }

    nuevos[index] = {
      ...prev,
      articulo_id: articuloId,
      atributos: atributosReset,
    };

    setDetalles(nuevos);
  };

  const handleAdd = () => {
    setDetalles([
      {
        articulo_id: null,
        descripcion: "",
        valor: "",
        cantidad: 1,
        colocacion_incluida: true, // Por defecto: Colocación
        atributos: {},
      },
      ...detalles,
    ]);
  };

  const handleToggleColocacion = (index: number, value: boolean) => {
    const nuevos = [...detalles];
    nuevos[index].colocacion_incluida = value;
    setDetalles(nuevos);
  };

  const handleRemove = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const total = detalles.reduce((sum, d) => {
    const v = d.valor === "" ? 0 : Number(d.valor);
    return sum + (isNaN(v) ? 0 : v) * (Number(d.cantidad) || 0);
  }, 0);

  const getItemError = (idx: number, field: string) => {
    // convención sugerida desde backend: detalles.0.articulo_id, detalles.0.valor, etc.
    if (!errors) return "";
    return errors[`detalles.${idx}.${field}`] || "";
  };

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
          const articulo = detalle.articulo_id ? articulosById.get(detalle.articulo_id) : undefined;
          const isItemConfigured = detalle.articulo_id !== null;

          return (
            <div
              key={index}
              className={`rounded-xl border-2 p-4 transition-all ${isItemConfigured
                ? 'border-green-300 bg-green-50/30'
                : 'border-gray-200 bg-white'
                }`}
            >
              {/* Fila principal compacta */}
              <div className="flex flex-wrap items-end gap-3">
                {/* Artículo */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Artículo *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={detalle.articulo_id ?? ""}
                      onChange={(e) => handleArticuloChange(index, e.target.value)}
                      className={`w-full pl-8 pr-2 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${getItemError(index, "articulo_id") ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      <option value="">Seleccionar artículo...</option>
                      {articulos.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Valor */}
                <div className="w-28">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Valor *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={detalle.valor === "" ? "" : detalle.valor}
                      onChange={(e) => handleChange(index, "valor", e.target.value === "" ? "" : e.target.value)}
                      placeholder="0"
                      className={`w-full pl-8 pr-2 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${getItemError(index, "valor") ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                        }`}
                    />
                  </div>
                </div>

                {/* Cantidad */}
                <div className="w-20">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Cant. *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={detalle.cantidad}
                    onChange={(e) => handleChange(index, "cantidad", Math.max(1, Number(e.target.value)))}
                    className={`w-full px-2 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-center ${getItemError(index, "cantidad") ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                  />
                </div>

                {/* Toggle Buttons: Colocación / Retiro */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => handleToggleColocacion(index, true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${detalle.colocacion_incluida
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                      }`}
                    title="Incluye colocación"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    Coloc.
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleColocacion(index, false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!detalle.colocacion_incluida
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                      }`}
                    title="Retiro en local"
                  >
                    <Store className="h-3.5 w-3.5" />
                    Retiro
                  </button>
                </div>

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Eliminar ítem"
                  title="Eliminar ítem"
                  disabled={detalles.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Fila de errores */}
              {(getItemError(index, "articulo_id") || getItemError(index, "valor") || getItemError(index, "cantidad")) && (
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-red-600">
                  {getItemError(index, "articulo_id") && <span>{getItemError(index, "articulo_id")}</span>}
                  {getItemError(index, "valor") && <span>{getItemError(index, "valor")}</span>}
                  {getItemError(index, "cantidad") && <span>{getItemError(index, "cantidad")}</span>}
                </div>
              )}

              {/* Atributos del artículo (colapsados visualmente) */}
              {articulo?.categorias?.length ? (
                <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Atributos</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {articulo.categorias.map((cat) => {
                      const selected = detalle.atributos?.[cat.id] ?? null;
                      return (
                        <div key={cat.id}>
                          <label className="block text-xs text-gray-500 mb-1">
                            {cat.nombre}
                          </label>
                          <select
                            value={selected ?? ""}
                            onChange={(e) =>
                              handleChangeAtributo(
                                index,
                                cat.id,
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          >
                            <option value="">Seleccionar...</option>
                            {cat.subcategorias.map((sc) => (
                              <option key={sc.id} value={sc.id}>
                                {sc.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                !isItemConfigured && (
                  <p className="mt-2 text-xs text-gray-400 italic">
                    Seleccione un artículo para ver atributos.
                  </p>
                )
              )}

              {/* Descripción opcional - más compacta */}
              <div className="mt-3">
                <input
                  type="text"
                  value={detalle.descripcion}
                  onChange={(e) => handleChange(index, "descripcion", e.target.value)}
                  placeholder="Descripción adicional (opcional)..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition placeholder:text-gray-400"
                />
              </div>
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
