import React from "react";
import { useForm } from "@inertiajs/react";

type Orden = {
  id: number;
  titular_id: number;
  medio_de_pago_id: number;
  estado_id: number;
  fecha: string;
  observacion: string | null;
};

export default function Edit({ orden }: { orden: Orden }) {
  const { data, setData, put, processing, errors } = useForm({
    titular_id: orden.titular_id,
    medio_de_pago_id: orden.medio_de_pago_id,
    estado_id: orden.estado_id,
    fecha: orden.fecha, // viene como "YYYY-MM-DD HH:MM:SS"
    observacion: orden.observacion || "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    put(`/ordenes/${orden.id}`);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Editar Orden #{orden.id}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titular ID */}
        <input
          type="text"
          placeholder="Titular ID"
          value={data.titular_id}
          onChange={(e) => setData("titular_id", Number(e.target.value))}
          className="border p-2 w-full"
        />
        {errors.titular_id && (
          <p className="text-red-500">{errors.titular_id}</p>
        )}

        {/* Medio de Pago ID */}
        <input
          type="text"
          placeholder="Medio de Pago ID"
          value={data.medio_de_pago_id}
          onChange={(e) => setData("medio_de_pago_id", Number(e.target.value))}
          className="border p-2 w-full"
        />
        {errors.medio_de_pago_id && (
          <p className="text-red-500">{errors.medio_de_pago_id}</p>
        )}

        {/* Estado ID */}
        <input
          type="text"
          placeholder="Estado ID"
          value={data.estado_id}
          onChange={(e) => setData("estado_id", Number(e.target.value))}
          className="border p-2 w-full"
        />
        {errors.estado_id && (
          <p className="text-red-500">{errors.estado_id}</p>
        )}

        {/* Fecha */}
        <input
          type="date"
          value={data.fecha ? data.fecha.substring(0, 10) : ""}
          onChange={(e) => setData("fecha", e.target.value)}
          className="border p-2 w-full"
        />
        {errors.fecha && <p className="text-red-500">{errors.fecha}</p>}

        {/* Observación */}
        <textarea
          placeholder="Observación"
          value={data.observacion}
          onChange={(e) => setData("observacion", e.target.value)}
          className="border p-2 w-full"
        />
        {errors.observacion && (
          <p className="text-red-500">{errors.observacion}</p>
        )}

        {/* Botón */}
        <button
          type="submit"
          disabled={processing}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
        >
          Actualizar
        </button>
      </form>
    </div>
  );
}
