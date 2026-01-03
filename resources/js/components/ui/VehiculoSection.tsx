import { Car, Plus, Trash2 } from "lucide-react";
import { useState, forwardRef, useImperativeHandle } from "react";
import Select from "react-select";

interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
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
    });
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

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

    const options = vehiculos.map((v) => ({
      value: v.id,
      label: `${v.patente} — ${v.marca} ${v.modelo} (${v.anio})`,
      patente: v.patente,
      marca: v.marca,
      modelo: v.modelo,
      anio: v.anio,
    }));

    // === Mismo look oscuro (texto/placeholder) que el ClienteSection ===
    const classNames = {
      control: () =>
        "border-2 border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition bg-white",
      menu: () => "rounded-xl shadow-lg border border-gray-100 bg-white mt-1",
    } as const;

    const styles = {
      control: (base: any, state: any) => ({
        ...base,
        minHeight: 44,
        height: 44,
        borderWidth: 2,
        boxShadow: state.isFocused ? "0 0 0 2px rgba(34,197,94,0.25)" : "none",
        borderColor: state.isFocused ? "#22c55e" : "#e5e7eb",
        "&:hover": { borderColor: state.isFocused ? "#22c55e" : "#d1d5db" },
        backgroundColor: "#ffffff",
      }),
      valueContainer: (b: any) => ({ ...b, padding: "0 12px" }),
      input: (b: any) => ({
        ...b,
        margin: 0,
        padding: 0,
        lineHeight: "1.25rem",
        color: "#111827", // texto al escribir
      }),
      singleValue: (b: any) => ({
        ...b,
        color: "#111827", // valor seleccionado
        fontWeight: 500,
      }),
      placeholder: (b: any) => ({
        ...b,
        color: "#111827", // placeholder oscuro
        fontSize: "0.95rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }),
      dropdownIndicator: (b: any, s: any) => ({
        ...b,
        color: "#111827",
        "&:hover": { color: "#111827" },
      }),
      indicatorsContainer: (b: any) => ({ ...b, height: 44 }),
      option: (b: any, state: any) => ({
        ...b,
        fontSize: "0.95rem",
        color: state.isSelected ? "#ffffff" : "#111827",
        backgroundColor: state.isSelected
          ? "#22c55e"
          : state.isFocused
          ? "#f3f4f6"
          : "#ffffff",
        cursor: "pointer",
      }),
    } as const;

    const theme = (t: any) => ({
      ...t,
      colors: {
        ...t.colors,
        primary: "#22c55e",
        primary25: "#f3f4f6",
        primary50: "#dcfce7",
        neutral0: "#ffffff",
        neutral20: "#e5e7eb",
        neutral30: "#d1d5db",
        neutral40: "#111827",
        neutral50: "#111827", // placeholder
        neutral60: "#111827",
        neutral70: "#111827",
        neutral80: "#111827", // texto
      },
    });

    const clearSelection = () => {
      setFormData({ vehiculo_id: null, nuevo_vehiculo: null });
    };

    const handleSelect = (option: any) => {
      if (!option) {
        clearSelection();
        return;
      }
      setFormData({
  vehiculo_id: option.value,
  nuevo_vehiculo: null,
});

      setLocalErrors((p) => {
        const u = { ...p };
        delete u.general;
        return u;
      });
    };

    const handleChange = (field: keyof typeof nuevoVehiculo, value: string) => {
      setNuevoVehiculo((prev) => ({ ...prev, [field]: field === "anio" ? Number(value) : value }));
      setLocalErrors((prev) => {
        const u = { ...prev };
        if (["patente", "marca", "modelo"].includes(field as string) && value.trim() !== "") {
          delete u[field as string];
        }
        return u;
      });
    };

    const handleSaveNew = () => {
      const errs: Record<string, string> = {};
      if (!nuevoVehiculo.patente.trim()) errs.patente = "La patente es obligatoria.";
      if (!nuevoVehiculo.marca.trim()) errs.marca = "La marca es obligatoria.";
      if (!nuevoVehiculo.modelo.trim()) errs.modelo = "El modelo es obligatorio.";
      setLocalErrors(errs);
      if (Object.keys(errs).length) return;

      setFormData({
  vehiculo_id: null,
  nuevo_vehiculo: { ...nuevoVehiculo },
});

      setShowNew(false);
      setLocalErrors({});
      setNuevoVehiculo({
        patente: "",
        marca: "",
        modelo: "",
        anio: new Date().getFullYear(),
      });
    };

    const handleRemove = () => {
      clearSelection();
      setLocalErrors({});
      setShowNew(false);
    };

    const hasSummary = Boolean(formData.vehiculo_id || formData.nuevo_vehiculo);
    const resumenLabel =
      formData.nuevo_vehiculo
        ? `${formData.nuevo_vehiculo.patente} — ${formData.nuevo_vehiculo.marca} ${formData.nuevo_vehiculo.modelo} (${formData.nuevo_vehiculo.anio})`
        : options.find((o) => o.value === formData.vehiculo_id)?.label;

    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Vehículo *</label>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Select
              options={options}
              placeholder="Buscar o seleccionar vehículo…"
              isClearable
              value={options.find((opt) => opt.value === formData.vehiculo_id) || null}
              onChange={handleSelect}
              classNames={classNames}
              styles={styles}
              theme={theme}
              components={{ IndicatorSeparator: null }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setShowNew((v) => !v);
              if (!showNew) clearSelection();
            }}
            className="h-11 px-3 inline-flex items-center gap-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow"
            title="Nuevo vehículo"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Nuevo</span>
          </button>

          {hasSummary && (
            <button
              type="button"
              onClick={handleRemove}
              className="h-11 w-11 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
              title="Eliminar selección"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {showNew && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                placeholder="Patente *"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                  localErrors.patente ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
                value={nuevoVehiculo.patente}
                onChange={(e) => handleChange("patente", e.target.value)}
              />
              {localErrors.patente && <p className="mt-1 text-sm text-red-600">{localErrors.patente}</p>}
            </div>

            <div>
              <input
                placeholder="Marca *"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                  localErrors.marca ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
                value={nuevoVehiculo.marca}
                onChange={(e) => handleChange("marca", e.target.value)}
              />
              {localErrors.marca && <p className="mt-1 text-sm text-red-600">{localErrors.marca}</p>}
            </div>

            <div>
              <input
                placeholder="Modelo *"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                  localErrors.modelo ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
                value={nuevoVehiculo.modelo}
                onChange={(e) => handleChange("modelo", e.target.value)}
              />
              {localErrors.modelo && <p className="mt-1 text-sm text-red-600">{localErrors.modelo}</p>}
            </div>

            <div>
              <input
                type="number"
                placeholder="Año"
                className="w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition border-gray-200 hover:border-gray-300"
                value={nuevoVehiculo.anio}
                onChange={(e) => handleChange("anio", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleSaveNew}
                className="h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow flex items-center justify-center"
              >
                ✔️ Usar este vehículo
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNew(false);
                  setNuevoVehiculo({
                    patente: "",
                    marca: "",
                    modelo: "",
                    anio: new Date().getFullYear(),
                  });
                  setLocalErrors({});
                }}
                className="h-12 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {hasSummary && !showNew && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-gray-800 font-medium">🚗 {resumenLabel}</p>
          </div>
        )}

        {localErrors.general && <p className="text-sm text-red-600">{localErrors.general}</p>}
      </div>
    );
  }
);

export default VehiculoSection;
