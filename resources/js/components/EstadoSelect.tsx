import React from "react";

interface Estado {
  id: number;
  nombre: string;
}

interface Props {
  estados: Estado[];
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function EstadoSelect({ estados, formData, setFormData, errors }: Props) {
  return (
    <div>
      <label className="block mb-1 font-medium">Estado</label>
      <select
        value={formData.estado_id ?? ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            estado_id: e.target.value ? Number(e.target.value) : null,
          })
        }
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
  );
}
