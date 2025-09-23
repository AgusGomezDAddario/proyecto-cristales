import React from "react";
import { useForm } from "@inertiajs/react";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    titular_id: "",
    medio_de_pago_id: "",
    estado_id: "",
    fecha: "",
    observacion: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post("/ordenes");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">➕ Nueva Orden</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titular ID"
          value={data.titular_id}
          onChange={(e) => setData("titular_id", e.target.value)}
          className="border p-2 w-full"
        />
        {errors.titular_id && <p className="text-red-500">{errors.titular_id}</p>}

        <input
          type="text"
          placeholder="Medio de pago ID"
          value={data.medio_de_pago_id}
          onChange={(e) => setData("medio_de_pago_id", e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Estado ID"
          value={data.estado_id}
          onChange={(e) => setData("estado_id", e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="date"
          value={data.fecha}
          onChange={(e) => setData("fecha", e.target.value)}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Observación"
          value={data.observacion}
          onChange={(e) => setData("observacion", e.target.value)}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
