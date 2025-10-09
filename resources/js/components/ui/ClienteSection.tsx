import { User, Phone, Mail, Plus, Trash2 } from "lucide-react";
import { useState, forwardRef, useImperativeHandle } from "react";
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
}

export interface ClienteSectionRef {
  validate: () => boolean;
}

const ClienteSection = forwardRef<ClienteSectionRef, Props>(
  ({ titulares, formData, setFormData }, ref) => {
    const [showNew, setShowNew] = useState(false);
    const [nuevoTitular, setNuevoTitular] = useState({
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
    });
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

    useImperativeHandle(ref, () => ({
      validate: () => {
        const errs: Record<string, string> = {};
        if (!formData.titular_id && !formData.nuevo_titular) {
          errs.general = "Debes seleccionar o crear un cliente.";
        } else if (formData.nuevo_titular) {
          if (!formData.nuevo_titular.nombre?.trim())
            errs["nuevo_titular.nombre"] = "El nombre es obligatorio.";
          if (!formData.nuevo_titular.apellido?.trim())
            errs["nuevo_titular.apellido"] = "El apellido es obligatorio.";
        }
        setLocalErrors(errs);
        return Object.keys(errs).length === 0;
      },
    }));

    const options = titulares.map((t) => ({
      value: t.id,
      label: `${t.nombre} ${t.apellido}`,
      telefono: t.telefono,
      email: t.email,
    }));

    // === Tema oscuro/neutral para que se vea "más negro" ===
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
        color: "#111827", // texto al escribir (negro oscuro)
      }),
      singleValue: (b: any) => ({
        ...b,
        color: "#111827", // valor seleccionado
        fontWeight: 500,
      }),
      placeholder: (b: any) => ({
        ...b,
        color: "#111827", // placeholder oscuro (ajústalo si lo querés más claro)
        fontSize: "0.95rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }),
      dropdownIndicator: (b: any, s: any) => ({
        ...b,
        color: s.isFocused ? "#111827" : "#111827",
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

    // Override de paleta interna de react-select (por si usa colores por defecto)
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
      setFormData({
        ...formData,
        titular_id: null,
        nombreCliente: "",
        telefono: "",
        email: "",
        nuevo_titular: null,
      });
    };

    const handleSelect = (option: any) => {
      if (!option) {
        clearSelection();
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
      setLocalErrors((p) => {
        const u = { ...p };
        delete u.general;
        return u;
      });
    };

    const handleSaveNew = () => {
      const errs: Record<string, string> = {};
      if (!nuevoTitular.nombre.trim()) errs.nombre = "El nombre es obligatorio.";
      if (!nuevoTitular.apellido.trim()) errs.apellido = "El apellido es obligatorio.";
      setLocalErrors(errs);
      if (Object.keys(errs).length) return;

      setFormData({
        ...formData,
        titular_id: null,
        nombreCliente: `${nuevoTitular.nombre} ${nuevoTitular.apellido}`,
        telefono: nuevoTitular.telefono,
        email: nuevoTitular.email,
        nuevo_titular: { ...nuevoTitular },
      });
      setShowNew(false);
      setLocalErrors({});
      setNuevoTitular({ nombre: "", apellido: "", telefono: "", email: "" });
    };

    const handleRemove = () => {
      clearSelection();
      setLocalErrors({});
      setShowNew(false);
    };

    const hasSummary = Boolean(formData.titular_id || formData.nuevo_titular);
    const resumenNombre =
      formData.nuevo_titular?.nombre
        ? `${formData.nuevo_titular.nombre} ${formData.nuevo_titular.apellido ?? ""}`.trim()
        : formData.nombreCliente || "";
    const resumenTel = formData.nuevo_titular?.telefono ?? formData.telefono ?? "";
    const resumenEmail = formData.nuevo_titular?.email ?? formData.email ?? "";

    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Cliente *</label>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Select
              options={options}
              placeholder="Buscar o seleccionar cliente…"
              isClearable
              value={options.find((opt) => opt.value === formData.titular_id) || null}
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
            title="Nuevo cliente"
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
            {/* inputs… (sin cambios) */}
            <div>
              <input
                placeholder="Nombre *"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                  localErrors.nombre ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
                value={nuevoTitular.nombre}
                onChange={(e) => {
                  setNuevoTitular((s) => ({ ...s, nombre: e.target.value }));
                  if (localErrors.nombre && e.target.value.trim() !== "") {
                    setLocalErrors((p) => {
                      const u = { ...p };
                      delete u.nombre;
                      return u;
                    });
                  }
                }}
              />
              {localErrors.nombre && (
                <p className="mt-1 text-sm text-red-600">{localErrors.nombre}</p>
              )}
            </div>

            <div>
              <input
                placeholder="Apellido *"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                  localErrors.apellido ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
                value={nuevoTitular.apellido}
                onChange={(e) => {
                  setNuevoTitular((s) => ({ ...s, apellido: e.target.value }));
                  if (localErrors.apellido && e.target.value.trim() !== "") {
                    setLocalErrors((p) => {
                      const u = { ...p };
                      delete u.apellido;
                      return u;
                    });
                  }
                }}
              />
              {localErrors.apellido && (
                <p className="mt-1 text-sm text-red-600">{localErrors.apellido}</p>
              )}
            </div>

            <input
              placeholder="Teléfono"
              className="w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition border-gray-200 hover:border-gray-300"
              value={nuevoTitular.telefono}
              onChange={(e) => setNuevoTitular((s) => ({ ...s, telefono: e.target.value }))}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition border-gray-200 hover:border-gray-300"
              value={nuevoTitular.email}
              onChange={(e) => setNuevoTitular((s) => ({ ...s, email: e.target.value }))}
            />

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleSaveNew}
                className="h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow flex items-center justify-center"
              >
                ✔️ Usar este cliente
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNew(false);
                  setNuevoTitular({ nombre: "", apellido: "", telefono: "", email: "" });
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
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-1">
            <p className="flex items-center text-gray-800 font-medium">
              <User className="mr-2 w-4 h-4 text-green-600" />
              {resumenNombre || "Sin nombre"}
            </p>
            <p className="flex items-center text-gray-600">
              <Phone className="mr-2 w-4 h-4 text-green-600" />
              {resumenTel || "Sin teléfono"}
            </p>
            {resumenEmail && (
              <p className="flex items-center text-gray-600">
                <Mail className="mr-2 w-4 h-4 text-green-600" />
                {resumenEmail}
              </p>
            )}
          </div>
        )}

        {localErrors.general && <p className="text-sm text-red-600">{localErrors.general}</p>}
      </div>
    );
  }
);

export default ClienteSection;
