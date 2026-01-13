import React, { useMemo } from "react";
import { Plus, Trash2, DollarSign, Layers, Tag, Delete } from "lucide-react";
import DeleteButton from "../botones/boton-eliminar";

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
  colocacion_incluida: boolean;

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
      ...detalles,
      {
        articulo_id: null,
        descripcion: "",
        valor: "",
        cantidad: 1,
        colocacion_incluida: false,
        atributos: {},
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

          return (
            <div key={index} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Artículo (6/12) */}
                <div className="md:col-span-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Artículo *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <select
                      value={detalle.articulo_id ?? ""}
                      onChange={(e) => handleArticuloChange(index, e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900 ${
                        getItemError(index, "articulo_id") ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
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
                  {getItemError(index, "articulo_id") && (
                    <p className="mt-2 text-sm text-red-600">{getItemError(index, "articulo_id")}</p>
                  )}
                </div>

                {/* Valor (3/12) */}
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
                      value={detalle.valor === "" ? "" : detalle.valor}
                      onChange={(e) => handleChange(index, "valor", e.target.value === "" ? "" : e.target.value)}
                      placeholder="0"
                      className={`w-full pl-10 pr-3 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900 ${
                        getItemError(index, "valor") ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {getItemError(index, "valor") && (
                    <p className="mt-2 text-sm text-red-600">{getItemError(index, "valor")}</p>
                  )}
                </div>

                {/* Cantidad + Coloc. + Eliminar (3/12) */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Cantidad *
                  </label>

                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="number"
                      min={1}
                      value={detalle.cantidad}
                      onChange={(e) => handleChange(index, "cantidad", Math.max(1, Number(e.target.value)))}
                      className={`w-[96px] px-3 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900 ${
                        getItemError(index, "cantidad") ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    />

                    <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 whitespace-nowrap select-none bg-white">
                      <input
                        type="checkbox"
                        checked={detalle.colocacion_incluida}
                        onChange={(e) => handleChange(index, "colocacion_incluida", e.target.checked)}
                        className="w-5 h-5 rounded bg-white border border-gray-400 accent-[#2596be] focus:ring-2 focus:ring-[#1862fd] cursor-pointer"
                      />
                      Coloc.
                    </label>

                    <DeleteButton 
                      onClick={() => handleRemove(index)}
                      disabled={detalles.length === 1}
                    />
                  </div>
                </div>
              </div>

              {/* Categorías/Subcategorías dinámicas */}
              {articulo?.categorias?.length ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3">Atributos del artículo</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {articulo.categorias.map((cat) => {
                      const selected = detalle.atributos?.[cat.id] ?? null;
                      return (
                        <div key={cat.id}>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
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
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
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
                <div className="text-sm text-gray-500">
                  {detalle.articulo_id ? "Este artículo no tiene atributos configurados." : "Seleccione un artículo para ver atributos."}
                </div>
              )}

              {/* Descripción libre opcional */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Descripción (opcional)
                </label>
                <input
                  type="text"
                  value={detalle.descripcion}
                  onChange={(e) => handleChange(index, "descripcion", e.target.value)}
                  placeholder="Aclaración adicional..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900"
                />
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
