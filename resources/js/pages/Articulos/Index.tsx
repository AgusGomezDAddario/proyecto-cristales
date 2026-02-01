import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
    Search, Plus, X, AlertTriangle, Package, Layers, Tag, 
    ChevronRight, Edit2, Trash2, CheckCircle, XCircle
} from "lucide-react";

type Articulo = { id: number; nombre: string; categorias_count: number; };
type Categoria = { id: number; articulo_id: number; nombre: string; obligatoria: boolean; subcategorias_count: number; };
type Subcategoria = { id: number; categoria_id: number; nombre: string; };
type PageProps = {
    articulos: { data: Articulo[]; current_page: number; last_page: number; total: number; links: Array<{ url: string | null; label: string; active: boolean }>; };
    filters: { search?: string };
    stats: { total: number; con_categorias: number; sin_categorias: number; };
};

export default function ArticulosIndex({ articulos, filters, stats }: PageProps) {
    const [search, setSearch] = useState(filters.search || "");
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

    const { data: articuloData, setData: setArticuloData, post: postArticulo, put: putArticulo, processing: processingArticulo, errors: articuloErrors, reset: resetArticulo } = useForm({ nombre: "" });
    const { data: categoriaData, setData: setCategoriaData, processing: processingCategoria, errors: categoriaErrors, reset: resetCategoria } = useForm({ nombre: "", obligatoria: false });
    const { data: subcategoriaData, setData: setSubcategoriaData, processing: processingSubcategoria, errors: subcategoriaErrors, reset: resetSubcategoria } = useForm({ nombre: "" });

    useEffect(() => { const timer = setTimeout(() => applyFilters(), 300); return () => clearTimeout(timer); }, [search]);

    const applyFilters = () => {
        const params: Record<string, any> = { search: search || undefined };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        router.get("/articulos", params, { preserveState: true, preserveScroll: true });
    };
    const clearFilters = () => { setSearch(""); router.get("/articulos"); };
    
    const openCreateArticuloModal = () => { resetArticulo(); setEditingArticulo(null); setShowArticuloModal(true); };
    const openEditArticuloModal = (articulo: Articulo) => { setEditingArticulo(articulo); setArticuloData({ nombre: articulo.nombre }); setShowArticuloModal(true); };
    const closeArticuloModal = () => { setShowArticuloModal(false); setEditingArticulo(null); resetArticulo(); };
    const handleArticuloSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingArticulo) putArticulo(`/articulos/${editingArticulo.id}`, { onSuccess: closeArticuloModal });
        else postArticulo("/articulos", { onSuccess: closeArticuloModal });
    };
    const openDeleteArticuloModal = (articulo: Articulo) => { setDeletingArticulo(articulo); setShowDeleteArticuloModal(true); };
    const confirmDeleteArticulo = () => { if (deletingArticulo) router.delete(`/articulos/${deletingArticulo.id}`, { onSuccess: () => { setShowDeleteArticuloModal(false); setDeletingArticulo(null); } }); };

    const openCategoriasPanel = async (articulo: Articulo) => {
        setSelectedArticulo(articulo); setSelectedCategoria(null); setSubcategorias([]);
        const response = await fetch(`/articulos/${articulo.id}/categorias`);
        const data = await response.json();
        setCategorias(data.categorias);
    };
    const closeCategoriasPanel = () => { setSelectedArticulo(null); setCategorias([]); setSelectedCategoria(null); setSubcategorias([]); };
    const openCreateCategoriaModal = () => { resetCategoria(); setEditingCategoria(null); setShowCategoriaModal(true); };
    const openEditCategoriaModal = (categoria: Categoria) => { setEditingCategoria(categoria); setCategoriaData({ nombre: categoria.nombre, obligatoria: categoria.obligatoria }); setShowCategoriaModal(true); };
    const closeCategoriaModal = () => { setShowCategoriaModal(false); setEditingCategoria(null); resetCategoria(); };
    const handleCategoriaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategoria) router.put(`/categorias/${editingCategoria.id}`, categoriaData, { onSuccess: () => { closeCategoriaModal(); if (selectedArticulo) openCategoriasPanel(selectedArticulo); } });
        else router.post(`/articulos/${selectedArticulo?.id}/categorias`, categoriaData, { onSuccess: () => { closeCategoriaModal(); if (selectedArticulo) openCategoriasPanel(selectedArticulo); } });
    };
    const openDeleteCategoriaModal = (categoria: Categoria) => { setDeletingCategoria(categoria); setShowDeleteCategoriaModal(true); };
    const confirmDeleteCategoria = () => { if (deletingCategoria) router.delete(`/categorias/${deletingCategoria.id}`, { onSuccess: () => { setShowDeleteCategoriaModal(false); setDeletingCategoria(null); if (selectedArticulo) openCategoriasPanel(selectedArticulo); } }); };

    const openSubcategoriasPanel = async (categoria: Categoria) => {
        setSelectedCategoria(categoria);
        const response = await fetch(`/categorias/${categoria.id}/subcategorias`);
        const data = await response.json();
        setSubcategorias(data.subcategorias);
    };
    const openCreateSubcategoriaModal = () => { resetSubcategoria(); setEditingSubcategoria(null); setShowSubcategoriaModal(true); };
    const openEditSubcategoriaModal = (subcategoria: Subcategoria) => { setEditingSubcategoria(subcategoria); setSubcategoriaData({ nombre: subcategoria.nombre }); setShowSubcategoriaModal(true); };
    const closeSubcategoriaModal = () => { setShowSubcategoriaModal(false); setEditingSubcategoria(null); resetSubcategoria(); };
    const handleSubcategoriaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSubcategoria) router.put(`/subcategorias/${editingSubcategoria.id}`, subcategoriaData, { onSuccess: () => { closeSubcategoriaModal(); if (selectedCategoria) openSubcategoriasPanel(selectedCategoria); } });
        else router.post(`/categorias/${selectedCategoria?.id}/subcategorias`, subcategoriaData, { onSuccess: () => { closeSubcategoriaModal(); if (selectedCategoria) openSubcategoriasPanel(selectedCategoria); } });
    };
    const openDeleteSubcategoriaModal = (subcategoria: Subcategoria) => { setDeletingSubcategoria(subcategoria); setShowDeleteSubcategoriaModal(true); };
    const confirmDeleteSubcategoria = () => { if (deletingSubcategoria) router.delete(`/subcategorias/${deletingSubcategoria.id}`, { onSuccess: () => { setShowDeleteSubcategoriaModal(false); setDeletingSubcategoria(null); if (selectedCategoria) openSubcategoriasPanel(selectedCategoria); } }); };

    return (
        <DashboardLayout>
            <Head title="Catálogo de Artículos" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">📦 Catálogo de Artículos</h1>
                    <p className="text-slate-500 mt-1">Gestiona artículos, categorías y subcategorías para las órdenes de trabajo</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg"><Package className="h-5 w-5 text-blue-600" /></div>
                            <div><p className="text-2xl font-bold text-slate-800">{stats.total}</p><p className="text-sm text-slate-500">Total artículos</p></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg"><Layers className="h-5 w-5 text-green-600" /></div>
                            <div><p className="text-2xl font-bold text-slate-800">{stats.con_categorias}</p><p className="text-sm text-slate-500">Con categorías</p></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
                            <div><p className="text-2xl font-bold text-slate-800">{stats.sin_categorias}</p><p className="text-sm text-slate-500">Sin categorías</p></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className="p-4 border-b border-slate-100">
                                <div className="flex gap-2 items-center mb-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input type="text" placeholder="🔍 Buscar artículo..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition text-sm" />
                                    </div>
                                    {search && <button onClick={clearFilters} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"><X className="h-4 w-4" /></button>}
                                </div>
                                <button onClick={openCreateArticuloModal} className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition shadow-sm text-sm"><Plus className="h-4 w-4" />Agregar Artículo</button>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                                {articulos.data.length === 0 ? (
                                    <div className="text-center py-12"><p className="text-slate-400 text-sm">No hay artículos registrados</p></div>
                                ) : (
                                    articulos.data.map((articulo) => (
                                        <div key={articulo.id} className={`p-4 hover:bg-slate-50 transition cursor-pointer ${selectedArticulo?.id === articulo.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`} onClick={() => openCategoriasPanel(articulo)}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-800">{articulo.nombre}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{articulo.categorias_count} categoría{articulo.categorias_count !== 1 ? 's' : ''}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={(e) => { e.stopPropagation(); openEditArticuloModal(articulo); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 className="h-4 w-4" /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); openDeleteArticuloModal(articulo); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="h-4 w-4" /></button>
                                                    <ChevronRight className="h-5 w-5 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {articulos.last_page > 1 && (
                                <div className="px-4 py-3 border-t border-slate-100 flex justify-center gap-1">
                                    {articulos.links.map((link, idx) => (
                                        <button key={idx} onClick={() => link.url && router.get(link.url)} disabled={!link.url} className={`px-3 py-1.5 rounded text-sm font-medium transition ${link.active ? "bg-slate-800 text-white" : link.url ? "text-slate-600 hover:bg-slate-100" : "text-slate-300 cursor-not-allowed"}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        {selectedArticulo ? (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="p-4 border-b border-slate-100 bg-blue-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2"><Layers className="h-5 w-5 text-blue-600" /><h3 className="font-semibold text-slate-800">Categorías</h3></div>
                                        <button onClick={closeCategoriasPanel} className="p-1 hover:bg-slate-200 rounded transition"><X className="h-4 w-4" /></button>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{selectedArticulo.nombre}</p>
                                    <button onClick={openCreateCategoriaModal} className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"><Plus className="h-4 w-4" />Agregar Categoría</button>
                                </div>
                                <div className="divide-y divide-slate-100 max-h-[540px] overflow-y-auto">
                                    {categorias.length === 0 ? (
                                        <div className="text-center py-12"><p className="text-slate-400 text-sm">Sin categorías</p></div>
                                    ) : (
                                        categorias.map((categoria) => (
                                            <div key={categoria.id} className={`p-4 hover:bg-slate-50 transition cursor-pointer ${selectedCategoria?.id === categoria.id ? 'bg-green-50 border-l-4 border-green-500' : ''}`} onClick={() => openSubcategoriasPanel(categoria)}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-slate-800">{categoria.nombre}</p>
                                                            {categoria.obligatoria ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Obligatoria</span> : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Opcional</span>}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1">{categoria.subcategorias_count} subcategoría{categoria.subcategorias_count !== 1 ? 's' : ''}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={(e) => { e.stopPropagation(); openEditCategoriaModal(categoria); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 className="h-4 w-4" /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); openDeleteCategoriaModal(categoria); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="h-4 w-4" /></button>
                                                        <ChevronRight className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center"><Layers className="h-12 w-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm">Seleccioná un artículo para ver sus categorías</p></div>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        {selectedCategoria ? (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="p-4 border-b border-slate-100 bg-green-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2"><Tag className="h-5 w-5 text-green-600" /><h3 className="font-semibold text-slate-800">Subcategorías</h3></div>
                                        <button onClick={() => setSelectedCategoria(null)} className="p-1 hover:bg-slate-200 rounded transition"><X className="h-4 w-4" /></button>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{selectedCategoria.nombre}</p>
                                    <button onClick={openCreateSubcategoriaModal} className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"><Plus className="h-4 w-4" />Agregar Subcategoría</button>
                                </div>
                                <div className="divide-y divide-slate-100 max-h-[540px] overflow-y-auto">
                                    {subcategorias.length === 0 ? (
                                        <div className="text-center py-12"><p className="text-slate-400 text-sm">Sin subcategorías</p></div>
                                    ) : (
                                        subcategorias.map((subcategoria) => (
                                            <div key={subcategoria.id} className="p-4 hover:bg-slate-50 transition">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-slate-800">{subcategoria.nombre}</p>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => openEditSubcategoriaModal(subcategoria)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 className="h-4 w-4" /></button>
                                                        <button onClick={() => openDeleteSubcategoriaModal(subcategoria)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="h-4 w-4" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center"><Tag className="h-12 w-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm">Seleccioná una categoría para ver sus subcategorías</p></div>
                        )}
                    </div>
                </div>
            </div>

            {showArticuloModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeArticuloModal} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">{editingArticulo ? "✏️ Editar Artículo" : "➕ Nuevo Artículo"}</h2>
                            <button onClick={closeArticuloModal} className="p-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleArticuloSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre *</label>
                                <input type="text" value={articuloData.nombre} onChange={(e) => setArticuloData("nombre", e.target.value)} placeholder="Ej: Parabrisas" maxLength={100} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition ${articuloErrors.nombre ? "border-red-300" : "border-slate-200"}`} />
                                {articuloErrors.nombre && <p className="text-red-500 text-sm mt-1">{articuloErrors.nombre}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeArticuloModal} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">Cancelar</button>
                                <button type="submit" disabled={processingArticulo} className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50">{processingArticulo ? "Guardando..." : editingArticulo ? "Guardar" : "Crear"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteArticuloModal && deletingArticulo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowDeleteArticuloModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="h-6 w-6 text-red-500" /></div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">¿Eliminar artículo?</h3>
                            <p className="text-slate-500 text-sm mb-1">Vas a eliminar:</p>
                            <p className="font-medium text-slate-700 mb-4">{deletingArticulo.nombre}</p>
                            <p className="text-amber-600 text-sm mb-4">⚠️ Se eliminarán también todas sus categorías y subcategorías</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteArticuloModal(false)} className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">Cancelar</button>
                                <button onClick={confirmDeleteArticulo} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">🗑️ Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCategoriaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeCategoriaModal} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">{editingCategoria ? "✏️ Editar Categoría" : "➕ Nueva Categoría"}</h2>
                            <button onClick={closeCategoriaModal} className="p-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleCategoriaSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre *</label>
                                <input type="text" value={categoriaData.nombre} onChange={(e) => setCategoriaData("nombre", e.target.value)} placeholder="Ej: Color" maxLength={100} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition ${categoriaErrors.nombre ? "border-red-300" : "border-slate-200"}`} />
                                {categoriaErrors.nombre && <p className="text-red-500 text-sm mt-1">{categoriaErrors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">¿Es obligatoria? *</label>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setCategoriaData("obligatoria", true)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition font-medium text-sm ${categoriaData.obligatoria ? "bg-red-50 border-red-400 text-red-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}><CheckCircle className={`h-4 w-4 ${categoriaData.obligatoria ? "text-red-600" : "text-slate-400"}`} />Sí, obligatoria</button>
                                    <button type="button" onClick={() => setCategoriaData("obligatoria", false)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition font-medium text-sm ${!categoriaData.obligatoria ? "bg-slate-50 border-slate-400 text-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}><XCircle className={`h-4 w-4 ${!categoriaData.obligatoria ? "text-slate-600" : "text-slate-400"}`} />No, opcional</button>
                                </div>
                                {categoriaErrors.obligatoria && <p className="text-red-500 text-sm mt-1">{categoriaErrors.obligatoria}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeCategoriaModal} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">Cancelar</button>
                                <button type="submit" disabled={processingCategoria} className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50">{processingCategoria ? "Guardando..." : editingCategoria ? "Guardar" : "Crear"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteCategoriaModal && deletingCategoria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowDeleteCategoriaModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="h-6 w-6 text-red-500" /></div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">¿Eliminar categoría?</h3>
                            <p className="text-slate-500 text-sm mb-1">Vas a eliminar:</p>
                            <p className="font-medium text-slate-700 mb-4">{deletingCategoria.nombre}</p>
                            <p className="text-amber-600 text-sm mb-4">⚠️ Se eliminarán también todas sus subcategorías</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteCategoriaModal(false)} className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">Cancelar</button>
                                <button onClick={confirmDeleteCategoria} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">🗑️ Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSubcategoriaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeSubcategoriaModal} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">{editingSubcategoria ? "✏️ Editar Subcategoría" : "➕ Nueva Subcategoría"}</h2>
                            <button onClick={closeSubcategoriaModal} className="p-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubcategoriaSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre *</label>
                                <input type="text" value={subcategoriaData.nombre} onChange={(e) => setSubcategoriaData("nombre", e.target.value)} placeholder="Ej: Verde" maxLength={100} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-400 transition ${subcategoriaErrors.nombre ? "border-red-300" : "border-slate-200"}`} />
                                {subcategoriaErrors.nombre && <p className="text-red-500 text-sm mt-1">{subcategoriaErrors.nombre}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeSubcategoriaModal} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">Cancelar</button>
                                <button type="submit" disabled={processingSubcategoria} className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50">{processingSubcategoria ? "Guardando..." : editingSubcategoria ? "Guardar" : "Crear"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteSubcategoriaModal && deletingSubcategoria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowDeleteSubcategoriaModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="h-6 w-6 text-red-500" /></div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">¿Eliminar subcategoría?</h3>
                            <p className="text-slate-500 text-sm mb-1">Vas a eliminar:</p>
                            <p className="font-medium text-slate-700 mb-4">{deletingSubcategoria.nombre}</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteSubcategoriaModal(false)} className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">Cancelar</button>
                                <button onClick={confirmDeleteSubcategoria} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition">🗑️ Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
