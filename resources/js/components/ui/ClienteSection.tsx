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

    // ✅ Validación expuesta al padre (CreateOrdenes)
    useImperativeHandle(ref, () => ({
      validate: () => {
        const errs: Record<string, string> = {};

        if (!formData.titular_id && !formData.nuevo_titular) {
          errs.general = "Debes seleccionar o crear un cliente.";
        } else if (formData.nuevo_titular) {
          if (!formData.nuevo_titular.nombre?.trim()) {
            errs["nuevo_titular.nombre"] = "El nombre es obligatorio.";
          }
          if (!formData.nuevo_titular.apellido?.trim()) {
            errs["nuevo_titular.apellido"] = "El apellido es obligatorio.";
          }
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

    // ✅ Limpieza de error en vivo
// ✅ Validación en vivo (activa y reactiva errores)
  const handleChange = (field: string, value: string) => {
    setNuevoTitular({ ...nuevoTitular, [field]: value });

    setLocalErrors((prev) => {
      const updated = { ...prev };

      // Si el campo está vacío y es obligatorio → muestra error
      if (
        ["nombre", "apellido"].includes(field) &&
        value.trim() === ""
      ) {
        updated[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } es obligatorio.`;
      }
      // Si antes tenía error y ahora se completó → elimina el error
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

      // Borrar error general si existía
      setLocalErrors((prev) => {
        const updated = { ...prev };
        delete updated.general;
        return updated;
      });
    };

    const handleSaveNew = () => {
      const errs: Record<string, string> = {};
      if (!nuevoTitular.nombre.trim()) errs.nombre = "El nombre es obligatorio.";
      if (!nuevoTitular.apellido.trim())
        errs.apellido = "El apellido es obligatorio.";
      setLocalErrors(errs);

      if (Object.keys(errs).length > 0) return;

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
      setLocalErrors({});
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
      setLocalErrors({});
      setShowNew(false);
    };

    return (
      <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-2xl font-bold text-foreground">
            <User className="mr-2 h-7 w-7 text-primary" />
            Datos del Cliente
          </h2>
          {(formData.nuevo_titular || formData.titular_id) && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
            >
              <Trash2 className="h-6 w-6" />
            </button>
          )}
        </div>

        {showNew ? (
          <div className="space-y-5">
            {["nombre", "apellido", "telefono", "email"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-lg font-medium">
                  {field === "email"
                    ? "Email (opcional)"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={(nuevoTitular as any)[field]}
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
          <div className="flex items-end gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-lg font-medium">Seleccionar titular</label>
              <Select
                options={options}
                placeholder="Buscar o seleccionar cliente..."
                isClearable
                value={
                  options.find((opt) => opt.value === formData.titular_id) ||
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

export default ClienteSection;