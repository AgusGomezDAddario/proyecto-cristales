import EditButton from '@/components/botones/boton-editar';
import DeleteButton from '@/components/botones/boton-eliminar';
import ViewButton from '@/components/botones/boton-ver';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type Vehiculo = {
    id: number;
    patente: string;
    marca?: { nombre: string }; // Ahora es objeto opcional
    modelo?: { nombre: string }; // Ahora es objeto opcional
    anio: number;
};

type Titular = {
    id: number;
    nombre: string;
    apellido: string;
};

type TitularVehiculo = {
    id: number;
    titular: Titular | null;
    vehiculo: Vehiculo | null;
};

type Estado = {
    id: number;
    nombre: string;
};

type MedioDePago = {
    id: number;
    nombre: string;
};

type Orden = {
    id: number;
    fecha: string;
    observacion: string | null;
    titular_vehiculo: TitularVehiculo | null;
    estado: Estado;
    medio_de_pago: MedioDePago;
};

type Filters = {
    q?: string;
    estado_id?: string | number;
    con_factura?: string | number; // "1" | "0"
    date_from?: string;
    date_to?: string;
    per_page?: number | string;
};

export default function Index({ ordenes }: { ordenes: any }) {
    const { delete: destroy } = useForm();

    /**
     * Requisitos para que esto funcione:
     * - El backend debe devolver:
     *   - filters: { q, estado_id, medio_pago_id, date_from, date_to, per_page }
     *   - estados: [{id, nombre}] (opcional pero recomendado)
     *   - mediosPago: [{id, nombre}] (opcional pero recomendado)
     */
    const page = usePage();
    const props = page.props as any;

    const backendFilters: Filters = props.filters || {};
    const estados: Estado[] = props.estados || [];
    // const mediosPago: MedioDePago[] = props.mediosPago || [];

    const [filters, setFilters] = useState<Required<Filters>>({
        q: backendFilters.q ?? '',
        estado_id: (backendFilters.estado_id ?? '') as any,
        con_factura: (backendFilters.con_factura ?? '') as any,
        date_from: backendFilters.date_from ?? '',
        date_to: backendFilters.date_to ?? '',
        per_page: (backendFilters.per_page ?? 10) as any,
    });

    const listaOrdenes: Orden[] = ordenes?.data || [];
    const links = ordenes?.links || [];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    function handleDelete(id: number) {
        if (confirm('¿Seguro que querés eliminar esta orden?')) {
            destroy(`/ordenes/${id}`);
        }
    }

    const todayISO = useMemo(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, []);

    const yesterdayISO = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, []);

    const last7FromISO = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - 6); // incluye hoy => 7 días
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, []);

    function applyFilters(next?: Partial<Filters>) {
        const payload = {
            ...filters,
            ...next,
        };

        // Limpieza: no mandar vacíos
        const cleaned: any = {};
        Object.entries(payload).forEach(([k, v]) => {
            if (v === null || v === undefined) return;
            if (typeof v === 'string' && v.trim() === '') return;
            cleaned[k] = v;
        });

        router.get('/ordenes', cleaned, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    function resetFilters() {
        setFilters({
            q: '',
            estado_id: '',
            // medio_pago_id: "",
            con_factura: '',
            date_from: '',
            date_to: '',
            per_page: 10,
        });

        router.get(
            '/ordenes',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    const returnUrl = `${window.location.pathname}${window.location.search}`;

    return (
        <DashboardLayout>
            <Head title="Órdenes de Trabajo" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Órdenes de Trabajo</h1>
                        <p className="mt-2 text-gray-600">Listado general de órdenes registradas</p>
                    </div>
                    <Link
                        href="/ordenes/create"
                        className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl"
                    >
                        + Nueva Orden
                    </Link>
                </div>

                {/* Filtros */}
                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                        {/* Búsqueda */}
                        <div className="md:col-span-4">
                            <label className="mb-1 block text-xs font-medium text-gray-600">Buscar (Patente / Titular)</label>
                            <input
                                value={filters.q}
                                onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') applyFilters();
                                }}
                                placeholder="Ej: EYZ529 o Gomez"
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-gray-400 focus:ring-gray-200"
                            />
                        </div>

                        {/* Estado */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-600">Estado</label>
                            <select
                                value={filters.estado_id as any}
                                onChange={(e) => setFilters((p) => ({ ...p, estado_id: e.target.value }))}
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-gray-400 focus:ring-gray-200"
                            >
                                <option value="">Todos</option>
                                {estados.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Medio de pago */}
                        {/* <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Medio de pago</label>
              <select
                value={filters.medio_pago_id as any}
                onChange={(e) => setFilters((p) => ({ ...p, medio_pago_id: e.target.value }))}
                className="w-full rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-sm"
              >
                <option value="">Todos</option>
                {mediosPago.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div> */}

                        {/* Factura */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-600">Factura</label>
                            <select
                                value={filters.con_factura as any}
                                onChange={(e) => setFilters((p) => ({ ...p, con_factura: e.target.value }))}
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-gray-400 focus:ring-gray-200"
                            >
                                <option value="">Todas</option>
                                <option value="1">Con factura</option>
                                <option value="0">Sin factura</option>
                            </select>
                        </div>

                        {/* Fecha desde */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-600">Desde</label>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => setFilters((p) => ({ ...p, date_from: e.target.value }))}
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-gray-400 focus:ring-gray-200"
                            />
                        </div>

                        {/* Fecha hasta */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-600">Hasta</label>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) => setFilters((p) => ({ ...p, date_to: e.target.value }))}
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-gray-400 focus:ring-gray-200"
                            />
                        </div>

                        {/* Acciones */}
                        <div className="mt-2 flex flex-col gap-3 md:col-span-12 md:flex-row md:items-end">
                            {/* Presets rápidos */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => applyFilters({ date_from: todayISO, date_to: todayISO })}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    Hoy
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyFilters({ date_from: yesterdayISO, date_to: yesterdayISO })}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    Ayer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyFilters({ date_from: last7FromISO, date_to: todayISO })}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    Últimos 7 días
                                </button>
                            </div>

                            <div className="flex-1" />

                            {/* Per page */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Filas</span>
                                <select
                                    value={filters.per_page as any}
                                    onChange={(e) => setFilters((p) => ({ ...p, per_page: Number(e.target.value) }))}
                                    className="rounded-lg border-gray-300 text-sm focus:border-gray-400 focus:ring-gray-200"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => applyFilters()}
                                className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-black"
                            >
                                Aplicar
                            </button>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition hover:bg-gray-50"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                    {listaOrdenes.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                            </div>
                            <p className="mb-2 text-lg font-semibold text-gray-500">No hay órdenes registradas</p>
                            <p className="mb-4 text-sm text-gray-400">Probá ajustando los filtros o crea una orden</p>
                            <Link
                                href="/ordenes/create"
                                className="mt-2 inline-block rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white transition hover:bg-green-700"
                            >
                                Crear ahora →
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-gray-200 bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Fecha</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Titular
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Vehículo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Medio de Pago
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {listaOrdenes.map((orden: Orden) => (
                                            <tr key={orden.id} className="transition hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{formatDate(orden.fecha)}</td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    {orden.titular_vehiculo?.titular
                                                        ? `${orden.titular_vehiculo.titular.nombre} ${orden.titular_vehiculo.titular.apellido}`
                                                        : 'Sin titular'}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                                                    {orden.titular_vehiculo?.vehiculo
                                                        ? `${orden.titular_vehiculo.vehiculo.patente} - ${orden.titular_vehiculo.vehiculo.marca?.nombre || ''} ${orden.titular_vehiculo.vehiculo.modelo?.nombre || ''}`
                                                        : 'Sin vehículo'}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                    <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                                        {orden.estado?.nombre ?? '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">{'Ver detalle'}</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                    <div className="flex justify-end gap-2">
                                                        <ViewButton
                                                            onClick={() =>
                                                                router.visit(`/ordenes/${orden.id}?return=${encodeURIComponent(returnUrl)}`)
                                                            }
                                                        />
                                                        {orden.estado?.nombre !== 'Finalizada' && (
                                                            <EditButton
                                                                onClick={() =>
                                                                    router.visit(`/ordenes/${orden.id}/edit?return=${encodeURIComponent(returnUrl)}`)
                                                                }
                                                            />
                                                        )}
                                                        {orden.estado?.nombre !== 'Finalizada' && (
                                                            <DeleteButton onClick={() => handleDelete(orden.id)} />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {links.length > 0 && (
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-6 py-4">
                                    <div className="text-sm text-gray-600">
                                        Mostrando <span className="font-medium text-gray-900">{ordenes.from ?? 0}</span> a{' '}
                                        <span className="font-medium text-gray-900">{ordenes.to ?? 0}</span> de{' '}
                                        <span className="font-medium text-gray-900">{ordenes.total ?? 0}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {links.map((l: any, idx: number) => {
                                            const label = String(l.label).replace('&laquo;', '«').replace('&raquo;', '»');

                                            if (!l.url) {
                                                return (
                                                    <span
                                                        key={idx}
                                                        className="cursor-not-allowed rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400"
                                                    >
                                                        {label}
                                                    </span>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={idx}
                                                    href={l.url}
                                                    preserveScroll
                                                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                                                        l.active
                                                            ? 'border-gray-900 bg-gray-900 text-white'
                                                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
