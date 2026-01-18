import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Select from "react-select";
import {
    Search, Plus, Pencil, Trash2, X, AlertTriangle,
    Users, Car, UserCheck, UserX, Phone, Mail, ChevronDown, ChevronUp
} from "lucide-react";
import axios from "axios";

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

type Marca = { id: number; nombre: string };
type Modelo = { id: number; nombre: string };
type Vehiculo = {
    id: number;
    patente: string;
    anio: number | null;
    marca: Marca | null;
    modelo: Modelo | null;
};

type Cliente = {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string | null;
    email: string | null;
    vehiculos: Vehiculo[];
};

type PageProps = {
    clientes: {
        data: Cliente[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { search?: string };
    stats: {
        total: number;
        conVehiculos: number;
        sinVehiculos: number;
    };
    marcas: Marca[];
};

// ═══════════════════════════════════════════════════════════════
// ESTILOS REACT-SELECT
// ═══════════════════════════════════════════════════════════════

const selectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        minHeight: 42,
        borderRadius: "0.5rem",
        borderColor: state.isFocused ? "#22c55e" : "#e2e8f0",
        boxShadow: state.isFocused ? "0 0 0 2px rgba(34,197,94,0.15)" : "none",
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

export default function ClientesIndex({ clientes, filters, stats, marcas }: PageProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [showModal, setShowModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null);
    const [expandedCliente, setExpandedCliente] = useState<number | null>(null);
    const [showVehiculosModal, setShowVehiculosModal] = useState(false);
    const [vehiculosModalCliente, setVehiculosModalCliente] = useState<Cliente | null>(null);
    const [vehiculosDisponibles, setVehiculosDisponibles] = useState<Vehiculo[]>([]);
    const [loadingVehiculos, setLoadingVehiculos] = useState(false);

    // Estado para nuevo vehículo
    const [showNuevoVehiculo, setShowNuevoVehiculo] = useState(false);
    const [nuevoVehiculo, setNuevoVehiculo] = useState({ patente: "", marca_id: null as number | null, modelo_id: null as number | null, anio: "" });
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [loadingModelos, setLoadingModelos] = useState(false);
    const [vehiculoErrors, setVehiculoErrors] = useState<Record<string, string>>({});
    const [creatingVehiculo, setCreatingVehiculo] = useState(false);

    // Form para cliente
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
    });

    // Debounce búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Cargar modelos cuando cambia la marca
    useEffect(() => {
        if (nuevoVehiculo.marca_id) {
            setLoadingModelos(true);
            axios.get(`/api/clientes/modelos/${nuevoVehiculo.marca_id}`)
                .then(res => setModelos(res.data))
                .catch(err => console.error("Error cargando modelos:", err))
                .finally(() => setLoadingModelos(false));
        } else {
            setModelos([]);
        }
        setNuevoVehiculo(prev => ({ ...prev, modelo_id: null }));
    }, [nuevoVehiculo.marca_id]);

    const applyFilters = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            search: (overrides.search ?? search) || undefined,
        };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        router.get("/clientes", params, { preserveState: true, preserveScroll: true });
    };

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const openCreateModal = () => {
        reset();
        setEditingCliente(null);
        setShowModal(true);
    };

    const openEditModal = (cliente: Cliente) => {
        setEditingCliente(cliente);
        setData({
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            telefono: cliente.telefono || "",
            email: cliente.email || "",
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCliente(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCliente) {
            put(`/clientes/${editingCliente.id}`, { onSuccess: closeModal });
        } else {
            post("/clientes", { onSuccess: closeModal });
        }
    };

    const openDeleteModal = (cliente: Cliente) => {
        setDeletingCliente(cliente);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deletingCliente) {
            router.delete(`/clientes/${deletingCliente.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setDeletingCliente(null);
                },
            });
        }
    };

    const toggleExpand = (clienteId: number) => {
        setExpandedCliente(expandedCliente === clienteId ? null : clienteId);
    };

    const openVehiculosModal = async (cliente: Cliente) => {
        setVehiculosModalCliente(cliente);
        setShowVehiculosModal(true);
        setShowNuevoVehiculo(false);
        resetNuevoVehiculo();
        setLoadingVehiculos(true);
        try {
            const response = await axios.get(`/api/clientes/${cliente.id}/vehiculos-disponibles`);
            setVehiculosDisponibles(response.data);
        } catch (error) {
            console.error("Error cargando vehículos:", error);
        } finally {
            setLoadingVehiculos(false);
        }
    };

    const handleAttachVehicle = async (vehiculoId: number) => {
        if (!vehiculosModalCliente) return;
        router.post(`/clientes/${vehiculosModalCliente.id}/vehiculos/${vehiculoId}`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setVehiculosDisponibles(prev => prev.filter(v => v.id !== vehiculoId));
            }
        });
    };

    const handleDetachVehicle = async (clienteId: number, vehiculoId: number) => {
        router.delete(`/clientes/${clienteId}/vehiculos/${vehiculoId}`, {
            preserveScroll: true,
        });
    };

    const handleDeleteVehicle = async (vehiculoId: number) => {
        if (!confirm('¿Eliminar este vehículo permanentemente?')) return;
        router.delete(`/vehiculos/${vehiculoId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setVehiculosDisponibles(prev => prev.filter(v => v.id !== vehiculoId));
            }
        });
    };

    const resetNuevoVehiculo = () => {
        setNuevoVehiculo({ patente: "", marca_id: null, modelo_id: null, anio: "" });
        setModelos([]);
        setVehiculoErrors({});
    };

    const handleCreateVehiculo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehiculosModalCliente) return;

        // Validaciones frontend
        const errs: Record<string, string> = {};
        if (!nuevoVehiculo.patente.trim()) errs.patente = "La patente es obligatoria.";
        if (!nuevoVehiculo.marca_id) errs.marca_id = "Seleccione una marca.";
        if (!nuevoVehiculo.modelo_id) errs.modelo_id = "Seleccione un modelo.";
        setVehiculoErrors(errs);
        if (Object.keys(errs).length) return;

        setCreatingVehiculo(true);
        router.post(`/clientes/${vehiculosModalCliente.id}/vehiculos`, {
            patente: nuevoVehiculo.patente.toUpperCase(),
            marca_id: nuevoVehiculo.marca_id,
            modelo_id: nuevoVehiculo.modelo_id,
            anio: nuevoVehiculo.anio ? parseInt(nuevoVehiculo.anio) : null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowNuevoVehiculo(false);
                resetNuevoVehiculo();
                setCreatingVehiculo(false);
            },
            onError: (errs) => {
                setVehiculoErrors(errs as Record<string, string>);
                setCreatingVehiculo(false);
            }
        });
    };

    const marcaOptions = marcas.map(m => ({ value: m.id, label: m.nombre }));
    const modeloOptions = modelos.map(m => ({ value: m.id, label: m.nombre }));

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    return (
        <DashboardLayout>
            <Head title="Clientes" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ═══ HEADER ═══ */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                        👥 Clientes
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gestiona tus clientes y sus vehículos asociados
                    </p>
                </div>

                {/* ═══ STATS CARDS ═══ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                                <p className="text-sm text-slate-500">Total clientes</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <UserCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stats.conVehiculos}</p>
                                <p className="text-sm text-slate-500">Con vehículos</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <UserX className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stats.sinVehiculos}</p>
                                <p className="text-sm text-slate-500">Sin vehículos</p>
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
                                placeholder="🔍 Buscar por nombre, teléfono, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition text-sm"
                            />
                        </div>

                        {/* Limpiar filtros */}
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    router.get("/clientes");
                                }}
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
                            Agregar Cliente
                        </button>
                    </div>
                </div>

                {/* ═══ TABLA ═══ */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {clientes.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-400 text-lg">No hay clientes registrados</p>
                            <p className="text-slate-300 text-sm mt-1">
                                {search ? "Probá ajustando la búsqueda" : "Agregá el primer cliente"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Contacto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Vehículos
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {clientes.data.map((cliente) => (
                                        <React.Fragment key={cliente.id}>
                                            <tr className="hover:bg-slate-50/50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-800">
                                                        {cliente.apellido}, {cliente.nombre}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {cliente.telefono && (
                                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                                {cliente.telefono}
                                                            </div>
                                                        )}
                                                        {cliente.email && (
                                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                                {cliente.email}
                                                            </div>
                                                        )}
                                                        {!cliente.telefono && !cliente.email && (
                                                            <span className="text-sm text-slate-400">Sin contacto</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {cliente.vehiculos.length > 0 ? (
                                                        <button
                                                            onClick={() => toggleExpand(cliente.id)}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition"
                                                        >
                                                            <Car className="h-3.5 w-3.5" />
                                                            {cliente.vehiculos.length} vehículo{cliente.vehiculos.length !== 1 ? "s" : ""}
                                                            {expandedCliente === cliente.id ? (
                                                                <ChevronUp className="h-3 w-3" />
                                                            ) : (
                                                                <ChevronDown className="h-3 w-3" />
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                                                            Sin vehículos
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openVehiculosModal(cliente)}
                                                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition shadow-sm"
                                                            title="Gestionar vehículos"
                                                        >
                                                            <Car className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openEditModal(cliente)}
                                                            className="p-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition shadow-sm"
                                                            title="Editar"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(cliente)}
                                                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-sm"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Fila expandible de vehículos */}
                                            {expandedCliente === cliente.id && cliente.vehiculos.length > 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-4 bg-slate-50">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {cliente.vehiculos.map((v) => (
                                                                <div
                                                                    key={v.id}
                                                                    className="bg-white rounded-lg border border-slate-200 p-3 flex items-center justify-between"
                                                                >
                                                                    <div>
                                                                        <p className="font-medium text-slate-800">{v.patente}</p>
                                                                        <p className="text-sm text-slate-500">
                                                                            {v.marca?.nombre} {v.modelo?.nombre} {v.anio && `(${v.anio})`}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleDetachVehicle(cliente.id, v.id)}
                                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                                        title="Desasociar vehículo"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginación */}
                            {clientes.last_page > 1 && (
                                <div className="px-6 py-4 border-t border-slate-100 flex justify-center gap-1">
                                    {clientes.links.map((link, idx) => (
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
                    {clientes.total} cliente{clientes.total !== 1 ? "s" : ""} en total
                </p>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MODAL CREAR/EDITAR CLIENTE */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {editingCliente ? "✏️ Editar Cliente" : "➕ Nuevo Cliente"}
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
                                    placeholder="Nombre del cliente..."
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-400 transition ${errors.nombre ? "border-red-300" : "border-slate-200"}`}
                                />
                                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Apellido *</label>
                                <input
                                    type="text"
                                    value={data.apellido}
                                    onChange={(e) => setData("apellido", e.target.value)}
                                    placeholder="Apellido del cliente..."
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-400 transition ${errors.apellido ? "border-red-300" : "border-slate-200"}`}
                                />
                                {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
                                <input
                                    type="text"
                                    value={data.telefono}
                                    onChange={(e) => setData("telefono", e.target.value)}
                                    placeholder="Teléfono de contacto..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-400 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-400 transition ${errors.email ? "border-red-300" : "border-slate-200"}`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing} className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50">
                                    {processing ? "Guardando..." : editingCliente ? "Guardar" : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MODAL ELIMINAR */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {showDeleteModal && deletingCliente && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">¿Eliminar cliente?</h3>
                            <p className="text-slate-500 text-sm mb-1">Vas a eliminar a:</p>
                            <p className="font-medium text-slate-700 mb-4">{deletingCliente.nombre} {deletingCliente.apellido}</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">
                                    Cancelar
                                </button>
                                <button onClick={confirmDelete} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MODAL GESTIONAR VEHÍCULOS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {showVehiculosModal && vehiculosModalCliente && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowVehiculosModal(false)} />

                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    🚗 Vehículos de {vehiculosModalCliente.nombre}
                                </h2>
                                <p className="text-sm text-slate-500">Asocia, desasocia o crea vehículos</p>
                            </div>
                            <button
                                onClick={() => setShowVehiculosModal(false)}
                                className="p-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
                            {/* Vehículos actuales */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 mb-3">Vehículos asociados</h3>
                                {vehiculosModalCliente.vehiculos.length === 0 ? (
                                    <p className="text-sm text-slate-400">Sin vehículos asociados</p>
                                ) : (
                                    <div className="space-y-2">
                                        {vehiculosModalCliente.vehiculos.map((v) => (
                                            <div key={v.id} className="bg-slate-50 rounded-lg border border-slate-200 p-3 flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-slate-800">{v.patente}</p>
                                                    <p className="text-sm text-slate-500">{v.marca?.nombre} {v.modelo?.nombre} {v.anio && `(${v.anio})`}</p>
                                                </div>
                                                <button onClick={() => handleDetachVehicle(vehiculosModalCliente.id, v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Desasociar">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Crear nuevo vehículo */}
                            <div className="border-t border-slate-200 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-slate-700">Crear nuevo vehículo</h3>
                                    {!showNuevoVehiculo && (
                                        <button
                                            onClick={() => setShowNuevoVehiculo(true)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Nuevo
                                        </button>
                                    )}
                                </div>

                                {showNuevoVehiculo && (
                                    <form onSubmit={handleCreateVehiculo} className="bg-green-50 rounded-lg border border-green-200 p-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Patente *</label>
                                                <input
                                                    type="text"
                                                    value={nuevoVehiculo.patente}
                                                    onChange={(e) => setNuevoVehiculo(prev => ({ ...prev, patente: e.target.value.toUpperCase() }))}
                                                    placeholder="ABC123"
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-400 transition uppercase ${vehiculoErrors.patente ? "border-red-300" : "border-slate-200"}`}
                                                />
                                                {vehiculoErrors.patente && <p className="text-red-500 text-xs mt-1">{vehiculoErrors.patente}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Marca *</label>
                                                <Select
                                                    options={marcaOptions}
                                                    placeholder="Seleccionar..."
                                                    isClearable
                                                    value={marcaOptions.find(o => o.value === nuevoVehiculo.marca_id) || null}
                                                    onChange={(opt) => setNuevoVehiculo(prev => ({ ...prev, marca_id: opt?.value || null }))}
                                                    styles={selectStyles}
                                                />
                                                {vehiculoErrors.marca_id && <p className="text-red-500 text-xs mt-1">{vehiculoErrors.marca_id}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Modelo *</label>
                                                <Select
                                                    options={modeloOptions}
                                                    placeholder={loadingModelos ? "Cargando..." : "Seleccionar..."}
                                                    isClearable
                                                    isDisabled={!nuevoVehiculo.marca_id || loadingModelos}
                                                    value={modeloOptions.find(o => o.value === nuevoVehiculo.modelo_id) || null}
                                                    onChange={(opt) => setNuevoVehiculo(prev => ({ ...prev, modelo_id: opt?.value || null }))}
                                                    styles={selectStyles}
                                                />
                                                {vehiculoErrors.modelo_id && <p className="text-red-500 text-xs mt-1">{vehiculoErrors.modelo_id}</p>}
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Año (opcional)</label>
                                                <input
                                                    type="number"
                                                    value={nuevoVehiculo.anio}
                                                    onChange={(e) => setNuevoVehiculo(prev => ({ ...prev, anio: e.target.value }))}
                                                    placeholder="2024"
                                                    min="1900"
                                                    max="2100"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-400 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => { setShowNuevoVehiculo(false); resetNuevoVehiculo(); }}
                                                className="flex-1 py-2 px-3 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition text-sm"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={creatingVehiculo}
                                                className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition text-sm disabled:opacity-50"
                                            >
                                                {creatingVehiculo ? "Creando..." : "✓ Crear y asociar"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Vehículos disponibles */}
                            <div className="border-t border-slate-200 pt-4">
                                <h3 className="text-sm font-medium text-slate-700 mb-3">Vehículos existentes disponibles</h3>
                                {loadingVehiculos ? (
                                    <p className="text-sm text-slate-400">Cargando...</p>
                                ) : vehiculosDisponibles.length === 0 ? (
                                    <p className="text-sm text-slate-400">No hay vehículos disponibles para asociar</p>
                                ) : (
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {vehiculosDisponibles.map((v) => (
                                            <div key={v.id} className="bg-white rounded-lg border border-slate-200 p-3 flex items-center justify-between hover:bg-slate-50 transition">
                                                <div>
                                                    <p className="font-medium text-slate-800">{v.patente}</p>
                                                    <p className="text-sm text-slate-500">{v.marca?.nombre} {v.modelo?.nombre} {v.anio && `(${v.anio})`}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => handleAttachVehicle(v.id)} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition" title="Asociar a cliente">
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteVehicle(v.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition" title="Eliminar vehículo">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-100">
                            <button
                                onClick={() => setShowVehiculosModal(false)}
                                className="w-full py-2.5 px-4 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
