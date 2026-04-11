"use client"
import { Plus, Eye, Edit } from "lucide-react"

interface DashboardScreenProps {
  setActiveScreen: (screen: "dashboard" | "egresos" | "ingresos" | "ordenes") => void
}

export function DashboardScreen({ setActiveScreen }: DashboardScreenProps) {
  // Mock data - en producción vendría de la API
  const ordenesRecientes = [
    { id: "ORD-001", cliente: "Juan Pérez", vehiculo: "Toyota Corolla 2020", estado: "Pendiente", fecha: "2024-01-15" },
    { id: "ORD-002", cliente: "María García", vehiculo: "Honda Civic 2019", estado: "Completada", fecha: "2024-01-14" },
    { id: "ORD-003", cliente: "Carlos López", vehiculo: "Ford Focus 2021", estado: "Pagada", fecha: "2024-01-14" },
    {
      id: "ORD-004",
      cliente: "Ana Martínez",
      vehiculo: "Chevrolet Cruze 2018",
      estado: "Pendiente",
      fecha: "2024-01-13",
    },
    {
      id: "ORD-005",
      cliente: "Roberto Silva",
      vehiculo: "Nissan Sentra 2020",
      estado: "Completada",
      fecha: "2024-01-12",
    },
  ]

  const ingresosRecientes = [
    { id: "ING-001", orden: "ORD-001", cliente: "Juan Pérez", monto: 25000, metodo: "Efectivo", fecha: "2024-01-15" },
    {
      id: "ING-002",
      orden: "ORD-003",
      cliente: "Carlos López",
      monto: 32000,
      metodo: "Transferencia",
      fecha: "2024-01-14",
    },
    {
      id: "ING-003",
      orden: "ORD-005",
      cliente: "Roberto Silva",
      monto: 18000,
      metodo: "Efectivo",
      fecha: "2024-01-12",
    },
  ]

  const egresosRecientes = [
    { id: "EGR-001", concepto: "Compra vidrios", monto: 15000, tipo: "Caja Chica", fecha: "2024-01-15" },
    { id: "EGR-002", concepto: "Vale combustible", monto: 8500, tipo: "Vale Personal", fecha: "2024-01-14" },
    { id: "EGR-003", concepto: "Herramientas", monto: 12000, tipo: "Caja Chica", fecha: "2024-01-13" },
  ]

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Completada":
        return "bg-blue-100 text-blue-800"
      case "Pagada":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMetodoColor = (metodo: string) => {
    switch (metodo) {
      case "Efectivo":
        return "bg-green-100 text-green-800"
      case "Transferencia":
        return "bg-blue-100 text-blue-800"
      case "Cheque":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Panel de Control</h1>
        <p className="text-gray-600">Resumen de actividad y acceso rápido a funciones principales</p>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveScreen("ordenes")}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors min-h-[60px]"
          >
            <Plus className="h-6 w-6" />
            Nueva Orden
          </button>
          <button
            onClick={() => setActiveScreen("egresos")}
            className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors min-h-[60px]"
          >
            <Plus className="h-6 w-6" />
            Registrar Egreso
          </button>
          <button
            onClick={() => setActiveScreen("ingresos")}
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors min-h-[60px]"
          >
            <Plus className="h-6 w-6" />
            Registrar Ingreso
          </button>
        </div>
      </div>

      {/* Órdenes de Trabajo Recientes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Órdenes de Trabajo Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-900">N° Orden</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900 hidden sm:table-cell">Vehículo</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Estado</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Fecha</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesRecientes.map((orden) => (
                <tr key={orden.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-blue-600">{orden.id}</td>
                  <td className="py-3 px-2">{orden.cliente}</td>
                  <td className="py-3 px-2 hidden sm:table-cell text-gray-600">{orden.vehiculo}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(orden.estado)}`}>
                      {orden.estado}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{orden.fecha}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos Recientes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingresos Recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-1 font-semibold text-gray-900 text-sm">Orden</th>
                  <th className="text-left py-2 px-1 font-semibold text-gray-900 text-sm">Cliente</th>
                  <th className="text-left py-2 px-1 font-semibold text-gray-900 text-sm">Monto</th>
                  <th className="text-left py-2 px-1 font-semibold text-gray-900 text-sm">Método</th>
                </tr>
              </thead>
              <tbody>
                {ingresosRecientes.map((ingreso) => (
                  <tr key={ingreso.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-1 font-medium text-blue-600 text-sm">{ingreso.orden}</td>
                    <td className="py-2 px-1 text-sm">{ingreso.cliente}</td>
                    <td className="py-2 px-1 font-semibold text-green-600 text-sm">
                      ${ingreso.monto.toLocaleString()}
                    </td>
                    <td className="py-2 px-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMetodoColor(ingreso.metodo)}`}>
                        {ingreso.metodo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Egresos Recientes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Egresos Recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-1 font-semibold text-gray-900 text-sm">Concepto</th>
                  <th className="text-left py-2 px-1 font-semibold text-gray-900 text-sm">Tipo</th>
                  <th className="text-left py-2 px-1 font-semibold text-gray-900 text-sm">Monto</th>
                </tr>
              </thead>
              <tbody>
                {egresosRecientes.map((egreso) => (
                  <tr key={egreso.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-1 text-sm">{egreso.concepto}</td>
                    <td className="py-2 px-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          egreso.tipo === "Caja Chica"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {egreso.tipo}
                      </span>
                    </td>
                    <td className="py-2 px-1 font-semibold text-red-600 text-sm">${egreso.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
