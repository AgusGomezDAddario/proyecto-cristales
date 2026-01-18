import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Search, Plus, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import EditButton from "@/components/botones/boton-editar";
import DeleteButton from "@/components/botones/boton-eliminar";

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

type MedioPago = {
    id: number;
    nombre: string;
};

type PageProps = {
    medios: {
        data: MedioPago[];
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
    };
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE
// ═══════════════════════════════════════════════════════════════

export default function MediosPagoIndex({ medios, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<MedioPago | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState<MedioPago | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: "",
    });

    // ═══════════════════════════════════════════════════════════════
    // FILTRO (DEBOUNCE)
    // ═══════════════════════════════════════════════════════════════
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                "/medio-de-pago",
                { search: search || undefined },
                { preserveState: true, preserveScroll: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const openCreateModal = () => {
        reset();
        setEditing(null);
        setShowModal(true);
    };

    const openEditModal = (medio: MedioPago) => {
        setEditing(medio);
        setData("nombre", medio.nombre);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        editing
            ? put(`/medio-de-pago/${editing.id}`, { onSuccess: closeModal })
            : post("/medio-de-pago", { onSuccess: closeModal });
    };

    const openDeleteModal = (medio: MedioPago) => {
        setDeleting(medio);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!deleting) return;

        router.delete(`/medio-de-pago/${deleting.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleting(null);
            },
        });
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    return (
        <DashboardLayout>
            <Head title="Medios de pago" />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-800">
                        💳 Medios de pago
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Administrá los medios de pago disponibles
                    </p>
                </div>

                {/* FILTRO + BOTÓN */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    <div className="flex-1 hidden md:block" />

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar
                    </button>
                </div>

                {/* TABLA */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {medios.data.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            No hay medios de pago cargados
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-6 py-3 text-left text-xs text-slate-500 uppercase">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs text-slate-500 uppercase">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medios.data.map((medio) => (
                                        <tr
                                            key={medio.id}
                                            className="border-t hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {medio.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <EditButton
                                                        onClick={() => openEditModal(medio)}
                                                    />
                                                    <DeleteButton
                                                        onClick={() => openDeleteModal(medio)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                           
                        </>
                    )}
                </div>

                <p className="text-center text-sm text-slate-400 mt-4">
                    {medios.total} medio{medios.total !== 1 ? "s" : ""} de pago
                </p>
            </div>

            {/* MODAL CREAR / EDITAR */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/30"
                        onClick={closeModal}
                    />

                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                {editing ? "Editar medio de pago" : "Nuevo medio de pago"}
                            </h2>
                            <button onClick={closeModal}>
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData("nombre", e.target.value)}
                                placeholder="Ej: Efectivo, Transferencia..."
                                className={`w-full px-4 py-2 border rounded-lg ${
                                    errors.nombre ? "border-red-300" : "border-slate-200"
                                }`}
                            />
                            {errors.nombre && (
                                <p className="text-red-500 text-sm">
                                    {errors.nombre}
                                </p>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                                >
                                    {processing ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR */}
            {showDeleteModal && deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/30"
                        onClick={() => setShowDeleteModal(false)}
                    />

                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
                        <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-3" />
                        <h3 className="font-semibold mb-2">
                            ¿Eliminar medio de pago?
                        </h3>
                        <p className="text-slate-500 mb-4">
                            {deleting.nombre}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 border py-2 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
