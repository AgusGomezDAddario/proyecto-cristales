import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Calendar, Car, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface OT {
    id: number;
    fecha: string;
    estado: {
        id: number;
        nombre: string;
    };
    titular_vehiculo: {
        titular: {
            nombre: string;
            apellido: string;
        } | null;
        vehiculo: {
            patente: string;
            marca?: { nombre: string } | string;
            modelo?: { nombre: string } | string;
        } | null;
    } | null;
}

interface Estado {
    id: number;
    nombre: string;
}

interface Props {
    ots: OT[];
    estados: Estado[];
}

export default function OrdenesTaller({ ots, estados }: Props) {
    const [open, setOpen] = useState(false);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState<OT | null>(null);
    const [estadoId, setEstadoId] = useState<number | null>(null);

    const getNombre = (value?: { nombre: string } | string) => {
        if (!value) return '';
        return typeof value === 'string' ? value : value.nombre;
    };

    return (
        <DashboardLayout title="Órdenes de Trabajo Pendientes">
            <Head title="Órdenes de Trabajo - Taller" />

            {ots.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                        <Car className="h-8 w-8 text-purple-600" />
                    </div>
                    <h2 className="mb-2 text-xl font-bold text-gray-800">No hay órdenes pendientes</h2>
                    <p className="text-gray-500">Cuando ingresen nuevas órdenes de trabajo aparecerán acá.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {ots.map((ot) => (
                        <div
                            key={ot.id}
                            className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-purple-600">OT #{ot.id}</span>
                                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                                        {ot.estado.nombre}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(ot.fecha).toLocaleDateString('es-AR')}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <User className="h-4 w-4" />
                                    {ot.titular_vehiculo?.titular ? (
                                        <>
                                            {ot.titular_vehiculo.titular.nombre} {ot.titular_vehiculo.titular.apellido}
                                        </>
                                    ) : (
                                        <span className="text-gray-400 italic">Sin titular</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Car className="h-4 w-4" />
                                    {ot.titular_vehiculo?.vehiculo ? (
                                        <>
                                            {getNombre(ot.titular_vehiculo.vehiculo.marca)} {getNombre(ot.titular_vehiculo.vehiculo.modelo)} ·{' '}
                                            <span className="font-mono">{ot.titular_vehiculo.vehiculo.patente}</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-400 italic">Sin vehículo</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href={`/taller/ordenes/${ot.id}`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-purple-700"
                                >
                                    Ver orden
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <button
                                    onClick={() => {
                                        setOrdenSeleccionada(ot);
                                        setEstadoId(ot.estado.id);
                                        setOpen(true);
                                    }}
                                    className="inline-flex items-center rounded-xl border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-100"
                                >
                                    Cambiar estado
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {open && ordenSeleccionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-gray-900">Cambiar estado de OT #{ordenSeleccionada.id}</h3>

                        <select
                            value={estadoId ?? ''}
                            onChange={(e) => setEstadoId(Number(e.target.value))}
                            className="w-full rounded-lg border border-gray-300 p-2"
                        >
                            {estados.map((estado) => (
                                <option key={estado.id} value={estado.id}>
                                    {estado.nombre}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setOrdenSeleccionada(null);
                                    setEstadoId(null);
                                }}
                                className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={() => {
                                    if (!estadoId) {
                                        toast.error('Seleccioná un estado');
                                        return;
                                    }

                                    router.patch(
                                        `/taller/ordenes/${ordenSeleccionada.id}/estado`,
                                        { estado_id: estadoId },
                                        {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                toast.success('Estado actualizado correctamente');
                                                setOpen(false);
                                                setOrdenSeleccionada(null);
                                                setEstadoId(null);
                                            },
                                            onError: () => {
                                                toast.error('No se pudo actualizar el estado');
                                            },
                                        },
                                    );
                                }}
                                className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
