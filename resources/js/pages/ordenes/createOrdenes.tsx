import React, { useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import ClienteSection, { ClienteSectionRef } from "../../components/ClienteSection";
import VehiculoSection, { VehiculoSectionRef } from "../../components/ui/VehiculoSection";
import DetallesSection from "@/components/DetallesSection";
import EstadoSection from "../../components/EstadoSection";
import MedioPagoSection from "../../components/MedioPagoSection";

export default function CreateOrdenes({ titulares, estados, mediosDePago }: any) {
  const { data, setData, post, processing } = useForm({
    titular_id: null,
    nuevo_titular: null,
    vehiculo_id: null,
    nuevo_vehiculo: null,
    estado_id: null,
    medio_de_pago_id: null,
    observacion: "",
    fecha: "",
    detalles: [{ descripcion: "", valor: 0, cantidad: 1, colocacion_incluida: false }],
  });

  const clienteRef = useRef<ClienteSectionRef>(null);
  const vehiculoRef = useRef<VehiculoSectionRef>(null);

  // 🗓️ Fecha por defecto
  useEffect(() => {
    if (!data.fecha) {
      const hoy = new Date().toISOString().split("T")[0];
      setData("fecha", hoy);
    }
  }, []);

  // 🧩 Obtener vehículos del titular seleccionado
  const vehiculosDelTitular =
    titulares.find((t: any) => t.id === data.titular_id)?.vehiculos || [];

  // 🧼 Limpiar vehículo si cambia el titular seleccionado
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      vehiculo_id: null,
      nuevo_vehiculo: null,
    }));
  }, [data.titular_id]);

  // ✅ Validación global antes del POST
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clienteOk = clienteRef.current?.validate();
    if (!clienteOk) {
      toast.error("Por favor completá los datos del cliente.");
      return;
    }

    const vehiculoOk = vehiculoRef.current?.validate();
    if (!vehiculoOk) {
      toast.error("Por favor completá los datos del vehículo.");
      return;
    }

    post("/ordenes", {
      onError: (errors) => {
        const mensajes = Object.values(errors);
        if (mensajes.length > 0) {
          toast.error(mensajes.join("\n"));
        }
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-primary text-3xl">➕</span> Nueva Orden
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 👤 CLIENTE */}
        <ClienteSection
          ref={clienteRef}
          titulares={titulares}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
        />

        {/* 🚗 VEHÍCULO */}
        <VehiculoSection
          ref={vehiculoRef}
          vehiculos={vehiculosDelTitular}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
        />

        {/* 📄 ESTADO */}
        <EstadoSection
          estados={estados}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
          errors={{}}
        />

        {/* 💳 MEDIO DE PAGO */}
        <MedioPagoSection
          mediosDePago={mediosDePago}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
          errors={{}}
        />

        {/* 🧾 DETALLES */}
        <DetallesSection
          detalles={data.detalles}
          setDetalles={(nuevos) => setData("detalles", nuevos)}
        />

        {/* 🗒️ OBSERVACIÓN */}
        <div>
          <label className="block mb-1 font-medium text-lg">Observación</label>
          <textarea
            value={data.observacion}
            onChange={(e) => setData("observacion", e.target.value)}
            className="border rounded-md p-3 w-full text-lg focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Agregar alguna nota o aclaración..."
          />
        </div>

        {/* 🧷 BOTONES */}
        <div className="flex justify-between pt-4">
          <button
            type="submit"
            disabled={processing}
            className="px-5 py-3 rounded-lg bg-primary text-white text-lg font-semibold hover:bg-primary/90 transition"
          >
            Guardar Orden
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = "/ordenes")}
            className="px-5 py-3 rounded-lg bg-red-600 text-white text-lg font-semibold hover:bg-red-700 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
