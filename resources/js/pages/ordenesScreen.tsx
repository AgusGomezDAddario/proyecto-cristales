import React, { useState, useEffect } from 'react';
import { DollarSign, User, Phone, Mail, Car, FileText, Plus, Trash2, Printer, QrCode } from 'lucide-react';

interface PaymentMethod {
  id: string;
  metodo: string;
  monto: number;
}

export default function OrdenesScreen() {
  const [formData, setFormData] = useState({
    // Datos del Cliente
    nombreCliente: "",
    telefono: "",
    email: "",

    // Datos del Vehículo
    patente: "",
    marca: "",
    modelo: "",
    anio: "",

    // Detalles del Vidrio
    tipoVidrio: "",
    conColocacion: false,
    conFactura: false,
    cantidad: 1,
    observacion: "",

    // Pago
    precioUnitario: "",
    total: 0,
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", metodo: "efectivo", monto: 0 }
  ]);

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [generatedOrder, setGeneratedOrder] = useState<any>(null);

  // TODO: Reemplazar con método GET 'obtenerMetodosPago' en el futuro
  const metodosPago = ["efectivo", "credito", "debito", "transferencia"];

  // Cálculo automático del total
  useEffect(() => {
    const precio = Number.parseFloat(formData.precioUnitario) || 0;
    const cantidad = formData.cantidad || 1;
    setFormData((prev) => ({ ...prev, total: precio * cantidad }));
  }, [formData.precioUnitario, formData.cantidad]);

  const addPaymentMethod = () => {
    const newId = (paymentMethods.length + 1).toString();
    setPaymentMethods([...paymentMethods, { id: newId, metodo: "efectivo", monto: 0 }]);
  };

  const removePaymentMethod = (id: string) => {
    if (paymentMethods.length > 1) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    }
  };

  const updatePaymentMethod = (id: string, field: "metodo" | "monto", value: string | number) => {
    setPaymentMethods(paymentMethods.map((pm) => (pm.id === id ? { ...pm, [field]: value } : pm)));
  };

  const getTotalPayments = () => {
    return paymentMethods.reduce((sum, pm) => sum + pm.monto, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};

    // Validaciones
    if (!formData.nombreCliente) newErrors.nombreCliente = true;
    if (!formData.telefono) newErrors.telefono = true;
    if (!formData.tipoVidrio) newErrors.tipoVidrio = true;
    if (!formData.precioUnitario) newErrors.precioUnitario = true;
    if (!formData.patente) newErrors.patente = true;
    if (formData.email && !formData.email.includes('@')) newErrors.email = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const prefix = formData.conFactura ? "FC-" : "OT-";
      const numeroOrden = `${prefix}${Date.now().toString().slice(-6)}`;

      const orderData = {
        numero: numeroOrden,
        cliente: formData.nombreCliente,
        telefono: formData.telefono,
        email: formData.email,
        vehiculo: {
          patente: formData.patente,
          marca: formData.marca,
          modelo: formData.modelo,
          anio: formData.anio
        },
        tipoVidrio: formData.tipoVidrio,
        conColocacion: formData.conColocacion,
        conFactura: formData.conFactura,
        cantidad: formData.cantidad,
        observacion: formData.observacion,
        total: formData.total,
        totalPagado: getTotalPayments(),
        paymentMethods: paymentMethods.filter((pm) => pm.monto > 0),
        fecha: new Date().toLocaleDateString("es-AR"),
        estado: "Iniciado"
      };

      setGeneratedOrder(orderData);

      const paymentSummary = paymentMethods
        .filter((pm) => pm.monto > 0)
        .map((pm) => `${pm.metodo}: $${pm.monto.toLocaleString()}`)
        .join("\n");

      alert(`Orden de trabajo generada exitosamente!\n\nNúmero: ${numeroOrden}\nCliente: ${formData.nombreCliente}\nTotal: $${formData.total.toLocaleString()}`);

      // Reset form
      setFormData({
        nombreCliente: "",
        telefono: "",
        email: "",
        patente: "",
        marca: "",
        modelo: "",
        anio: "",
        tipoVidrio: "",
        conColocacion: false,
        conFactura: false,
        cantidad: 1,
        observacion: "",
        precioUnitario: "",
        total: 0,
      });
      setPaymentMethods([{ id: "1", metodo: "efectivo", monto: 0 }]);
    }
  };

  const handlePrint = () => {
    console.log("Función de impresión a implementar");
  };

  const handleGenerateQR = () => {
    console.log("Función de QR a implementar");
  };

  return (
    <div className="bg-background rounded-lg border">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-semibold text-foreground">📋 Nueva Orden de Trabajo</h1>
        <p className="text-muted-foreground mt-1">Complete todos los campos obligatorios marcados con *</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Sección: Datos del Cliente */}
        <div className="bg-muted/50 rounded-lg p-6 border">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-primary" />
            Datos del Cliente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre Completo <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.nombreCliente}
                onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                className={`w-full h-10 px-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.nombreCliente ? "border-destructive" : "border-input"
                }`}
                placeholder="Ej: Juan Carlos Pérez"
              />
              {errors.nombreCliente && <p className="text-destructive text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Teléfono <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, telefono: value });
                  }}
                  className={`w-full h-10 pl-9 pr-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.telefono ? "border-destructive" : "border-input"
                  }`}
                  placeholder="Ej: 1112345678"
                />
              </div>
              {errors.telefono && <p className="text-destructive text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email (opcional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full h-10 pl-9 pr-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.email ? "border-destructive" : "border-input"
                  }`}
                  placeholder="Ej: juan@email.com"
                />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1">Ingrese un email válido</p>}
            </div>
          </div>
        </div>

        {/* Sección: Datos del Vehículo */}
        <div className="bg-muted/50 rounded-lg p-6 border">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Car className="w-5 h-5 mr-2 text-primary" />
            Datos del Vehículo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Patente <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.patente}
                onChange={(e) => setFormData({ ...formData, patente: e.target.value })}
                className={`w-full h-10 px-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.patente ? "border-destructive" : "border-input"
                }`}
                placeholder="Ej: AB123CD"
              />
              {errors.patente && <p className="text-destructive text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Marca (opcional)</label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="w-full h-10 px-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Ej: Chevrolet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Modelo (opcional)</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="w-full h-10 px-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Ej: Onix"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Año (opcional)</label>
              <input
                type="text"
                value={formData.anio}
                onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
                className="w-full h-10 px-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Ej: 2020"
              />
            </div>
          </div>
        </div>

        {/* Sección: Detalles del Vidrio */}
        <div className="bg-muted/50 rounded-lg p-6 border">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            Detalles del Vidrio
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de Vidrio <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.tipoVidrio}
                onChange={(e) => setFormData({ ...formData, tipoVidrio: e.target.value })}
                className={`w-full h-10 px-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.tipoVidrio ? "border-destructive" : "border-input"
                }`}
                placeholder="Ej: Parabrisas Chevrolet Onix 2020"
              />
              {errors.tipoVidrio && <p className="text-destructive text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="conColocacion"
                checked={formData.conColocacion}
                onChange={(e) => setFormData({ ...formData, conColocacion: e.target.checked })}
                className="w-4 h-4 text-primary rounded"
              />
              <label htmlFor="conColocacion" className="text-foreground font-medium">
                🔧 Con colocación incluida
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="conFactura"
                checked={formData.conFactura}
                onChange={(e) => setFormData({ ...formData, conFactura: e.target.checked })}
                className="w-4 h-4 text-primary rounded"
              />
              <label htmlFor="conFactura" className="text-foreground font-medium">
                🧾 Con factura
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Cantidad</label>
              <input
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: Number.parseInt(e.target.value) || 1 })}
                className="w-full h-10 px-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Observación (opcional)</label>
              <textarea
                value={formData.observacion}
                onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Notas adicionales sobre la orden..."
                maxLength={500}
              />
              <p className="text-muted-foreground text-sm mt-1">{formData.observacion.length}/500 caracteres</p>
            </div>
          </div>
        </div>

        {/* Sección: Información de Pago */}
        <div className="bg-muted/50 rounded-lg p-6 border">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-primary" />
            Información de Pago
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Precio Unitario <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.precioUnitario}
                  onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })}
                  className={`w-full h-10 pl-9 pr-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.precioUnitario ? "border-destructive" : "border-input"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.precioUnitario && <p className="text-destructive text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Total de la Orden</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  value={formData.total.toLocaleString()}
                  readOnly
                  className="w-full h-10 pl-9 pr-3 border border-input rounded-md bg-muted font-semibold"
                />
              </div>
            </div>

            {/* Múltiples Métodos de Pago */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-foreground">Métodos de Pago</label>
                <button
                  type="button"
                  onClick={addPaymentMethod}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar método
                </button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((payment) => (
                  <div key={payment.id} className="flex gap-3 items-center p-3 bg-background rounded-md border">
                    <div className="flex-1">
                      <select
                        value={payment.metodo}
                        onChange={(e) => updatePaymentMethod(payment.id, "metodo", e.target.value)}
                        className="w-full h-9 px-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        {metodosPago.map((metodo) => (
                          <option key={metodo} value={metodo}>
                            {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={payment.monto || ""}
                          onChange={(e) =>
                            updatePaymentMethod(payment.id, "monto", Number.parseFloat(e.target.value) || 0)
                          }
                          className="w-full h-9 pl-9 pr-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    {paymentMethods.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePaymentMethod(payment.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 bg-primary/10 rounded-md">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">Total a cobrar:</span>
                  <span className="font-semibold text-foreground">${formData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">Total registrado:</span>
                  <span
                    className={`font-semibold ${getTotalPayments() === formData.total ? "text-green-600" : "text-amber-600"}`}
                  >
                    ${getTotalPayments().toLocaleString()}
                  </span>
                </div>
                {getTotalPayments() !== formData.total && formData.total > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">Pendiente:</span>
                    <span className="font-semibold text-destructive">
                      ${(formData.total - getTotalPayments()).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 h-11 bg-primary text-primary-foreground font-semibold rounded-md transition-colors hover:bg-primary/90"
          >
            💾 Guardar Orden
          </button>

          <button
            type="button"
            onClick={handleGenerateQR}
            className="sm:w-auto px-4 h-11 bg-secondary text-secondary-foreground font-semibold rounded-md transition-colors hover:bg-secondary/80"
          >
            <QrCode className="w-4 h-4 mr-2 inline" />
            Generar QR
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="sm:w-auto px-4 h-11 bg-muted text-muted-foreground font-semibold rounded-md transition-colors hover:bg-muted/80"
          >
            <Printer className="w-4 h-4 mr-2 inline" />
            Imprimir
          </button>
        </div>
      </form>
    </div>
  );
}