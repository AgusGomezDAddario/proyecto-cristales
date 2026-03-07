import EditButton from '@/components/botones/boton-editar';
import DeleteButton from '@/components/botones/boton-eliminar';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, ChevronRight, Layers, Package, Plus, Search, Tag, X, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Articulo = { id: number; nombre: string; categorias_count: number };
type Categoria = { id: number; articulo_id: number; nombre: string; obligatoria: boolean; subcategorias_count: number };
type Subcategoria = { id: number; categoria_id: number; nombre: string };
type PageProps = {
    articulos: {
        data: Articulo[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { search?: string };
    stats: { total: number; con_categorias: number; sin_categorias: number };
};

export default function ArticulosIndex({ articulos, filters, stats }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showArticuloModal, setShowArticuloModal] = useState(false);
    const [editingArticulo, setEditingArticulo] = useState<Articulo | null>(null);
    const [showDeleteArticuloModal, setShowDeleteArticuloModal] = useState(false);
    const [deletingArticulo, setDeletingArticulo] = useState<Articulo | null>(null);
    const [selectedArticulo, setSelectedArticulo] = useState<Articulo | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [showCategoriaModal, setShowCategoriaModal] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
    const [showDeleteCategoriaModal, setShowDeleteCategoriaModal] = useState(false);
    const [deletingCategoria, setDeletingCategoria] = useState<Categoria | null>(null);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
    const [showSubcategoriaModal, setShowSubcategoriaModal] = useState(false);
    const [editingSubcategoria, setEditingSubcategoria] = useState<Subcategoria | null>(null);
    const [showDeleteSubcategoriaModal, setShowDeleteSubcategoriaModal] = useState(false);
    const [deletingSubcategoria, setDeletingSubcategoria] = useState<Subcategoria | null>(null);

    const {
        data: articuloData,
        setData: setArticuloData,
        post: postArticulo,
        put: putArticulo,
        processing: processingArticulo,
        errors: articuloErrors,
        reset: resetArticulo,
    } = useForm({ nombre: '' });
    const {
        data: categoriaData,
        setData: setCategoriaData,
        processing: processingCategoria,
        errors: categoriaErrors,
        reset: resetCategoria,
    } = useForm({ nombre: '', obligatoria: false });
    const {
        data: subcategoriaData,
        setData: setSubcategoriaData,
        processing: processingSubcategoria,
        errors: subcategoriaErrors,
        reset: resetSubcategoria,
    } = useForm({ nombre: '' });

    useEffect(() => {
        const timer = setTimeout(() => applyFilters(), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = () => {
        const params: Record<string, any> = { search: search || undefined };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        router.get('/articulos', params, { preserveState: true, preserveScroll: true });
    };
    const clearFilters = () => {
        setSearch('');
        router.get('/articulos');
    };

    const openCreateArticuloModal = () => {
        resetArticulo();
        setEditingArticulo(null);
        setShowArticuloModal(true);
    };
    const openEditArticuloModal = (articulo: Articulo) => {
        setEditingArticulo(articulo);
        setArticuloData({ nombre: articulo.nombre });
        setShowArticuloModal(true);
    };
    const closeArticuloModal = () => {
        setShowArticuloModal(false);
        setEditingArticulo(null);
        resetArticulo();
    };
    const handleArticuloSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingArticulo) putArticulo(`/articulos/${editingArticulo.id}`, { onSuccess: closeArticuloModal });
        else postArticulo('/articulos', { onSuccess: closeArticuloModal });
    };
    const openDeleteArticuloModal = (articulo: Articulo) => {
        setDeletingArticulo(articulo);
        setShowDeleteArticuloModal(true);
    };
    const confirmDeleteArticulo = () => {
        if (deletingArticulo)
            router.delete(`/articulos/${deletingArticulo.id}`, {
                onSuccess: () => {
                    setShowDeleteArticuloModal(false);
                    setDeletingArticulo(null);
                },
            });
    };

    const openCategoriasPanel = async (articulo: Articulo) => {
        setSelectedArticulo(articulo);
        setSelectedCategoria(null);
        setSubcategorias([]);
        const response = await fetch(`/articulos/${articulo.id}/categorias`);
        const data = await response.json();
        setCategorias(data.categorias);
    };
    const closeCategoriasPanel = () => {
        setSelectedArticulo(null);
        setCategorias([]);
        setSelectedCategoria(null);
        setSubcategorias([]);
    };
    const openCreateCategoriaModal = () => {
        resetCategoria();
        setEditingCategoria(null);
        setShowCategoriaModal(true);
    };
    const openEditCategoriaModal = (categoria: Categoria) => {
        setEditingCategoria(categoria);
        setCategoriaData({ nombre: categoria.nombre, obligatoria: categoria.obligatoria });
        setShowCategoriaModal(true);
    };
    const closeCategoriaModal = () => {
        setShowCategoriaModal(false);
        setEditingCategoria(null);
        resetCategoria();
    };
    const handleCategoriaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategoria)
            router.put(`/categorias/${editingCategoria.id}`, categoriaData, {
                onSuccess: () => {
                    closeCategoriaModal();
                    if (selectedArticulo) openCategoriasPanel(selectedArticulo);
                },
            });
        else
            router.post(`/articulos/${selectedArticulo?.id}/categorias`, categoriaData, {
                onSuccess: () => {
                    closeCategoriaModal();
                    if (selectedArticulo) openCategoriasPanel(selectedArticulo);
                },
            });
    };
    const openDeleteCategoriaModal = (categoria: Categoria) => {
        setDeletingCategoria(categoria);
        setShowDeleteCategoriaModal(true);
    };
    const confirmDeleteCategoria = () => {
        if (deletingCategoria)
            router.delete(`/categorias/${deletingCategoria.id}`, {
                onSuccess: () => {
                    setShowDeleteCategoriaModal(false);
                    setDeletingCategoria(null);
                    if (selectedArticulo) openCategoriasPanel(selectedArticulo);
                },
            });
    };

    const openSubcategoriasPanel = async (categoria: Categoria) => {
        setSelectedCategoria(categoria);
        const response = await fetch(`/categorias/${categoria.id}/subcategorias`);
        const data = await response.json();
        setSubcategorias(data.subcategorias);
    };
    const openCreateSubcategoriaModal = () => {
        resetSubcategoria();
        setEditingSubcategoria(null);
        setShowSubcategoriaModal(true);
    };
    const openEditSubcategoriaModal = (subcategoria: Subcategoria) => {
        setEditingSubcategoria(subcategoria);
        setSubcategoriaData({ nombre: subcategoria.nombre });
        setShowSubcategoriaModal(true);
    };
    const closeSubcategoriaModal = () => {
        setShowSubcategoriaModal(false);
        setEditingSubcategoria(null);
        resetSubcategoria();
    };
    const handleSubcategoriaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSubcategoria)
            router.put(`/subcategorias/${editingSubcategoria.id}`, subcategoriaData, {
                onSuccess: () => {
                    closeSubcategoriaModal();
                    if (selectedCategoria) openSubcategoriasPanel(selectedCategoria);
                },
            });
        else
            router.post(`/categorias/${selectedCategoria?.id}/subcategorias`, subcategoriaData, {
                onSuccess: () => {
                    closeSubcategoriaModal();
                    if (selectedCategoria) openSubcategoriasPanel(selectedCategoria);
                },
            });
    };
    const openDeleteSubcategoriaModal = (subcategoria: Subcategoria) => {
        setDeletingSubcategoria(subcategoria);
        setShowDeleteSubcategoriaModal(true);
    };
    const confirmDeleteSubcategoria = () => {
        if (deletingSubcategoria)
            router.delete(`/subcategorias/${deletingSubcategoria.id}`, {
                onSuccess: () => {
                    setShowDeleteSubcategoriaModal(false);
                    setDeletingSubcategoria(null);
                    if (selectedCategoria) openSubcategoriasPanel(selectedCategoria);
                },
            });
    };

    return (
        <DashboardLayout>
            <Head title="Catálogo de Artículos" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">📦 Catálogo de Artículos</h1>
                    <p className="mt-1 text-slate-500">Gestiona artículos, categorías y subcategorías para las órdenes de trabajo</p>
                </div>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                                <p className="text-sm text-slate-500">Total artículos</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-50 p-2">
                                <Layers className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stats.con_categorias}</p>
                                <p className="text-sm text-slate-500">Con categorías</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-50 p-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stats.sin_categorias}</p>
                                <p className="text-sm text-slate-500">Sin categorías</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="🔍 Buscar artículo..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm text-slate-700 transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                        />
                                    </div>
                                    {search && (
                                        <button
                                            onClick={clearFilters}
                                            className="rounded-lg bg-slate-200 p-2 text-white transition hover:bg-slate-300"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={openCreateArticuloModal}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar Artículo
                                </button>
                            </div>
                            <div className="max-h-[600px] divide-y divide-slate-100 overflow-y-auto">
                                {articulos.data.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <p className="text-sm text-slate-400">No hay artículos registrados</p>
                                    </div>
                                ) : (
                                    articulos.data.map((articulo) => (
                                        <div
                                            key={articulo.id}
                                            className={`cursor-pointer p-4 transition hover:bg-slate-50 ${selectedArticulo?.id === articulo.id ? 'border-l-4 border-blue-500 bg-blue-50' : ''}`}
                                            onClick={() => openCategoriasPanel(articulo)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-800">{articulo.nombre}</p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {articulo.categorias_count} categoría{articulo.categorias_count !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <EditButton onClick={() => openEditArticuloModal(articulo)} />
                                                    <DeleteButton onClick={() => openDeleteArticuloModal(articulo)} />
                                                    <ChevronRight className="h-5 w-5 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {articulos.last_page > 1 && (
                                <div className="flex justify-center gap-1 border-t border-slate-100 px-4 py-3">
                                    {articulos.links.map((link, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`rounded px-3 py-1.5 text-sm font-medium transition ${link.active ? 'bg-slate-800 text-white' : link.url ? 'text-slate-600 hover:bg-slate-100' : 'cursor-not-allowed text-slate-300'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        {selectedArticulo ? (
                            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-100 bg-blue-50 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Layers className="h-5 w-5 text-blue-600" />
                                            <h3 className="font-semibold text-slate-800">Categorías</h3>
                                        </div>
                                        <button onClick={closeCategoriasPanel} className="rounded p-1 text-white transition hover:bg-slate-300">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="mb-3 text-sm text-slate-600">{selectedArticulo.nombre}</p>
                                    <button
                                        onClick={openCreateCategoriaModal}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Agregar Categoría
                                    </button>
                                </div>
                                <div className="max-h-[540px] divide-y divide-slate-100 overflow-y-auto">
                                    {categorias.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <p className="text-sm text-slate-400">Sin categorías</p>
                                        </div>
                                    ) : (
                                        categorias.map((categoria) => (
                                            <div
                                                key={categoria.id}
                                                className={`cursor-pointer p-4 transition hover:bg-slate-50 ${selectedCategoria?.id === categoria.id ? 'border-l-4 border-green-500 bg-green-50' : ''}`}
                                                onClick={() => openSubcategoriasPanel(categoria)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-slate-800">{categoria.nombre}</p>
                                                            {categoria.obligatoria ? (
                                                                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                                                    Obligatoria
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                                    Opcional
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {categoria.subcategorias_count} subcategoría
                                                            {categoria.subcategorias_count !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <EditButton onClick={() => openEditCategoriaModal(categoria)} />
                                                        <DeleteButton onClick={() => openDeleteCategoriaModal(categoria)} />
                                                        <ChevronRight className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                                <Layers className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                                <p className="text-sm text-slate-400">Seleccioná un artículo para ver sus categorías</p>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        {selectedCategoria ? (
                            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-100 bg-green-50 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-5 w-5 text-green-600" />
                                            <h3 className="font-semibold text-slate-800">Subcategorías</h3>
                                        </div>
                                        <button
                                            onClick={() => setSelectedCategoria(null)}
                                            className="rounded p-1 text-white transition hover:bg-slate-300"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="mb-3 text-sm text-slate-600">{selectedCategoria.nombre}</p>
                                    <button
                                        onClick={openCreateSubcategoriaModal}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Agregar Subcategoría
                                    </button>
                                </div>
                                <div className="max-h-[540px] divide-y divide-slate-100 overflow-y-auto">
                                    {subcategorias.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <p className="text-sm text-slate-400">Sin subcategorías</p>
                                        </div>
                                    ) : (
                                        subcategorias.map((subcategoria) => (
                                            <div key={subcategoria.id} className="p-4 transition hover:bg-slate-50">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-slate-800">{subcategoria.nombre}</p>
                                                    <div className="flex gap-1">
                                                        <EditButton onClick={() => openEditSubcategoriaModal(subcategoria)} />
                                                        <DeleteButton onClick={() => openDeleteSubcategoriaModal(subcategoria)} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                                <Tag className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                                <p className="text-sm text-slate-400">Seleccioná una categoría para ver sus subcategorías</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showArticuloModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeArticuloModal} />
                    <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl duration-150 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-800">{editingArticulo ? '✏️ Editar Artículo' : '➕ Nuevo Artículo'}</h2>
                            <button onClick={closeArticuloModal} className="rounded-lg bg-slate-500 p-1.5 text-white transition hover:bg-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleArticuloSubmit} className="space-y-5 p-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre *</label>
                                <input
                                    type="text"
                                    value={articuloData.nombre}
                                    onChange={(e) => setArticuloData('nombre', e.target.value)}
                                    placeholder="Ej: Parabrisas"
                                    maxLength={100}
                                    className={`w-full rounded-lg border px-4 py-2.5 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${articuloErrors.nombre ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {articuloErrors.nombre && <p className="mt-1 text-sm text-red-500">{articuloErrors.nombre}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeArticuloModal}
                                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingArticulo}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processingArticulo ? 'Guardando...' : editingArticulo ? 'Guardar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteArticuloModal && deletingArticulo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowDeleteArticuloModal(false)} />
                    <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl duration-150 animate-in fade-in zoom-in-95">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-slate-800">¿Eliminar artículo?</h3>
                            <p className="mb-1 text-sm text-slate-500">Vas a eliminar:</p>
                            <p className="mb-4 font-medium text-slate-700">{deletingArticulo.nombre}</p>
                            <p className="mb-4 text-sm text-amber-600">⚠️ Se eliminarán también todas sus categorías y subcategorías</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteArticuloModal(false)}
                                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteArticulo}
                                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCategoriaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeCategoriaModal} />
                    <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl duration-150 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {editingCategoria ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
                            </h2>
                            <button onClick={closeCategoriaModal} className="rounded-lg bg-slate-500 p-1.5 text-white transition hover:bg-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCategoriaSubmit} className="space-y-5 p-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre *</label>
                                <input
                                    type="text"
                                    value={categoriaData.nombre}
                                    onChange={(e) => setCategoriaData('nombre', e.target.value)}
                                    placeholder="Ej: Color"
                                    maxLength={100}
                                    className={`w-full rounded-lg border px-4 py-2.5 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${categoriaErrors.nombre ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {categoriaErrors.nombre && <p className="mt-1 text-sm text-red-500">{categoriaErrors.nombre}</p>}
                            </div>
                            <div>
                                <label className="mb-3 block text-sm font-medium text-slate-700">¿Es obligatoria? *</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCategoriaData('obligatoria', true)}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${categoriaData.obligatoria ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <CheckCircle className={`h-4 w-4 ${categoriaData.obligatoria ? 'text-red-600' : 'text-slate-400'}`} />
                                        Sí, obligatoria
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCategoriaData('obligatoria', false)}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${!categoriaData.obligatoria ? 'border-slate-400 bg-slate-50 text-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <XCircle className={`h-4 w-4 ${!categoriaData.obligatoria ? 'text-slate-600' : 'text-slate-400'}`} />
                                        No, opcional
                                    </button>
                                </div>
                                {categoriaErrors.obligatoria && <p className="mt-1 text-sm text-red-500">{categoriaErrors.obligatoria}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeCategoriaModal}
                                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingCategoria}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processingCategoria ? 'Guardando...' : editingCategoria ? 'Guardar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteCategoriaModal && deletingCategoria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowDeleteCategoriaModal(false)} />
                    <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl duration-150 animate-in fade-in zoom-in-95">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-slate-800">¿Eliminar categoría?</h3>
                            <p className="mb-1 text-sm text-slate-500">Vas a eliminar:</p>
                            <p className="mb-4 font-medium text-slate-700">{deletingCategoria.nombre}</p>
                            <p className="mb-4 text-sm text-amber-600">⚠️ Se eliminarán también todas sus subcategorías</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteCategoriaModal(false)}
                                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteCategoria}
                                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSubcategoriaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeSubcategoriaModal} />
                    <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl duration-150 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {editingSubcategoria ? '✏️ Editar Subcategoría' : '➕ Nueva Subcategoría'}
                            </h2>
                            <button
                                onClick={closeSubcategoriaModal}
                                className="rounded-lg bg-slate-500 p-1.5 text-white transition hover:bg-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubcategoriaSubmit} className="space-y-5 p-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre *</label>
                                <input
                                    type="text"
                                    value={subcategoriaData.nombre}
                                    onChange={(e) => setSubcategoriaData('nombre', e.target.value)}
                                    placeholder="Ej: Verde"
                                    maxLength={100}
                                    className={`w-full rounded-lg border px-4 py-2.5 transition focus:border-green-400 focus:ring-2 focus:ring-green-100 ${subcategoriaErrors.nombre ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {subcategoriaErrors.nombre && <p className="mt-1 text-sm text-red-500">{subcategoriaErrors.nombre}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeSubcategoriaModal}
                                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingSubcategoria}
                                    className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processingSubcategoria ? 'Guardando...' : editingSubcategoria ? 'Guardar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteSubcategoriaModal && deletingSubcategoria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowDeleteSubcategoriaModal(false)} />
                    <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl duration-150 animate-in fade-in zoom-in-95">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-slate-800">¿Eliminar subcategoría?</h3>
                            <p className="mb-1 text-sm text-slate-500">Vas a eliminar:</p>
                            <p className="mb-4 font-medium text-slate-700">{deletingSubcategoria.nombre}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteSubcategoriaModal(false)}
                                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteSubcategoria}
                                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600"
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
