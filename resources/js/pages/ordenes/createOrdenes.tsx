import React, { useEffect, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import ClienteSection, { ClienteSectionRef } from "@/components/ui/ClienteSection";
import VehiculoSection, { VehiculoSectionRef } from "@/components/ui/VehiculoSection";
import DetallesSection from "@/components/ui/DetallesSection";
import EstadoSection from "@/components/ui/EstadoSection";
import MedioPagoSection from "@/components/ui/MedioPagoSection";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function CreateOrdenes({ titulares, estados, mediosDePago }: any) {
  const { data, setData, post, processing, errors } = useForm({
    titular_id: null,
    nuevo_titular: null,
    vehiculo_id: null,
    nuevo_vehiculo: null,
    estado_id: null,
    medio_de_pago_id: null,
    observacion: "",
    fecha: "",
    detalles: [{ descripcion: "", valor: "", cantidad: 1, colocacion_incluida: false }],
  });

  const clienteRef = useRef<ClienteSectionRef>(null);
  const vehiculoRef = useRef<VehiculoSectionRef>(null);

  // Fecha por defecto
  useEffect(() => {
    if (!data.fecha) {
      const hoy = new Date().toISOString().split("T")[0];
      setData("fecha", hoy);
    }
  }, []);

  // Vehículos del titular seleccionado
  const vehiculosDelTitular =
    titulares.find((t: any) => t.id === data.titular_id)?.vehiculos || [];

  // Limpiar vehículo si cambia titular
  useEffect(() => {
    setData((prev) => ({ ...prev, vehiculo_id: null, nuevo_vehiculo: null }));
  }, [data.titular_id]);

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clienteOk = clienteRef.current?.validate();
    if (!clienteOk) return toast.error("Por favor completá los datos del cliente.");
    const vehiculoOk = vehiculoRef.current?.validate();
    if (!vehiculoOk) return toast.error("Por favor completá los datos del vehículo.");

    post("/ordenes", {
      onError: (errs) => {
        const mensajes = Object.values(errs as Record<string, string>);
        if (mensajes.length > 0) toast.error(mensajes.join("\n"));
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title="Nueva Orden de Trabajo" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nueva Orden de Trabajo</h1>
              <p className="text-gray-600 mt-1">Completá los datos necesarios antes de guardar</p>
            </div>
          </div>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Fecha *</label>
              <input
                type="date"
                value={data.fecha}
                onChange={(e) => setData("fecha", e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-900 font-medium ${
                  errors.fecha ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {errors.fecha && <p className="mt-2 text-sm text-red-600">{errors.fecha}</p>}
            </div>

            {/* Cliente y Vehículo */}
            <ClienteSection
              ref={clienteRef}
              titulares={titulares}
              formData={data}
              setFormData={(nd: any) => setData({ ...data, ...nd })}
            />

            <VehiculoSection
              ref={vehiculoRef}
              vehiculos={vehiculosDelTitular}
              formData={data}
              setFormData={(nd: any) => setData({ ...data, ...nd })}
            />

            {/* Estado y Medio de Pago en grilla */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EstadoSection
                estados={estados}
                formData={data}
                setFormData={(nd: any) => setData({ ...data, ...nd })}
                errors={errors as Record<string, string>}
              />
              <MedioPagoSection
                mediosDePago={mediosDePago}
                formData={data}
                setFormData={(nd: any) => setData({ ...data, ...nd })}
                errors={errors as Record<string, string>}
              />
            </div>

            {/* Detalles */}
            <DetallesSection
              detalles={data.detalles}
              setDetalles={(nuevos) => setData("detalles", nuevos)}
            />

            {/* Observación */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Observación</label>
              <textarea
                value={data.observacion}
                onChange={(e) => setData("observacion", e.target.value)}
                placeholder="Agregar alguna nota o aclaración..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition outline-none text-gray-800 font-medium"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {processing ? "Guardando..." : "💾 Guardar Orden"}
              </button>

              <Link
                href="/ordenes"
                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-center shadow-sm hover:shadow"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Tip informativo */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Completá todos los datos del cliente y vehículo
              antes de guardar la orden. Los campos marcados con * son obligatorios.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
