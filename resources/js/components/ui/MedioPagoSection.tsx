import React from "react";
import Select from "react-select";
import { DollarSign } from "lucide-react";

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

export default function MedioPagoSection({ mediosDePago, formData, setFormData, errors }: Props) {
  const options = mediosDePago.map((m) => ({
    value: m.id,
    label: m.nombre,
  }));

  const handleChange = (option: any) => {
    setFormData({
      ...formData,
      medio_de_pago_id: option ? option.value : null,
    });
  };

  return (
    <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold text-foreground">
          <DollarSign className="mr-2 h-7 w-7 text-primary" />
          Medio de Pago
        </h2>
      </div>

      {/* Select */}
      <div className="flex flex-col gap-1">
        <label className="text-lg font-medium text-foreground">Seleccionar medio de pago</label>
        <Select
          options={options}
          placeholder="Seleccioná un medio..."
          isClearable
          value={options.find((opt) => opt.value === formData.medio_de_pago_id) || null}
          onChange={handleChange}
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: "48px",
              borderRadius: "8px",
              fontSize: "16px",
              borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
              boxShadow: state.isFocused ? "0 0 0 2px rgba(37, 99, 235, 0.3)" : "none",
              "&:hover": { borderColor: "#2563eb" },
            }),
            option: (base, state) => ({
              ...base,
              fontSize: "16px",
              backgroundColor: state.isSelected
                ? "#2563eb"
                : state.isFocused
                ? "#e0e7ff"
                : "white",
              color: state.isSelected ? "white" : "black",
              cursor: "pointer",
            }),
          }}
        />
        {errors.medio_de_pago_id && (
          <p className="mt-1 text-base text-red-600">{errors.medio_de_pago_id}</p>
        )}
      </div>
    </div>
  );
}