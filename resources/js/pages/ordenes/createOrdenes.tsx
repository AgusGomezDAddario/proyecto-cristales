import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import ClienteSection from "../../components/ClienteSection";
import VehiculoSection from "../../components/ui/VehiculoSection";
import EstadoSelect from "../../components/EstadoSelect";
import MedioPagoSelect from "../../components/MedioPagoSelect";

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
  });

  // precargar fecha actual
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

  // vehículos del titular seleccionado
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
        <EstadoSelect
          estados={estados}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
          errors={errors as any}
        />

        {/* Medio de Pago */}
        <MedioPagoSelect
          mediosDePago={mediosDePago}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
          errors={errors as any}
        />

        {/* Observación */}
        <div>
          <label className="block mb-1 font-medium">Observación</label>
          <textarea
            value={data.observacion}
            onChange={(e) => setData("observacion", e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
        >
          Guardar Orden
        </button>
      </form>
    </div>
  );
}
