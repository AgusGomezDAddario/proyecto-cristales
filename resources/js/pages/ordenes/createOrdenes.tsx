import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-hot-toast';

import ClienteSection, { ClienteSectionRef } from '@/components/ui/ClienteSection';
import DetallesSection, { Detalle } from '@/components/ui/DetallesSection';
import EstadoSection from '@/components/ui/EstadoSection';
import MedioPagoSection from '@/components/ui/MedioPagoSection';
import VehiculoSection, { VehiculoSectionRef } from '@/components/ui/VehiculoSection';
import DashboardLayout from '@/layouts/DashboardLayout';

type TipoDocumento = 'OT' | 'FC';

type CatalogItem = { id: number; nombre: string };

type FormData = {
    // Header negocio
    tipo_documento: TipoDocumento;
    numero_orden: string;
    compania_seguro_id: number | null;
    es_garantia: boolean;
    fecha_entrega_estimada: string;

    // Cliente / Vehículo
    titular_id: number | null;
    nuevo_titular: any | null;
    vehiculo_id: number | null;
    nuevo_vehiculo: any | null;

    // Orden
    estado_id: number | null;
    pagos: any[];
    observacion: string;
    fecha: string;

    // Detalles
    detalles: Detalle[];
    numero_orden_manual: boolean;
};

type Props = {
    titulares: any[];
    estados: any[];
    mediosDePago: any[];
    articulos?: any[]; // tipalo si ya tenés DTO definido en DetallesSection
    companiasSeguros?: CatalogItem[];
};

export default function CreateOrdenes({ titulares, estados, mediosDePago, articulos = [], companiasSeguros = [] }: Props) {
    const generarNumeroOrden = (tipo: TipoDocumento) => {
        const prefix = tipo === 'OT' ? 'OT' : 'FC';
        const suffix = Date.now().toString().slice(-6);
        return `${prefix}-${suffix}`;
    };

    // Detalle inicial alineado a tu Detalle (incluye articulo_id y atributos)
    const detalleInicial: Detalle = {
        articulo_id: null,
        descripcion: '',
        valor: 0 as any, // si tu Detalle.valor es number -> dejalo en 0 (sin "as any")
        cantidad: 1,
        colocacion_incluida: false,
        atributos: [] as any, // si tu Detalle.atributos es {} u otro tipo, ajustá acá
    } as Detalle;

    // 1) Initial values tipados
    const initialValues: FormData = {
        tipo_documento: 'OT',
        numero_orden: '',
        compania_seguro_id: null,
        es_garantia: false,
        fecha_entrega_estimada: '',

        titular_id: null,
        nuevo_titular: null,
        vehiculo_id: null,
        nuevo_vehiculo: null,

        estado_id: null,
        pagos: [],
        observacion: '',
        fecha: '',
        numero_orden_manual: false,

        detalles: [detalleInicial], // o tu objeto literal
    };

    // 2) useForm SIN genérico (evita TS2589)
    const form = useForm(initialValues as any);

    // 3) Tipos controlados (sin inferencia “infinita”)
    const data = form.data as FormData;
    const setData = form.setData;
    const post = form.post;
    const processing = form.processing;
    const errors = form.errors as Record<string, string>;

    const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
        setData((prev: any) => ({ ...prev, [key]: value }));
    };

    type UiErrors = Record<string, string>;

    // “Aplanamos” errores de Inertia a un diccionario simple para la UI
    const uiErrors: UiErrors = errors as unknown as UiErrors;

    const clienteRef = useRef<ClienteSectionRef>(null);
    const vehiculoRef = useRef<VehiculoSectionRef>(null);

    // Merge setter (evita pisadas por closure con "data")
    const mergeForm = (patch: Partial<FormData>) => {
        setData((prev: FormData) => ({ ...prev, ...patch }));
    };

    // Defaults iniciales: fecha + numero_orden
    useEffect(() => {
        const hoy = new Date().toISOString().split('T')[0];

        setData((prev: FormData) => ({
            ...prev,
            fecha: prev.fecha || hoy,
            numero_orden: prev.numero_orden || generarNumeroOrden(prev.tipo_documento),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Recalcular número al cambiar OT/FC (si querés NO pisarlo cuando el usuario lo edita, te lo ajusto)
    useEffect(() => {
        setData((prev: FormData) => ({
            ...prev,
            numero_orden: generarNumeroOrden(prev.tipo_documento),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.tipo_documento]);

    // Vehículos del titular seleccionado
    const vehiculosDelTitular = titulares.find((t: any) => t.id === data.titular_id)?.vehiculos || [];

    // Limpiar vehículo si cambia titular
    useEffect(() => {
        setData((prev: FormData) => ({
            ...prev,
            vehiculo_id: null,
            nuevo_vehiculo: null,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.titular_id]);

    useEffect(() => {
        setData((prev: FormData) => {
            if (prev.numero_orden_manual) return prev;
            return {
                ...prev,
                numero_orden: generarNumeroOrden(prev.tipo_documento),
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.tipo_documento]);

    const totalOrden = useMemo(() => {
        return (data.detalles || []).reduce((acc: number, curr: any) => {
            return acc + (Number(curr.valor) || 0) * (Number(curr.cantidad) || 1);
        }, 0);
    }, [data.detalles]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const clienteOk = clienteRef.current?.validate();
        if (!clienteOk) return toast.error('Por favor completá los datos del cliente.');

        const vehiculoOk = vehiculoRef.current?.validate();
        if (!vehiculoOk) return toast.error('Por favor completá los datos del vehículo.');

        // Validación negocio mínima (front)
        if (!data.fecha_entrega_estimada) {
            return toast.error('Por favor completá la fecha de entrega estimada.');
        }
        if (data.fecha && data.fecha_entrega_estimada < data.fecha) {
            return toast.error('La fecha de entrega estimada no puede ser anterior a la fecha.');
        }

        // Agregar con_factura al enviar (el backend lo espera)
        const dataToSend = {
            ...data,
            con_factura: data.tipo_documento === 'FC',
        };

        router.post('/ordenes', dataToSend as any, {
            onError: (errs) => {
                const mensajes = Object.values(errs as Record<string, string>);
                if (mensajes.length > 0) toast.error(mensajes.join('\n'));
            },
        });
    };

    const tituloPantalla = data.tipo_documento === 'FC' ? 'Nueva Orden con Factura' : 'Nueva Orden de Trabajo';

    return (
        <DashboardLayout>
            <Head title={tituloPantalla} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 shadow-lg">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{tituloPantalla}</h1>
                            <p className="mt-1 text-gray-600">Completá los datos necesarios antes de guardar</p>
                        </div>
                    </div>
                </div>

                {/* Card principal */}
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Tipo documento OT/FC + número + garantía */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-800">Tipo de documento *</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setField("tipo_documento", "OT")}
                                            className={`flex-1 rounded-xl border px-4 py-3 font-bold transition ${data.tipo_documento === 'OT'
                                                ? 'border-green-600 bg-green-600 text-white'
                                                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            Sin factura (OT)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setField('tipo_documento', 'FC')}
                                            className={`flex-1 rounded-xl border px-4 py-3 font-bold transition ${data.tipo_documento === 'FC'
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            Con factura (FC)
                                        </button>
                                    </div>
                                    {(errors as any).tipo_documento && <p className="mt-2 text-sm text-red-600">{(errors as any).tipo_documento}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-800">Número de orden *</label>
                                    <input
                                        type="text"
                                        value={data.numero_orden}
                                        onChange={(e) => {
                                            setData((prev: FormData) => ({
                                                ...prev,
                                                numero_orden: e.target.value,
                                                numero_orden_manual: true,
                                            }));
                                        }}
                                        className={`w-full rounded-xl border-2 bg-gray-50 px-4 py-3 font-medium text-gray-900 transition outline-none ${(errors as any).numero_orden ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="OT-000000 / FC-000000"
                                    />
                                    {(errors as any).numero_orden && <p className="mt-2 text-sm text-red-600">{(errors as any).numero_orden}</p>}
                                </div>

                                <div className="flex items-center gap-3 pt-7">
                                    <input
                                        id="es_garantia"
                                        type="checkbox"
                                        checked={!!data.es_garantia}
                                        onChange={(e) => setField('es_garantia', e.target.checked)}
                                        className="h-5 w-5"
                                    />
                                    <label htmlFor="es_garantia" className="text-sm font-semibold text-gray-800">
                                        Es garantía
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Fecha + entrega estimada */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">Fecha *</label>
                                <input
                                    type="date"
                                    value={data.fecha}
                                    onChange={(e) => setField('fecha', e.target.value)}
                                    className={`w-full rounded-xl border-2 bg-gray-50 px-4 py-3 ... ${uiErrors.fecha ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                                {(errors as any).fecha && <p className="mt-2 text-sm text-red-600">{(errors as any).fecha}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">Fecha de entrega estimada *</label>
                                <input
                                    type="date"
                                    value={data.fecha_entrega_estimada}
                                    min={data.fecha || undefined}
                                    onChange={(e) => setField('fecha_entrega_estimada', e.target.value)}
                                    className={`w-full rounded-xl border-2 bg-gray-50 px-4 py-3 ... ${uiErrors.fecha_entrega_estimada ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                                {(errors as any).fecha_entrega_estimada && (
                                    <p className="mt-2 text-sm text-red-600">{(errors as any).fecha_entrega_estimada}</p>
                                )}
                            </div>
                        </div>

                        {/* Compañía de seguros */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-800">Compañía de seguros</label>
                            <select
                                value={data.compania_seguro_id ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value ? Number(e.target.value) : null;

                                    setData((prev: FormData) => ({
                                        ...prev,
                                        compania_seguro_id: value,
                                    }));
                                }}
                                className={`w-full rounded-xl border-2 bg-gray-50 px-4 py-3 font-medium text-gray-900 transition outline-none ${(errors as any).compania_seguro_id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <option value="">Sin seguro / Particular</option>
                                {companiasSeguros.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>

                            {(errors as any).compania_seguro_id && <p className="mt-2 text-sm text-red-600">{(errors as any).compania_seguro_id}</p>}
                        </div>

                        {/* Cliente y Vehículo */}
                        <ClienteSection ref={clienteRef} titulares={titulares} formData={data} setFormData={(nd: any) => mergeForm(nd)} />

                        <VehiculoSection ref={vehiculoRef} vehiculos={vehiculosDelTitular} formData={data} setFormData={(nd: any) => mergeForm(nd)} />

                        {/* Detalles (fix TS2589: setDetalles con updater y casteo controlado) */}
                        <DetallesSection
                            detalles={data.detalles}
                            articulos={articulos}
                            errors={uiErrors}
                            setDetalles={(nuevos: Detalle[]) => {
                                setData((prev: FormData) => ({
                                    ...prev,
                                    detalles: nuevos,
                                }));
                            }}
                        />

                        {/* Medio de Pago */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                            <MedioPagoSection
                                mediosDePago={mediosDePago}
                                formData={data}
                                setFormData={(nd: any) => mergeForm(nd)}
                                errors={errors as Record<string, string>}
                                totalOrden={totalOrden}
                            />
                        </div>

                        {/* Estado */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <EstadoSection
                                estados={estados}
                                formData={data}
                                setFormData={(nd: any) => mergeForm(nd)}
                                errors={errors as Record<string, string>}
                            />
                        </div>

                        {/* Observación */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-800">Observación</label>
                            <textarea
                                value={data.observacion}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setData((prev: FormData) => ({
                                        ...prev,
                                        observacion: value,
                                    }));
                                }}
                                placeholder="Agregar alguna nota o aclaración..."
                                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-4 font-medium text-gray-800 transition outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 border-t border-gray-200 pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 transform rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-green-600 hover:to-green-700 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : '💾 Guardar Orden'}
                            </button>

                            <Link
                                href="/ordenes"
                                className="rounded-xl border-2 border-gray-300 px-8 py-3.5 text-center font-bold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 hover:shadow"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
