import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Select from "react-select";
import { Search, Plus, Pencil, Trash2, X, AlertTriangle } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

type Marca = { id: number; nombre: string };
type Modelo = {
    id: number;
    nombre: string;
    marca: Marca;
};

type PageProps = {
    modelos: {
        data: Modelo[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    marcas: Marca[];
    filters: { search?: string; marca_id?: string; modelo_filter?: string };
};

// ═══════════════════════════════════════════════════════════════
// ESTILOS REACT-SELECT (SaaS moderno)
// ═══════════════════════════════════════════════════════════════

const selectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        minHeight: 42,
        borderRadius: "0.5rem",
        borderColor: state.isFocused ? "#6366f1" : "#e2e8f0",
        boxShadow: state.isFocused ? "0 0 0 2px rgba(99,102,241,0.15)" : "none",
        "&:hover": { borderColor: "#cbd5e1" },
        backgroundColor: "#fff",
    }),
    placeholder: (base: any) => ({
        ...base,
        color: "#94a3b8",
    }),
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function CatalogoVehiculos({ modelos, marcas, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [marcaFilter, setMarcaFilter] = useState<number | null>(
        filters.marca_id ? parseInt(filters.marca_id) : null
    );
    const [modeloFilter, setModeloFilter] = useState(filters.modelo_filter || "");
    const [showModal, setShowModal] = useState(false);
    const [editingModelo, setEditingModelo] = useState<Modelo | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingModelo, setDeletingModelo] = useState<Modelo | null>(null);
    const [isNewMarca, setIsNewMarca] = useState(false);

    // Form
    const { data, setData, post, put, processing, errors, reset } = useForm({
        marca_id: null as number | null,
        marca_nueva: "",
        modelo: "",
        nombre: "", // para update
    });

    // Debounce búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            search: (overrides.search ?? search) || undefined,
            marca_id: (overrides.marca_id ?? marcaFilter) || undefined,
            modelo_filter: (overrides.modelo_filter ?? modeloFilter) || undefined,
        };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        router.get("/catalogo-vehiculos", params, { preserveState: true, preserveScroll: true });
    };

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const openCreateModal = () => {
        reset();
        setEditingModelo(null);
        setIsNewMarca(false);
        setShowModal(true);
    };

    const openEditModal = (modelo: Modelo) => {
        setEditingModelo(modelo);
        setData({
            marca_id: modelo.marca.id,
            marca_nueva: "",
            modelo: "",
            nombre: modelo.nombre,
        });
        setIsNewMarca(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingModelo(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingModelo) {
            put(`/catalogo-vehiculos/${editingModelo.id}`, { onSuccess: closeModal });
        } else {
            post("/catalogo-vehiculos", { onSuccess: closeModal });
        }
    };

    const openDeleteModal = (modelo: Modelo) => {
        setDeletingModelo(modelo);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deletingModelo) {
            router.delete(`/catalogo-vehiculos/${deletingModelo.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setDeletingModelo(null);
                },
            });
        }
    };

    const marcaOptions = marcas.map((m) => ({ value: m.id, label: m.nombre }));

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    return (
        <DashboardLayout>
            <Head title="Catálogo de Modelos" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ═══ HEADER ═══ */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                        📚 Catálogo de vehículos
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gestiona las marcas y modelos disponibles en el sistema
                    </p>
                </div>

                {/* ═══ FILTROS + BOTÓN ═══ */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        {/* Búscador */}
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="🔍 Buscar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition text-sm"
                            />
                        </div>

                        {/* Filtro Marca */}
                        <div className="w-full md:w-40">
                            <Select
                                options={marcaOptions}
                                placeholder="🎭 Marca..."
                                isClearable
                                value={marcaOptions.find((o) => o.value === marcaFilter) || null}
                                onChange={(opt) => {
                                    setMarcaFilter(opt?.value || null);
                                    applyFilters({ marca_id: opt?.value || null });
                                }}
                                styles={selectStyles}
                            />
                        </div>

                        {/* Filtro Modelo (texto) */}
                        <input
                            type="text"
                            placeholder="🚗 Modelo..."
                            value={modeloFilter}
                            onChange={(e) => {
                                setModeloFilter(e.target.value);
                            }}
                            onBlur={() => applyFilters()}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            className="w-full md:w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition text-sm"
                        />

                        {/* Limpiar filtros */}
                        {(search || marcaFilter || modeloFilter) && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setMarcaFilter(null);
                                    setModeloFilter("");
                                    router.get("/catalogo-vehiculos");
                                }}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition"
                            >
                                <X className="h-3.5 w-3.5" />
                                Limpiar
                            </button>
                        )}

                        {/* Espaciador */}
                        <div className="flex-1 hidden md:block"></div>

                        {/* Botón Agregar - Verde a la derecha */}
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition shadow-sm text-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar Modelo
                        </button>
                    </div>
                </div>

                {/* ═══ TABLA ═══ */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {modelos.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-400 text-lg">No hay modelos registrados</p>
                            <p className="text-slate-300 text-sm mt-1">
                                {search ? "Probá ajustando la búsqueda" : "Agregá el primer modelo"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Marca
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Modelo
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {modelos.data.map((modelo) => (
                                        <tr key={modelo.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    {modelo.marca.nombre}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {modelo.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(modelo)}
                                                        className="p-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition shadow-sm"
                                                        title="Editar"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(modelo)}
                                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-sm"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginación */}
                            {modelos.last_page > 1 && (
                                <div className="px-6 py-4 border-t border-slate-100 flex justify-center gap-1">
                                    {modelos.links.map((link, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1.5 rounded text-sm font-medium transition ${link.active
                                                ? "bg-slate-800 text-white"
                                                : link.url
                                                    ? "text-slate-600 hover:bg-slate-100"
                                                    : "text-slate-300 cursor-not-allowed"
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Contador */}
                <p className="text-slate-400 text-sm mt-4 text-center">
                    {modelos.total} modelo{modelos.total !== 1 ? "s" : ""} en total
                </p>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MODAL CREAR/EDITAR */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {editingModelo ? "✏️ Editar Modelo" : "➕ Nuevo Modelo"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Marca */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Marca
                                </label>

                                {!editingModelo && (
                                    <div className="flex items-center gap-3 mb-2">
                                        <label className="inline-flex items-center text-sm text-slate-600">
                                            <input
                                                type="radio"
                                                checked={!isNewMarca}
                                                onChange={() => setIsNewMarca(false)}
                                                className="mr-2 text-indigo-600"
                                            />
                                            Existente
                                        </label>
                                        <label className="inline-flex items-center text-sm text-slate-600">
                                            <input
                                                type="radio"
                                                checked={isNewMarca}
                                                onChange={() => setIsNewMarca(true)}
                                                className="mr-2 text-indigo-600"
                                            />
                                            Nueva marca
                                        </label>
                                    </div>
                                )}

                                {isNewMarca && !editingModelo ? (
                                    <input
                                        type="text"
                                        value={data.marca_nueva}
                                        onChange={(e) => setData("marca_nueva", e.target.value)}
                                        placeholder="Nombre de la nueva marca..."
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
                                    />
                                ) : (
                                    <Select
                                        options={marcaOptions}
                                        placeholder="Seleccionar marca..."
                                        value={marcaOptions.find((o) => o.value === data.marca_id) || null}
                                        onChange={(opt) => setData("marca_id", opt?.value || null)}
                                        styles={selectStyles}
                                        isClearable
                                    />
                                )}
                                {errors.marca_id && <p className="text-red-500 text-sm mt-1">{errors.marca_id}</p>}
                            </div>

                            {/* Modelo */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Modelo
                                </label>
                                <input
                                    type="text"
                                    value={editingModelo ? data.nombre : data.modelo}
                                    onChange={(e) =>
                                        editingModelo
                                            ? setData("nombre", e.target.value)
                                            : setData("modelo", e.target.value)
                                    }
                                    placeholder="Ej: Corolla, Hilux, Ranger..."
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition ${errors.modelo || errors.nombre ? "border-red-300" : "border-slate-200"
                                        }`}
                                />
                                {(errors.modelo || errors.nombre) && (
                                    <p className="text-red-500 text-sm mt-1">{errors.modelo || errors.nombre}</p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                                >
                                    {processing ? "Guardando..." : editingModelo ? "Guardar" : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MODAL ELIMINAR */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {showDeleteModal && deletingModelo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />

                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                ¿Eliminar modelo?
                            </h3>
                            <p className="text-slate-500 text-sm mb-1">
                                Vas a eliminar:
                            </p>
                            <p className="font-medium text-slate-700 mb-4">
                                {deletingModelo.marca.nombre} — {deletingModelo.nombre}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
