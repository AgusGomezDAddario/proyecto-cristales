import React from "react";

interface MedioDePago {
  id: number;
  nombre: string;
}

interface Props {
  mediosDePago: MedioDePago[];
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function MedioPagoSelect({ mediosDePago, formData, setFormData, errors }: Props) {
  return (
    <div>
      <label className="block mb-1 font-medium">Medio de Pago</label>
      <select
        value={formData.medio_de_pago_id ?? ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            medio_de_pago_id: e.target.value ? Number(e.target.value) : null,
          })
        }
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
  );
}
