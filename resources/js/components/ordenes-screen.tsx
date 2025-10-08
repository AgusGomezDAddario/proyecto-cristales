"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { QrCode, DollarSign, User, Phone, Mail, Car, Printer, X, Plus, Trash2 } from "lucide-react"

interface PaymentMethod {
  id: string
  metodo: string
  monto: number
}

export function OrdenesScreen() {
  const [formData, setFormData] = useState({
    // Datos del Cliente
    nombreCliente: "",
    telefono: "",
    email: "",

    // Detalles del Vidrio
    tipoVidrio: "",
    conColocacion: false,
    cantidad: 1,

    // Pago
    precioUnitario: "",
    total: 0,
  })

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([{ id: "1", metodo: "efectivo", monto: 0 }])

  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showQRModal, setShowQRModal] = useState(false)
  const [generatedOrder, setGeneratedOrder] = useState<any>(null)

  // Cálculo automático del total
  useEffect(() => {
    const precio = Number.parseFloat(formData.precioUnitario) || 0
    const cantidad = formData.cantidad || 1
    setFormData((prev) => ({ ...prev, total: precio * cantidad }))
  }, [formData.precioUnitario, formData.cantidad])

  const metodosPago = ["Efectivo", "Transferencia", "Cheque", "Tarjeta de Crédito", "Tarjeta de Débito"]

  const addPaymentMethod = () => {
    const newId = (paymentMethods.length + 1).toString()
    setPaymentMethods([...paymentMethods, { id: newId, metodo: "efectivo", monto: 0 }])
  }

  const removePaymentMethod = (id: string) => {
    if (paymentMethods.length > 1) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))
    }
  }

  const updatePaymentMethod = (id: string, field: "metodo" | "monto", value: string | number) => {
    setPaymentMethods(paymentMethods.map((pm) => (pm.id === id ? { ...pm, [field]: value } : pm)))
  }

  const getTotalPayments = () => {
    return paymentMethods.reduce((sum, pm) => sum + pm.monto, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, boolean> = {}

    // Validaciones
    if (!formData.nombreCliente) newErrors.nombreCliente = true
    if (!formData.telefono) newErrors.telefono = true
    if (!formData.tipoVidrio) newErrors.tipoVidrio = true
    if (!formData.precioUnitario) newErrors.precioUnitario = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const numeroOrden = `OT-${Date.now().toString().slice(-6)}`

      const orderData = {
        numero: numeroOrden,
        cliente: formData.nombreCliente,
        telefono: formData.telefono,
        email: formData.email,
        tipoVidrio: formData.tipoVidrio,
        conColocacion: formData.conColocacion,
        cantidad: formData.cantidad,
        total: formData.total,
        totalPagado: getTotalPayments(),
        paymentMethods: paymentMethods.filter((pm) => pm.monto > 0),
        fecha: new Date().toLocaleDateString("es-AR"),
      }

      setGeneratedOrder(orderData)

      const paymentSummary = paymentMethods
        .filter((pm) => pm.monto > 0)
        .map((pm) => `${pm.metodo}: $${pm.monto.toLocaleString()}`)
        .join("\n")

      alert(`Orden de trabajo generada exitosamente!
      
Número: ${numeroOrden}
Cliente: ${formData.nombreCliente}
Vidrio: ${formData.tipoVidrio}
Total: $${formData.total.toLocaleString()}

Pagos registrados:
${paymentSummary}
Total pagado: $${getTotalPayments().toLocaleString()}`)

      // Reset form
      setFormData({
        nombreCliente: "",
        telefono: "",
        email: "",
        tipoVidrio: "",
        conColocacion: false,
        cantidad: 1,
        precioUnitario: "",
        total: 0,
      })
      setPaymentMethods([{ id: "1", metodo: "efectivo", monto: 0 }])
    }
  }

  const handleGenerateQR = () => {
    if (!generatedOrder) {
      alert("Primero debe guardar la orden de trabajo")
      return
    }
    setShowQRModal(true)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h1 className="text-xl font-semibold text-gray-800">📋 Nueva Orden de Trabajo</h1>
        <p className="text-gray-600 mt-1">Complete todos los campos obligatorios marcados con *</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Datos del Cliente */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Datos del Cliente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombreCliente}
                onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nombreCliente ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: Juan Carlos Pérez"
              />
              {errors.nombreCliente && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className={`w-full h-12 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.telefono ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: 11-1234-5678"
                />
              </div>
              {errors.telefono && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (opcional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: juan@email.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del Vidrio */}
        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Car className="w-5 h-5 mr-2 text-green-600" />
            Detalles del Vidrio
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Vidrio <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tipoVidrio}
                onChange={(e) => setFormData({ ...formData, tipoVidrio: e.target.value })}
                className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tipoVidrio ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: Parabrisas Chevrolet Onix 2020"
              />
              {errors.tipoVidrio && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="conColocacion"
                checked={formData.conColocacion}
                onChange={(e) => setFormData({ ...formData, conColocacion: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="conColocacion" className="text-gray-700 font-medium">
                🔧 Con colocación incluida
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
              <input
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: Number.parseInt(e.target.value) || 1 })}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
            Información de Pago
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Unitario <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.precioUnitario}
                  onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })}
                  className={`w-full h-12 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.precioUnitario ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.precioUnitario && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total de la Orden</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.total.toLocaleString()}
                  readOnly
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-50 font-semibold text-lg"
                />
              </div>
            </div>

            {/* Multiple Payment Methods */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Métodos de Pago</label>
                <button
                  type="button"
                  onClick={addPaymentMethod}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar método
                </button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((payment, index) => (
                  <div key={payment.id} className="flex gap-3 items-center p-3 bg-white rounded-lg border">
                    <div className="flex-1">
                      <select
                        value={payment.metodo}
                        onChange={(e) => updatePaymentMethod(payment.id, "metodo", e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {metodosPago.map((metodo) => (
                          <option key={metodo} value={metodo.toLowerCase()}>
                            {metodo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={payment.monto || ""}
                          onChange={(e) =>
                            updatePaymentMethod(payment.id, "monto", Number.parseFloat(e.target.value) || 0)
                          }
                          className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    {paymentMethods.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePaymentMethod(payment.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Total a cobrar:</span>
                  <span className="font-semibold text-gray-800">${formData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Total registrado:</span>
                  <span
                    className={`font-semibold ${getTotalPayments() === formData.total ? "text-green-600" : "text-orange-600"}`}
                  >
                    ${getTotalPayments().toLocaleString()}
                  </span>
                </div>
                {getTotalPayments() !== formData.total && formData.total > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">Pendiente:</span>
                    <span className="font-semibold text-red-600">
                      ${(formData.total - getTotalPayments()).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>💾 Guardar Orden</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateQR}
            className="sm:w-auto px-6 h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <QrCode className="w-5 h-5" />
            <span>Generar QR</span>
          </button>
        </div>
      </form>

      {showQRModal && generatedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Vista Previa de Impresión</h3>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Print Preview Content */}
              <div className="border-2 border-dashed border-gray-300 p-6 bg-gray-50 print:border-none print:bg-white">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">VIDRIERÍA</h2>
                  <p className="text-gray-600">Orden de Trabajo</p>
                </div>

                {/* QR Code Placeholder */}
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-500" />
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">N° Orden:</span>
                    <span>{generatedOrder.numero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fecha:</span>
                    <span>{generatedOrder.fecha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Cliente:</span>
                    <span>{generatedOrder.cliente}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Teléfono:</span>
                    <span>{generatedOrder.telefono}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Vidrio:</span>
                    <span className="text-right">{generatedOrder.tipoVidrio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Cantidad:</span>
                    <span>{generatedOrder.cantidad}</span>
                  </div>
                  {generatedOrder.conColocacion && (
                    <div className="flex justify-between">
                      <span className="font-medium">Colocación:</span>
                      <span>✅ Incluida</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total:</span>
                    <span>${generatedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handlePrint}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Printer className="w-5 h-5" />
                  <span>Imprimir</span>
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="px-6 h-12 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
