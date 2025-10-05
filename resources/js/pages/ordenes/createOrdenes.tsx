import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import ClienteSection from "../../components/ClienteSection";
import VehiculoSection from "../../components/ui/VehiculoSection";
import DetallesSection from "@/components/DetallesSection";
import EstadoSection from "../../components/EstadoSection";
import MedioPagoSection from "../../components/MedioPagoSection";

interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
}

interface Titular {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  vehiculos?: Vehiculo[];
}

interface Estado {
  id: number;
  nombre: string;
}

interface MedioDePago {
  id: number;
  nombre: string;
}

interface Detalle {
  descripcion: string;
  valor: number;
  cantidad: number;
  colocacion_incluida: boolean;
}

interface FormData {
  titular_id: number | null;
  nuevo_titular: {
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string;
  } | null;
  nombreCliente: string;
  telefono: string;
  email: string;

  vehiculo_id: number | null;
  nuevo_vehiculo: {
    patente: string;
    marca: string;
    modelo: string;
    anio: number;
    color?: string;
  } | null;

  estado_id: number | null;
  medio_de_pago_id: number | null;

  observacion: string;
  fecha: string;
  detalles: Detalle[];
}

export default function CreateOrdenes({
  titulares,
  estados,
  mediosDePago,
}: {
  titulares: Titular[];
  estados: Estado[];
  mediosDePago: MedioDePago[];
}) {
  const { data, setData, post, processing, errors } = useForm<FormData>({
    titular_id: null,
    nuevo_titular: null,
    nombreCliente: "",
    telefono: "",
    email: "",

    vehiculo_id: null,
    nuevo_vehiculo: null,

    estado_id: null,
    medio_de_pago_id: null,

    observacion: "",
    fecha: "",

    detalles: [
      { descripcion: "", valor: 0, cantidad: 1, colocacion_incluida: false },
    ],
  });

  useEffect(() => {
    if (!data.fecha) {
      const hoy = new Date().toISOString().split("T")[0];
      setData("fecha", hoy);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/ordenes");
  };

  const handleCancel = () => {
    window.location.href = "/ordenes";
  };

  const vehiculosDelTitular =
    titulares.find((t) => t.id === data.titular_id)?.vehiculos || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">➕ Nueva Orden</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <ClienteSection
          titulares={titulares}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
          errors={errors as any}
        />

        {/* Vehículo */}
        <VehiculoSection
          vehiculos={vehiculosDelTitular}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
          errors={errors as any}
        />

        {/* Estado */}
        <EstadoSection
          estados={estados}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
          errors={errors as any}
        />

        {/* Medio de Pago */}
        <MedioPagoSection
          mediosDePago={mediosDePago}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
          errors={errors as any}
        />

        {/* Detalles */}
        <DetallesSection
          detalles={data.detalles}
          setDetalles={(nuevos) => setData("detalles", nuevos)}
        />

        {/* Observación */}
        <div>
          <label className="block mb-1 font-medium text-lg">Observación</label>
          <textarea
            value={data.observacion}
            onChange={(e) => setData("observacion", e.target.value)}
            className="border rounded-md p-3 w-full text-lg focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Agregar alguna nota o aclaración..."
          />
        </div>

        {/* Botones de acción */}
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
            onClick={handleCancel}
            className="px-5 py-3 rounded-lg bg-red-600 text-white text-lg font-semibold hover:bg-red-700 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
