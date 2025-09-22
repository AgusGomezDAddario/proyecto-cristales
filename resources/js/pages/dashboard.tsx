import { useState } from "react"
import {EgresosScreen} from "./../components/egresos-screen"
import {IngresosScreen} from "@/components/ingresos-screen"
import {OrdenesScreen} from "@/components/ordenes-screen"
import {DashboardScreen} from "@/components/dashboard-screen"

export default function Page() {
  const [activeScreen, setActiveScreen] = useState<"dashboard" | "egresos" | "ingresos" | "ordenes">("dashboard")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1 py-4">
            <button
              onClick={() => setActiveScreen("dashboard")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeScreen === "dashboard" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Panel de Control
            </button>
            <button
              onClick={() => setActiveScreen("egresos")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeScreen === "egresos" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Carga de Egresos
            </button>
            <button
              onClick={() => setActiveScreen("ingresos")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeScreen === "ingresos" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Carga de Ingresos
            </button>
            <button
              onClick={() => setActiveScreen("ordenes")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeScreen === "ordenes" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Órdenes de Trabajo
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeScreen === "dashboard" && <DashboardScreen setActiveScreen={setActiveScreen} />}
        {activeScreen === "egresos" && <EgresosScreen />}
        {activeScreen === "ingresos" && <IngresosScreen />}
        {activeScreen === "ordenes" && <OrdenesScreen />}
      </main>
    </div>
  )
}
