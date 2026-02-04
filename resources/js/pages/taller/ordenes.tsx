import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Car, User, ArrowRight } from 'lucide-react';
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
      marca: string;
      modelo: string;
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

  return (
    <DashboardLayout title="Órdenes de Trabajo Pendientes">
      <Head title="Órdenes de Trabajo - Taller" />

      {/* 👉 Si NO hay OTs */}
      {ots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <Car className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No hay órdenes pendientes
          </h2>
          <p className="text-gray-500">
            Cuando ingresen nuevas órdenes de trabajo aparecerán acá.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {ots.map((ot) => (
            <div
              key={ot.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Info principal */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-purple-600">
                    OT #{ot.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    {ot.estado.nombre}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(ot.fecha).toLocaleDateString('es-AR')}
                </div>

                {/* Titular */}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  {ot.titular_vehiculo?.titular ? (
                    <>
                      {ot.titular_vehiculo.titular.nombre}{' '}
                      {ot.titular_vehiculo.titular.apellido}
                    </>
                  ) : (
                    <span className="italic text-gray-400">Sin titular</span>
                  )}
                </div>

                {/* Vehículo */}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Car className="w-4 h-4" />
                  {ot.titular_vehiculo?.vehiculo ? (
                    <>
                      {ot.titular_vehiculo.vehiculo.marca}{' '}
                      {ot.titular_vehiculo.vehiculo.modelo} ·{' '}
                      <span className="font-mono">
                        {ot.titular_vehiculo.vehiculo.patente}
                      </span>
                    </>
                  ) : (
                    <span className="italic text-gray-400">Sin vehículo</span>
                  )}
                </div>
              </div>

              {/* Acción */}
              <div className="flex justify-end items-center gap-3">
                <Link
                  href={`/ordenes/${ot.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl 
                            bg-purple-600 text-white font-semibold
                            hover:bg-purple-700 transition shadow-sm"
                >
                  Ver orden
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => {
                    setOrdenSeleccionada(ot);
                    setEstadoId(ot.estado.id);
                    setOpen(true);
                  }}
                  className="inline-flex items-center px-5 py-2 rounded-xl
                            border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cambiar estado
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
      {open && ordenSeleccionada && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">

            <h3 className="text-lg font-bold text-gray-900">
              Cambiar estado de OT #{ordenSeleccionada.id}
            </h3>

            {/* Select de estados */}
            <select
              value={estadoId ?? ''}
              onChange={(e) => setEstadoId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
               {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.nombre}
                </option>
              ))}
            </select>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setOpen(false);
                  setOrdenSeleccionada(null);
                  setEstadoId(null);
                }}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
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
                    }
                  );
                }}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
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
