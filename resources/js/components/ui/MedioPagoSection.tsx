import React from "react";

interface MedioPago {
  id: number;
  nombre: string;
}

interface Props {
  mediosDePago: MedioPago[];
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function MedioPagoSection({ mediosDePago, formData, setFormData, errors }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        Medio de Pago
      </label>
      <select
        value={formData.medio_de_pago_id ?? ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            medio_de_pago_id: e.target.value ? Number(e.target.value) : null,
          })
        }
        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white outline-none transition text-gray-900 font-medium ${
          errors.medio_de_pago_id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <option value="" className="text-gray-500">Seleccione un medio...</option>
        {mediosDePago.map((m) => (
          <option key={m.id} value={m.id} className="text-gray-900">
            {m.nombre}
          </option>
        ))}
      </select>

      {errors.medio_de_pago_id && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errors.medio_de_pago_id}
        </p>
      )}
    </div>
  );
}
