import { Car, Plus, Trash2 } from "lucide-react";
import { useState, forwardRef, useImperativeHandle } from "react";
import Select from "react-select";

interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
}

interface Props {
  vehiculos: Vehiculo[];
  formData: any;
  setFormData: (data: any) => void;
}

export interface VehiculoSectionRef {
  validate: () => boolean;
}

const VehiculoSection = forwardRef<VehiculoSectionRef, Props>(
  ({ vehiculos, formData, setFormData }, ref) => {
    const [showNew, setShowNew] = useState(false);
    const [nuevoVehiculo, setNuevoVehiculo] = useState({
      patente: "",
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      color: "",
    });
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

    // ✅ Validación expuesta al padre
    useImperativeHandle(ref, () => ({
      validate: () => {
        const errs: Record<string, string> = {};

        if (!formData.vehiculo_id && !formData.nuevo_vehiculo) {
          errs.general = "Debes seleccionar o crear un vehículo.";
        } else if (formData.nuevo_vehiculo) {
          const v = formData.nuevo_vehiculo;
          if (!v.patente?.trim()) errs["nuevo_vehiculo.patente"] = "La patente es obligatoria.";
          if (!v.marca?.trim()) errs["nuevo_vehiculo.marca"] = "La marca es obligatoria.";
          if (!v.modelo?.trim()) errs["nuevo_vehiculo.modelo"] = "El modelo es obligatorio.";
        }

        setLocalErrors(errs);
        return Object.keys(errs).length === 0;
      },
    }));

    // Opciones del select
    const options = vehiculos.map((v) => ({
      value: v.id,
      label: `${v.patente} — ${v.marca} ${v.modelo} (${v.anio})`,
      marca: v.marca,
      modelo: v.modelo,
      anio: v.anio,
      color: v.color,
    }));

    // Limpieza de error en vivo
  const handleChange = (field: string, value: string) => {
    setNuevoVehiculo({ ...nuevoVehiculo, [field]: value });

    // 🔹 Validación inmediata en vivo
    setLocalErrors((prev) => {
      const updated = { ...prev };

      // Si el campo se vacía → muestra el error
      if (
        ["patente", "marca", "modelo"].includes(field) &&
        value.trim() === ""
      ) {
        updated[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } es obligatorio.`;
      }
      // Si antes tenía error y ahora se completó → quita el error
      else if (prev[field] && value.trim() !== "") {
        delete updated[field];
      }

      return updated;
    });
  };


    const handleSelect = (option: any) => {
      if (!option) {
        setFormData({
          ...formData,
          vehiculo_id: "",
          nuevo_vehiculo: null,
        });
        return;
      }

      setFormData({
        ...formData,
        vehiculo_id: option.value,
        nuevo_vehiculo: null,
      });

      setLocalErrors((prev) => {
        const updated = { ...prev };
        delete updated.general;
        return updated;
      });
    };

    const handleSaveNew = () => {
      const errs: Record<string, string> = {};
      if (!nuevoVehiculo.patente.trim()) errs.patente = "La patente es obligatoria.";
      if (!nuevoVehiculo.marca.trim()) errs.marca = "La marca es obligatoria.";
      if (!nuevoVehiculo.modelo.trim()) errs.modelo = "El modelo es obligatorio.";

      setLocalErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setFormData({
        ...formData,
        vehiculo_id: null,
        nuevo_vehiculo: nuevoVehiculo,
      });

      setShowNew(false);
      setNuevoVehiculo({
        patente: "",
        marca: "",
        modelo: "",
        anio: new Date().getFullYear(),
        color: "",
      });
      setLocalErrors({});
    };

    const handleRemove = () => {
      setFormData({
        ...formData,
        vehiculo_id: "",
        nuevo_vehiculo: null,
      });
      setLocalErrors({});
      setShowNew(false);
    };

    return (
      <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-2xl font-bold text-foreground">
            <Car className="mr-2 h-7 w-7 text-primary" />
            Datos del Vehículo
          </h2>
          {(formData.nuevo_vehiculo || formData.vehiculo_id) && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
            >
              <Trash2 className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* 📄 Formulario de nuevo vehículo */}
        {showNew ? (
          <div className="space-y-5">
            {["patente", "marca", "modelo", "anio", "color"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-lg font-medium">
                  {field === "color"
                    ? "Color (opcional)"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "anio" ? "number" : "text"}
                  value={(nuevoVehiculo as any)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={`h-12 w-full rounded-lg border px-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    localErrors[field] ? "border-red-500" : "border-input"
                  }`}
                />
                {localErrors[field] && (
                  <p className="text-sm text-red-600">{localErrors[field]}</p>
                )}
              </div>
            ))}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveNew}
                className="flex-1 h-12 px-4 rounded-lg bg-green-600 text-white text-lg font-medium hover:bg-green-700 transition"
              >
                ✔️ Usar este vehículo
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
        ) : formData.nuevo_vehiculo || formData.vehiculo_id ? (
          // 📋 Vista resumen (igual que ClienteSection)
          <div className="rounded-md bg-muted/60 p-5 space-y-3 border text-lg text-muted-foreground">
            <p>
              🚗{" "}
              {formData.nuevo_vehiculo
                ? `${formData.nuevo_vehiculo.patente} — ${formData.nuevo_vehiculo.marca} ${formData.nuevo_vehiculo.modelo} (${formData.nuevo_vehiculo.anio})`
                : options.find((o) => o.value === formData.vehiculo_id)?.label}
            </p>
          </div>
        ) : (
          // 🔽 Select + botón de agregar
          <div className="flex items-end gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-lg font-medium">Seleccionar vehículo</label>
              <Select
                options={options}
                placeholder="Buscar o seleccionar vehículo..."
                isClearable
                value={
                  options.find((opt) => opt.value === formData.vehiculo_id) ||
                  null
                }
                onChange={handleSelect}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowNew(true)}
              className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        )}

        {localErrors.general && (
          <p className="text-red-600 text-sm">{localErrors.general}</p>
        )}
      </div>
    );
  }
);

export default VehiculoSection;
