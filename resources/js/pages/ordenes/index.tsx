import React from "react";
import { Link, useForm } from "@inertiajs/react";

type Vehiculo = {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
};

type Titular = {
  id: number;
  nombre: string;
  apellido: string;
};

type TitularVehiculo = {
  id: number;
  titular: Titular | null;
  vehiculo: Vehiculo | null;
};

type Estado = {
  id: number;
  nombre: string;
};

type MedioDePago = {
  id: number;
  nombre: string;
};

type Orden = {
  id: number;
  fecha: string;
  observacion: string | null;
  titular_vehiculo: TitularVehiculo | null;
  estado: Estado;
  medio_de_pago: MedioDePago;
};

export default function Index({ ordenes }: { ordenes: Orden[] }) {
  const { delete: destroy } = useForm();

  function handleDelete(id: number) {
    if (confirm("¿Seguro que querés eliminar esta orden?")) {
      destroy(`/ordenes/${id}`);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Listado de Órdenes</h1>
        <Link
          href="/ordenes/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Nueva Orden
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ordenes.map((orden) => (
          <div
            key={orden.id}
            className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">
              Orden #{orden.id}
            </h2>

            {/* Titular */}
            <p>
              <span className="font-medium">🧑 Titular:</span>{" "}
              {orden.titular_vehiculo?.titular?.nombre ?? "Sin titular"}{" "}
              {orden.titular_vehiculo?.titular?.apellido ?? ""}
            </p>

            {/* Vehículo */}
            <p>
              <span className="font-medium">🚗 Vehículo:</span>{" "}
              {orden.titular_vehiculo?.vehiculo?.patente ?? "Sin patente"} -{" "}
              {orden.titular_vehiculo?.vehiculo?.marca ?? ""}{" "}
              {orden.titular_vehiculo?.vehiculo?.modelo ?? ""}
            </p>

            {/* Estado */}
            <p>
              <span className="font-medium">📌 Estado:</span>{" "}
              <span className="px-2 py-1 rounded text-white text-sm bg-blue-500">
                {orden.estado?.nombre ?? "-"}
              </span>
            </p>

            {/* Medio de Pago */}
            <p>
              <span className="font-medium">💳 Medio de Pago:</span>{" "}
              {orden.medio_de_pago?.nombre ?? "-"}
            </p>

            {/* Fecha */}
            <p>
              <span className="font-medium">📅 Fecha:</span>{" "}
              {new Date(orden.fecha).toLocaleDateString("es-AR")}
            </p>

            {/* Observación */}
            <p className="mt-2 text-gray-600 italic">
              {orden.observacion || "Sin observación"}
            </p>

            {/* Botones de acción */}
            <div className="mt-4 flex gap-2">
              <Link
                href={`/ordenes/${orden.id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                👁️ Ver
              </Link>
              <Link
                href={`/ordenes/${orden.id}/edit`}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
              >
                ✏️ Editar
              </Link>
              <button
                onClick={() => handleDelete(orden.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
