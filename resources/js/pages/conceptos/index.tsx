import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
    Search, Plus, X, AlertTriangle, Tag, TrendingUp, TrendingDown
} from "lucide-react";
import DeleteButton from "@/components/botones/boton-eliminar";
import EditButton from "@/components/botones/boton-editar";

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

type Concepto = {
    id: number;
    nombre: string;
    tipo: "ingreso" | "egreso";
    movimientos_count: number;
};

type PageProps = {
    conceptos: {
        data: Concepto[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { search?: string; tipo?: string };
    stats: {
        total: number;
        ingresos: number;
        egresos: number;
    };
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function ConceptosIndex({ conceptos, filters, stats }: PageProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [tipoFilter, setTipoFilter] = useState(filters.tipo || "");
    const [showModal, setShowModal] = useState(false);
    const [editingConcepto, setEditingConcepto] = useState<Concepto | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingConcepto, setDeletingConcepto] = useState<Concepto | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: "",
        tipo: "ingreso",
    });

    // Debounce búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, tipoFilter]);

    const applyFilters = () => {
        const params: Record<string, any> = {
            search: search || undefined,
            tipo: tipoFilter || undefined,
        };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        router.get("/conceptos", params, { preserveState: true, preserveScroll: true });
    };

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const openCreateModal = () => {
        reset();
        setEditingConcepto(null);
        setShowModal(true);
    };

    const openEditModal = (concepto: Concepto) => {
        setEditingConcepto(concepto);
        setData({
            nombre: concepto.nombre,
            tipo: concepto.tipo,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingConcepto(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingConcepto) {
            put(`/conceptos/${editingConcepto.id}`, { onSuccess: closeModal });
        } else {
            post("/conceptos", { onSuccess: closeModal });
        }
    };

    const openDeleteModal = (concepto: Concepto) => {
        setDeletingConcepto(concepto);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deletingConcepto) {
            router.delete(`/conceptos/${deletingConcepto.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setDeletingConcepto(null);
                },
            });
        }
    };

    const clearFilters = () => {
        setSearch("");
        setTipoFilter("");
        router.get("/conceptos");
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    return (
        <DashboardLayout>
            <Head title="Conceptos" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ═══ HEADER ═══ */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                        🏷️ Conceptos
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gestiona los conceptos de ingresos y egresos
                    </p>
                </div>

                {/* ═══ STATS CARDS ═══ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Tag className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                                <p className="text-sm text-slate-500">Total conceptos</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stats.ingresos}</p>
                                <p className="text-sm text-slate-500">De ingresos</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <TrendingDown className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stats.egresos}</p>
                                <p className="text-sm text-slate-500">De egresos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ FILTROS + BOTÓN ═══ */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        {/* Buscador */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="🔍 Buscar por nombre..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition text-sm"
                            />
                        </div>

                        {/* Filtro por tipo */}
                        <select
                            value={tipoFilter}
                            onChange={(e) => setTipoFilter(e.target.value)}
                            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition text-sm"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="ingreso">Ingresos</option>
                            <option value="egreso">Egresos</option>
                        </select>

                        {/* Limpiar filtros */}
                        {(search || tipoFilter) && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition"
                            >
                                <X className="h-3.5 w-3.5" />
                                Limpiar
                            </button>
                        )}

                        {/* Espaciador */}
                        <div className="flex-1 hidden md:block"></div>

                        {/* Botón Agregar */}
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition shadow-sm text-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar Concepto
                        </button>
                    </div>
                </div>

                {/* ═══ TABLA ═══ */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {conceptos.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-400 text-lg">No hay conceptos registrados</p>
                            <p className="text-slate-300 text-sm mt-1">
                                {search || tipoFilter ? "Probá ajustando los filtros" : "Agregá el primer concepto"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Movimientos
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {conceptos.data.map((concepto) => (
                                        <tr key={concepto.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800">
                                                    {concepto.nombre}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {concepto.tipo === "ingreso" ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                        <TrendingUp className="h-3.5 w-3.5" />
                                                        Ingreso
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                                        <TrendingDown className="h-3.5 w-3.5" />
                                                        Egreso
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                    {concepto.movimientos_count} movimiento{concepto.movimientos_count !== 1 ? "s" : ""}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <EditButton onClick={() => openEditModal(concepto)} />
                                                    <DeleteButton onClick={() => openDeleteModal(concepto)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginación */}
                            {conceptos.last_page > 1 && (
                                <div className="px-6 py-4 border-t border-slate-100 flex justify-center gap-1">
                                    {conceptos.links.map((link, idx) => (
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
                    {conceptos.total} concepto{conceptos.total !== 1 ? "s" : ""} en total
                </p>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MODAL CREAR/EDITAR CONCEPTO */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {editingConcepto ? "✏️ Editar Concepto" : "➕ Nuevo Concepto"}
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre *</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData("nombre", e.target.value)}
                                    placeholder="Nombre del concepto..."
                                    maxLength={50}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-400 transition ${errors.nombre ? "border-red-300" : "border-slate-200"}`}
                                />
                                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo *</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData("tipo", "ingreso")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition font-medium text-sm ${data.tipo === "ingreso"
                                            ? "bg-green-50 border-green-400 text-green-700"
                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <TrendingUp className={`h-4 w-4 ${data.tipo === "ingreso" ? "text-green-600" : "text-slate-400"}`} />
                                        Ingreso
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData("tipo", "egreso")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition font-medium text-sm ${data.tipo === "egreso"
                                            ? "bg-red-50 border-red-400 text-red-700"
                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <TrendingDown className={`h-4 w-4 ${data.tipo === "egreso" ? "text-red-600" : "text-slate-400"}`} />
                                        Egreso
                                    </button>
                                </div>
                                {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing} className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50">
                                    {processing ? "Guardando..." : editingConcepto ? "Guardar" : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MODAL ELIMINAR */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {showDeleteModal && deletingConcepto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">¿Eliminar concepto?</h3>
                            <p className="text-slate-500 text-sm mb-1">Vas a eliminar:</p>
                            <p className="font-medium text-slate-700 mb-1">{deletingConcepto.nombre}</p>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mb-4 ${deletingConcepto.tipo === "ingreso" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                {deletingConcepto.tipo === "ingreso" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {deletingConcepto.tipo === "ingreso" ? "Ingreso" : "Egreso"}
                            </span>
                            {deletingConcepto.movimientos_count > 0 && (
                                <p className="text-amber-600 text-sm mb-4">
                                    ⚠️ Este concepto tiene {deletingConcepto.movimientos_count} movimiento{deletingConcepto.movimientos_count !== 1 ? "s" : ""} asociado{deletingConcepto.movimientos_count !== 1 ? "s" : ""} y no puede ser eliminado.
                                </p>
                            )}
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deletingConcepto.movimientos_count > 0}
                                    className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
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