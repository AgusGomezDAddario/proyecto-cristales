import { Car, Trash2, Plus } from "lucide-react";
import { useState } from "react";
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
  vehiculos: Vehiculo[];                 // autos del titular seleccionado
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function VehiculoSection({ vehiculos, formData, setFormData, errors }: Props) {
  const [showNew, setShowNew] = useState(false);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    patente: "",
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    color: "",
  });

  // 👉 opciones del select de autos existentes
  const options = vehiculos.map((v) => ({
    value: v.id,
    label: `${v.patente} — ${v.marca} ${v.modelo} (${v.anio})`,
  }));

  // 👉 cuando seleccionás un vehículo existente
  const handleSelect = (option: any) => {
    if (!option) {
      // reset si sacás la selección
      setFormData({
        ...formData,
        vehiculo_id: null,
        nuevo_vehiculo: null,
      });
      return;
    }

    setFormData({
      ...formData,
      vehiculo_id: option.value,  // guardás el id del vehículo
      nuevo_vehiculo: null,       // limpiás cualquier nuevo
    });
  };

  // 👉 cuando guardás un nuevo vehículo
  const handleSaveNew = () => {
    const vehiculo = nuevoVehiculo.patente
      ? { ...nuevoVehiculo }
      : { patente: "ABC123", marca: "Toyota", modelo: "Corolla", anio: 2020, color: "Rojo" };

    setFormData({
      ...formData,
      vehiculo_id: null,          // no existe aún en BD
      nuevo_vehiculo: vehiculo,   // pasás todo al backend para crearlo
    });

    setShowNew(false);
    setNuevoVehiculo({
      patente: "",
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      color: "",
    });
  };

  // 👉 limpiar selección
  const handleRemove = () => {
    setFormData({
      ...formData,
      vehiculo_id: null,
      nuevo_vehiculo: null,
    });
    setShowNew(false);
  };

  // 👉 obtener el vehículo seleccionado desde la lista
  const vehiculoSeleccionado = vehiculos.find((v) => v.id === formData.vehiculo_id);

  return (
    <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold text-foreground">
          <Car className="mr-2 h-7 w-7 text-primary" />
          Datos del Vehículo
        </h2>
        {(formData.nuevo_vehiculo || formData.vehiculo_id) && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Eliminar vehículo seleccionado"
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
            { field: "patente", label: "Patente" },
            { field: "marca", label: "Marca" },
            { field: "modelo", label: "Modelo" },
            { field: "anio", label: "Año" },
            { field: "color", label: "Color (opcional)" },
          ].map(({ field, label }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-lg font-medium text-foreground">{label}</label>
              <input
                type={field === "anio" ? "number" : "text"}
                value={(nuevoVehiculo as any)[field]}
                onChange={(e) =>
                  setNuevoVehiculo({ ...nuevoVehiculo, [field]: e.target.value })
                }
                className="h-12 w-full rounded-lg border px-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
        // Vehículo seleccionado / creado (card readonly)
        <div className="rounded-md bg-muted/60 p-5 space-y-3 border text-lg text-muted-foreground">
          {formData.nuevo_vehiculo ? (
            <p>
              🚗 {formData.nuevo_vehiculo.patente} — {formData.nuevo_vehiculo.marca} {formData.nuevo_vehiculo.modelo} ({formData.nuevo_vehiculo.anio})
            </p>
          ) : vehiculoSeleccionado ? (
            <p>
              🚗 {vehiculoSeleccionado.patente} — {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo} ({vehiculoSeleccionado.anio})
            </p>
          ) : (
            <p>Vehículo seleccionado con id: {formData.vehiculo_id}</p>
          )}
        </div>
      ) : (
        // Seleccionar existente o crear nuevo
        <div className="flex items-end gap-3">
          <div className="flex flex-col flex-1 gap-1">
            <label className="text-lg font-medium text-foreground">Seleccionar vehículo</label>
            <Select
              options={options}
              placeholder="Buscar o seleccionar vehículo..."
              isClearable
              value={options.find((opt) => opt.value === formData.vehiculo_id) || null}
              onChange={handleSelect}
              styles={{
                control: (base) => ({ ...base, minHeight: "48px", fontSize: "16px" }),
                option: (base, state) => ({
                  ...base,
                  fontSize: "16px",
                  backgroundColor: state.isSelected ? "#2563eb" : state.isFocused ? "#e0e7ff" : "white",
                  color: state.isSelected ? "white" : "black",
                }),
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            aria-label="Crear nuevo vehículo"
            className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Error */}
      {errors.vehiculo_id && !formData.nuevo_vehiculo && (
        <p className="mt-1 text-base text-red-600">
          {errors.vehiculo_id || "Debe seleccionar o crear un vehículo"}
        </p>
      )}
    </div>
  );
}
