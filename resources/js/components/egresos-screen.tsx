"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, DollarSign } from "lucide-react"

export function EgresosScreen() {
  const [activeTab, setActiveTab] = useState<"caja" | "vales">("caja")
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    concepto: "",
    monto: "",
    metodoPago: "efectivo",
    comprobante: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const conceptosCaja = ["Materiales", "Gastos varios", "Combustible", "Herramientas"]
  const empleados = ["Juan Pérez", "María González", "Carlos López", "Ana Martínez"]
  const metodosPago = ["Efectivo", "Transferencia", "Cheque", "Tarjeta de Crédito", "Tarjeta de Débito"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, boolean> = {}

    if (!formData.concepto) newErrors.concepto = true
    if (!formData.monto) newErrors.monto = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      alert(`Egreso guardado correctamente

Tipo: ${activeTab === "caja" ? "Caja Chica" : "Vale del Personal"}
Concepto: ${formData.concepto}
Monto: $${Number.parseFloat(formData.monto).toLocaleString()}
Método de Pago: ${formData.metodoPago}
Fecha: ${formData.fecha}`)

      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        concepto: "",
        monto: "",
        metodoPago: "efectivo",
        comprobante: null,
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, comprobante: file })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab("caja")}
              className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                activeTab === "caja"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              💰 Caja Chica
            </button>
            <button
              onClick={() => setActiveTab("vales")}
              className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                activeTab === "vales"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              📋 Vales del Personal
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Concepto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concepto <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.concepto}
                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.concepto ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar concepto...</option>
                {activeTab === "caja"
                  ? conceptosCaja.map((concepto) => (
                      <option key={concepto} value={concepto}>
                        {concepto}
                      </option>
                    ))
                  : empleados.map((empleado) => (
                      <option key={empleado} value={`Adelanto ${empleado}`}>
                        Adelanto {empleado}
                      </option>
                    ))}
              </select>
              {errors.concepto && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            {/* Método de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
              <select
                value={formData.metodoPago}
                onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {metodosPago.map((metodo) => (
                  <option key={metodo} value={metodo.toLowerCase()}>
                    {metodo}
                  </option>
                ))}
              </select>
            </div>

            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  className={`w-full h-12 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.monto ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.monto && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
            </div>

            {/* Comprobante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comprobante</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.comprobante ? (
                  <div className="space-y-2">
                    <Camera className="mx-auto w-8 h-8 text-green-600" />
                    <p className="text-sm text-green-600 font-medium">{formData.comprobante.name}</p>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, comprobante: null })}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto w-8 h-8 text-gray-400" />
                    <div>
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-800 font-medium">📷 Adjuntar imagen</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>💾 Guardar Egreso</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
