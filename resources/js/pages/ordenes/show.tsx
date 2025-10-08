import React from "react";
import { Link } from "@inertiajs/react";

type Orden = {
  id: number;
  fecha: string;
  observacion: string | null;
  estado: { nombre: string };
  titular: { nombre: string; apellido: string };
  medio_de_pago: { nombre: string };
};

export default function Show({ orden }: { orden: Orden }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📄 Orden #{orden.id}</h1>
      <p>
        Titular: {orden.titular.nombre} {orden.titular.apellido}
      </p>
      <p>Estado: {orden.estado.nombre}</p>
      <p>Medio de pago: {orden.medio_de_pago.nombre}</p>
      <p>Fecha: {new Date(orden.fecha).toLocaleDateString("es-AR")}</p>
      <p>Observación: {orden.observacion || "Sin observación"}</p>

      <Link href="/ordenes" className="text-blue-600 underline mt-4 inline-block">
        ⬅️ Volver
      </Link>
    </div>
  );
}
