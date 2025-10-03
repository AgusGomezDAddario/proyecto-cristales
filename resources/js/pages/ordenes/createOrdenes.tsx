import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import ClienteSection from "../../components/ClienteSection";

interface Titular {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

interface Estado {
  id: number;
  nombre: string;
}

interface MedioDePago {
  id: number;
  nombre: string;
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
  const { data, setData, post, processing, errors } = useForm({
    // Titular
    titular_id: "",
    nuevo_titular: null as null | {
      nombre: string;
      apellido: string;
      telefono: string;
      email?: string;
    },
    nombreCliente: "",
    telefono: "",
    email: "",

    // Vehículo (solo acá, no duplicado)
    vehiculo_id: "",
    nuevo_vehiculo: null as null | {
      patente: string;
      marca: string;
      modelo: string;
      anio: number;
      color?: string;
    },

    // Estado y pago
    estado_id: "",
    medio_de_pago_id: "",

    // Orden
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

  // autofill rápido con titular + vehículo
  const autofill = () => {
    setData({
      ...data,
      // Titular
      titular_id: "",
      nuevo_titular: {
        nombre: "Cliente",
        apellido: "Demo",
        telefono: "099999999",
        email: "demo@ejemplo.com",
      },
      nombreCliente: "Cliente Demo",
      telefono: "099999999",
      email: "demo@ejemplo.com",

      // Vehículo
      vehiculo_id: "",
      nuevo_vehiculo: {
        patente: "ABC123",
        marca: "Toyota",
        modelo: "Corolla",
        anio: 2020,
        color: "Rojo",
      },

      // Estado y pago
      estado_id: estados[0]?.id.toString() || "",
      medio_de_pago_id: mediosDePago[0]?.id.toString() || "",

      // Orden
      observacion: "Orden de prueba generada automáticamente",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Enviando data:", data);
    post("/ordenes");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">➕ Nueva Orden</h1>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={autofill}
          className="rounded-md bg-emerald-600 px-3 py-2 text-white"
        >
          Autofill Demo
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <ClienteSection
          titulares={titulares}
          formData={data}
          setFormData={(newData: any) => setData({ ...data, ...newData })}
          errors={errors as any}
        />

        {/* Vehículo */}
        {data.nuevo_vehiculo && (
          <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">🚗 Datos del Vehículo</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Patente</label>
                <input
                  type="text"
                  value={data.nuevo_vehiculo.patente}
                  onChange={(e) =>
                    setData("nuevo_vehiculo", {
                      ...data.nuevo_vehiculo!,
                      patente: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-medium">Marca</label>
                <input
                  type="text"
                  value={data.nuevo_vehiculo.marca}
                  onChange={(e) =>
                    setData("nuevo_vehiculo", {
                      ...data.nuevo_vehiculo!,
                      marca: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-medium">Modelo</label>
                <input
                  type="text"
                  value={data.nuevo_vehiculo.modelo}
                  onChange={(e) =>
                    setData("nuevo_vehiculo", {
                      ...data.nuevo_vehiculo!,
                      modelo: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-medium">Año</label>
                <input
                  type="number"
                  value={data.nuevo_vehiculo.anio}
                  onChange={(e) =>
                    setData("nuevo_vehiculo", {
                      ...data.nuevo_vehiculo!,
                      anio: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-medium">Color</label>
                <input
                  type="text"
                  value={data.nuevo_vehiculo.color || ""}
                  onChange={(e) =>
                    setData("nuevo_vehiculo", {
                      ...data.nuevo_vehiculo!,
                      color: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Estado y Pago */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Estado</label>
            <select
              value={data.estado_id}
              onChange={(e) => setData("estado_id", e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Seleccionar...</option>
              {estados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
            {errors.estado_id && <p className="text-red-600">{errors.estado_id}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Medio de Pago</label>
            <select
              value={data.medio_de_pago_id}
              onChange={(e) => setData("medio_de_pago_id", e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Seleccionar...</option>
              {mediosDePago.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
            {errors.medio_de_pago_id && <p className="text-red-600">{errors.medio_de_pago_id}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Observación</label>
            <textarea
              value={data.observacion}
              onChange={(e) => setData("observacion", e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
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
