import { User, Phone, Mail, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Select from "react-select";

interface Titular {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

interface Props {
  titulares: Titular[];
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function ClienteSection({
  titulares,
  formData,
  setFormData,
  errors,
}: Props) {
  const [showNew, setShowNew] = useState(false);
  const [nuevoTitular, setNuevoTitular] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  });

  const options = titulares.map((t) => ({
    value: t.id,
    label: `${t.nombre} ${t.apellido}`,
    telefono: t.telefono,
    email: t.email,
  }));

  const handleSelect = (option: any) => {
    if (!option) {
      setFormData({
        ...formData,
        titular_id: "",
        nombreCliente: "",
        telefono: "",
        email: "",
        nuevo_titular: null,
      });
      return;
    }

    setFormData({
      ...formData,
      titular_id: option.value,
      nombreCliente: option.label,
      telefono: option.telefono,
      email: option.email,
      nuevo_titular: null,
    });
  };

  const handleSaveNew = () => {
    if (!nuevoTitular.nombre || !nuevoTitular.apellido) {
      alert("Por favor completá el nombre y apellido del cliente");
      return;
    }

    setFormData({
      ...formData,
      titular_id: null,
      nombreCliente: `${nuevoTitular.nombre} ${nuevoTitular.apellido}`,
      telefono: nuevoTitular.telefono,
      email: nuevoTitular.email,
      nuevo_titular: nuevoTitular,
    });

    setShowNew(false);
    setNuevoTitular({ nombre: "", apellido: "", telefono: "", email: "" });
  };

  const handleRemove = () => {
    setFormData({
      ...formData,
      titular_id: "",
      nombreCliente: "",
      telefono: "",
      email: "",
      nuevo_titular: null,
    });
    setShowNew(false);
  };

  return (
    <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold text-foreground">
          <User className="mr-2 h-7 w-7 text-primary" />
          Datos del Cliente
        </h2>
        {(formData.nuevo_titular || formData.titular_id) && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Eliminar cliente seleccionado"
            className="p-2 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
          >
            <Trash2 className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Crear nuevo */}
      {showNew ? (
        <div className="space-y-5">
          {[
            { field: "nombre", label: "Nombre" },
            { field: "apellido", label: "Apellido" },
            { field: "telefono", label: "Teléfono" },
            { field: "email", label: "Email (opcional)" },
          ].map(({ field, label }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-lg font-medium text-foreground">
                {label}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                value={(nuevoTitular as any)[field]}
                onChange={(e) =>
                  setNuevoTitular({
                    ...nuevoTitular,
                    [field]: e.target.value,
                  })
                }
                className={`h-12 w-full rounded-lg border px-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors[`nuevo_titular.${field}`]
                    ? "border-red-500"
                    : "border-input"
                }`}
              />
              {errors[`nuevo_titular.${field}`] && (
                <p className="text-sm text-red-600 mt-1">
                  {errors[`nuevo_titular.${field}`]}
                </p>
              )}
            </div>
          ))}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveNew}
              className="flex-1 h-12 px-4 rounded-lg bg-green-600 text-white text-lg font-medium hover:bg-green-700 transition"
            >
              ✔️ Usar este cliente
            </button>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="flex-1 h-12 px-4 rounded-lg bg-gray-200 text-gray-700 text-lg font-medium hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : formData.nuevo_titular || formData.titular_id ? (
        // Cliente seleccionado / creado
        <div className="rounded-md bg-muted/60 p-5 space-y-3 border text-lg text-muted-foreground">
          <p className="flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" />{" "}
            {formData.nombreCliente}
          </p>
          <p className="flex items-center">
            <Phone className="mr-2 h-5 w-5 text-primary" /> {formData.telefono}
          </p>
          {formData.email && (
            <p className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-primary" /> {formData.email}
            </p>
          )}
        </div>
      ) : (
        // Seleccionar existente o crear nuevo
        <div className="flex items-end gap-3">
          <div className="flex flex-col flex-1 gap-1">
            <label className="text-lg font-medium text-foreground">
              Seleccionar titular
            </label>
            <Select
              options={options}
              placeholder="Buscar o seleccionar cliente..."
              isClearable
              value={
                options.find((opt) => opt.value === formData.titular_id) || null
              }
              onChange={handleSelect}
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "48px",
                  fontSize: "16px",
                  borderColor: errors.titular_id
                    ? "#ef4444"
                    : state.isFocused
                    ? "#2563eb"
                    : base.borderColor,
                  boxShadow: state.isFocused
                    ? "0 0 0 1px #2563eb"
                    : "none",
                  "&:hover": {
                    borderColor: errors.titular_id
                      ? "#ef4444"
                      : "#2563eb",
                  },
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
                }),
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            aria-label="Crear nuevo cliente"
            className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Error global */}
      {errors.titular_id && !formData.nuevo_titular && (
        <p className="mt-1 text-base text-red-600">
          {errors.titular_id || "Debe seleccionar o crear un cliente"}
        </p>
      )}
    </div>
  );
}
