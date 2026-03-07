'use client';

import { Calendar, Check, DollarSign, Plus, Search, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethod {
    id: string;
    metodo: string;
    monto: number;
}

interface OrdenTrabajo {
    id: string;
    numero: string;
    cliente: string;
    vidrio: string;
    precio: number;
    totalPagado: number;
    estado: 'pendiente' | 'completado';
    fechaCreacion: string;
    paymentHistory: PaymentMethod[];
}

export function IngresosScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrden, setSelectedOrden] = useState<OrdenTrabajo | null>(null);
    const [searchType, setSearchType] = useState('todas');

    const [newPayments, setNewPayments] = useState<PaymentMethod[]>([{ id: '1', metodo: 'efectivo', monto: 0 }]);

    const ordenes: OrdenTrabajo[] = [
        {
            id: '1',
            numero: 'OT-001',
            cliente: 'Juan Pérez',
            vidrio: 'Parabrisas Chevrolet Onix 2020',
            precio: 25000,
            totalPagado: 25000,
            estado: 'completado',
            fechaCreacion: '2024-01-15',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 25000 }],
        },
        {
            id: '2',
            numero: 'OT-002',
            cliente: 'María González',
            vidrio: 'Luneta trasera Ford Ka 2019',
            precio: 18000,
            totalPagado: 10000,
            estado: 'pendiente',
            fechaCreacion: '2024-01-16',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 10000 }],
        },
        {
            id: '3',
            numero: 'OT-003',
            cliente: 'Carlos López',
            vidrio: 'Parabrisas Toyota Corolla 2021',
            precio: 32000,
            totalPagado: 32000,
            estado: 'completado',
            fechaCreacion: '2024-01-17',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 32000 }],
        },
        {
            id: '4',
            numero: 'OT-004',
            cliente: 'Ana Martínez',
            vidrio: 'Vidrio lateral Volkswagen Gol 2018',
            precio: 15000,
            totalPagado: 0,
            estado: 'pendiente',
            fechaCreacion: '2024-01-18',
            paymentHistory: [],
        },
        {
            id: '5',
            numero: 'OT-005',
            cliente: 'Roberto Silva',
            vidrio: 'Parabrisas Nissan March 2020',
            precio: 22000,
            totalPagado: 22000,
            estado: 'completado',
            fechaCreacion: '2024-01-19',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 22000 }],
        },
        {
            id: '6',
            numero: 'OT-006',
            cliente: 'Laura Fernández',
            vidrio: 'Luneta Honda City 2019',
            precio: 19500,
            totalPagado: 9000,
            estado: 'pendiente',
            fechaCreacion: '2024-01-20',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 9000 }],
        },
        {
            id: '7',
            numero: 'OT-007',
            cliente: 'Diego Morales',
            vidrio: 'Parabrisas Fiat Cronos 2021',
            precio: 26000,
            totalPagado: 26000,
            estado: 'completado',
            fechaCreacion: '2024-01-21',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 26000 }],
        },
        {
            id: '8',
            numero: 'OT-008',
            cliente: 'Sofía Ruiz',
            vidrio: 'Vidrio lateral Peugeot 208 2020',
            precio: 16500,
            totalPagado: 0,
            estado: 'pendiente',
            fechaCreacion: '2024-01-22',
            paymentHistory: [],
        },
        {
            id: '9',
            numero: 'OT-009',
            cliente: 'Martín Castro',
            vidrio: 'Parabrisas Renault Logan 2019',
            precio: 23500,
            totalPagado: 23500,
            estado: 'completado',
            fechaCreacion: '2024-01-23',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 23500 }],
        },
        {
            id: '10',
            numero: 'OT-010',
            cliente: 'Valeria Torres',
            vidrio: 'Luneta Chevrolet Prisma 2018',
            precio: 17000,
            totalPagado: 0,
            estado: 'pendiente',
            fechaCreacion: '2024-01-24',
            paymentHistory: [],
        },
        {
            id: '11',
            numero: 'OT-011',
            cliente: 'Alejandro Vega',
            vidrio: 'Parabrisas Ford Fiesta 2020',
            precio: 24000,
            totalPagado: 24000,
            estado: 'completado',
            fechaCreacion: '2024-01-25',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 24000 }],
        },
        {
            id: '12',
            numero: 'OT-012',
            cliente: 'Camila Herrera',
            vidrio: 'Vidrio lateral Toyota Etios 2019',
            precio: 14500,
            totalPagado: 0,
            estado: 'pendiente',
            fechaCreacion: '2024-01-26',
            paymentHistory: [],
        },
        {
            id: '13',
            numero: 'OT-013',
            cliente: 'Nicolás Romero',
            vidrio: 'Parabrisas Hyundai HB20 2021',
            precio: 27000,
            totalPagado: 27000,
            estado: 'completado',
            fechaCreacion: '2024-01-27',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 27000 }],
        },
        {
            id: '14',
            numero: 'OT-014',
            cliente: 'Florencia Díaz',
            vidrio: 'Luneta Volkswagen Polo 2020',
            precio: 20000,
            totalPagado: 0,
            estado: 'pendiente',
            fechaCreacion: '2024-01-28',
            paymentHistory: [],
        },
        {
            id: '15',
            numero: 'OT-015',
            cliente: 'Sebastián Medina',
            vidrio: 'Parabrisas Citroën C4 2019',
            precio: 28500,
            totalPagado: 28500,
            estado: 'completado',
            fechaCreacion: '2024-01-29',
            paymentHistory: [{ id: '1', metodo: 'efectivo', monto: 28500 }],
        },
    ];

    const filteredOrdenes = ordenes.filter((orden) => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();

        switch (searchType) {
            case 'numero':
                return orden.numero.toLowerCase().includes(searchLower);
            case 'cliente':
                return orden.cliente.toLowerCase().includes(searchLower);
            case 'fecha':
                return orden.fechaCreacion.includes(searchTerm);
            default: // "todas"
                return (
                    orden.numero.toLowerCase().includes(searchLower) ||
                    orden.cliente.toLowerCase().includes(searchLower) ||
                    orden.fechaCreacion.includes(searchTerm)
                );
        }
    });

    // Show last 15 orders when no search term is entered, or filtered results when searching
    const ordersToShow = searchTerm ? filteredOrdenes : ordenes.slice(-15).reverse();

    const addPaymentMethod = () => {
        const newId = (newPayments.length + 1).toString();
        setNewPayments([...newPayments, { id: newId, metodo: 'efectivo', monto: 0 }]);
    };

    const removePaymentMethod = (id: string) => {
        if (newPayments.length > 1) {
            setNewPayments(newPayments.filter((pm) => pm.id !== id));
        }
    };

    const updatePaymentMethod = (id: string, field: 'metodo' | 'monto', value: string | number) => {
        setNewPayments(newPayments.map((pm) => (pm.id === id ? { ...pm, [field]: value } : pm)));
    };

    const getTotalNewPayments = () => {
        return newPayments.reduce((sum, pm) => sum + pm.monto, 0);
    };

    const handleSelectOrden = (orden: OrdenTrabajo) => {
        setSelectedOrden(orden);
        const remainingAmount = orden.precio - orden.totalPagado;
        setNewPayments([{ id: '1', metodo: 'efectivo', monto: remainingAmount > 0 ? remainingAmount : 0 }]);
    };

    const handleConfirmarPago = () => {
        if (!selectedOrden || getTotalNewPayments() <= 0) return;

        const validPayments = newPayments.filter((pm) => pm.monto > 0);
        const totalNewAmount = getTotalNewPayments();
        const newTotalPagado = selectedOrden.totalPagado + totalNewAmount;
        const willBeCompleted = newTotalPagado >= selectedOrden.precio;

        const paymentSummary = validPayments.map((pm) => `${pm.metodo}: $${pm.monto.toLocaleString()}`).join('\n');

        alert(`Pago registrado exitosamente:

Orden: ${selectedOrden.numero}
Cliente: ${selectedOrden.cliente}

Pagos registrados:
${paymentSummary}

Total pagado anteriormente: $${selectedOrden.totalPagado.toLocaleString()}
Nuevo pago: $${totalNewAmount.toLocaleString()}
Total pagado ahora: $${newTotalPagado.toLocaleString()}
Precio total: $${selectedOrden.precio.toLocaleString()}

${willBeCompleted ? '✅ ORDEN COMPLETADA - Totalmente pagada' : `⏳ Pendiente: $${(selectedOrden.precio - newTotalPagado).toLocaleString()}`}`);

        setSelectedOrden(null);
        setNewPayments([{ id: '1', metodo: 'efectivo', monto: 0 }]);
        setSearchTerm('');
    };

    return (
        <div className="space-y-6">
            {/* Búsqueda de Orden */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">🔍 Buscar Orden de Trabajo</h2>

                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Buscar por:</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: 'todas', label: 'Todas', icon: Search },
                            { value: 'numero', label: 'N° Orden', icon: Search },
                            { value: 'cliente', label: 'Cliente', icon: User },
                            { value: 'fecha', label: 'Fecha', icon: Calendar },
                        ].map((tipo) => (
                            <button
                                key={tipo.value}
                                onClick={() => setSearchType(tipo.value)}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    searchType === tipo.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <tipo.icon className="h-4 w-4" />
                                {tipo.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                        type="text"
                        placeholder={
                            searchType === 'numero'
                                ? 'Buscar por número de orden (ej: OT-001)...'
                                : searchType === 'cliente'
                                  ? 'Buscar por nombre del cliente...'
                                  : searchType === 'fecha'
                                    ? 'Buscar por fecha (ej: 2024-01-15)...'
                                    : 'Buscar por número, cliente o fecha...'
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 w-full rounded-lg border border-gray-300 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="max-h-60 space-y-2 overflow-y-auto">
                    {!searchTerm && (
                        <p className="mb-3 rounded bg-blue-50 p-2 text-sm text-gray-600">📋 Mostrando las últimas 15 órdenes de trabajo</p>
                    )}

                    {ordersToShow.map((orden) => (
                        <div
                            key={orden.id}
                            onClick={() => handleSelectOrden(orden)}
                            className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-gray-800">{orden.numero}</p>
                                    <p className="text-gray-600">{orden.cliente}</p>
                                    <p className="text-sm text-gray-500">{orden.vidrio}</p>
                                    <p className="text-xs text-gray-400">Fecha: {orden.fechaCreacion}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-800">${orden.precio.toLocaleString()}</p>
                                    <span
                                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                            orden.estado === 'completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {orden.estado === 'completado' ? '✅ Completado' : '⏳ Pendiente'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {searchTerm && ordersToShow.length === 0 && (
                        <p className="py-4 text-center text-gray-500">No se encontraron órdenes que coincidan con la búsqueda</p>
                    )}
                </div>
            </div>

            {/* Detalles de la Orden Seleccionada */}
            {selectedOrden && (
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">📋 Detalles de la Orden</h2>

                    <div className="mb-6 rounded-lg bg-gray-50 p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-600">Número de Orden</p>
                                <p className="font-semibold">{selectedOrden.numero}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Cliente</p>
                                <p className="font-semibold">{selectedOrden.cliente}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Vidrio</p>
                                <p className="font-semibold">{selectedOrden.vidrio}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Estado</p>
                                <span
                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                        selectedOrden.estado === 'completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {selectedOrden.estado === 'completado' ? '✅ Completado' : '⏳ Pendiente'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-gray-600">Precio Total</p>
                                    <p className="text-lg font-semibold">${selectedOrden.precio.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Pagado</p>
                                    <p className="text-lg font-semibold text-green-600">${selectedOrden.totalPagado.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pendiente</p>
                                    <p
                                        className={`text-lg font-semibold ${selectedOrden.precio - selectedOrden.totalPagado > 0 ? 'text-red-600' : 'text-green-600'}`}
                                    >
                                        ${(selectedOrden.precio - selectedOrden.totalPagado).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-md mb-4 font-semibold text-gray-800">💳 Registrar Nuevo Pago</h3>

                    <div className="space-y-4">
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">Métodos de Pago</label>
                                <button
                                    type="button"
                                    onClick={addPaymentMethod}
                                    className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar método
                                </button>
                            </div>

                            <div className="space-y-3">
                                {newPayments.map((payment) => (
                                    <div key={payment.id} className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
                                        <div className="flex-1">
                                            <select
                                                value={payment.metodo}
                                                onChange={(e) => updatePaymentMethod(payment.id, 'metodo', e.target.value)}
                                                className="h-10 w-full rounded-lg border border-gray-300 px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="efectivo">💵 Efectivo</option>
                                                <option value="transferencia">🏦 Transferencia</option>
                                                <option value="cheque">📄 Cheque</option>
                                                <option value="tarjeta de crédito">💳 Tarjeta de Crédito</option>
                                                <option value="tarjeta de débito">💳 Tarjeta de Débito</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <div className="relative">
                                                <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={payment.monto || ''}
                                                    onChange={(e) => updatePaymentMethod(payment.id, 'monto', Number.parseFloat(e.target.value) || 0)}
                                                    className="h-10 w-full rounded-lg border border-gray-300 pr-3 pl-9 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        {newPayments.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePaymentMethod(payment.id)}
                                                className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 rounded-lg bg-blue-50 p-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">Nuevo pago total:</span>
                                    <span className="font-semibold text-blue-600">${getTotalNewPayments().toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">Total después del pago:</span>
                                    <span className="font-semibold text-gray-800">
                                        ${(selectedOrden.totalPagado + getTotalNewPayments()).toLocaleString()}
                                    </span>
                                </div>
                                {selectedOrden.totalPagado + getTotalNewPayments() >= selectedOrden.precio && (
                                    <div className="mt-2 rounded bg-green-100 p-2 text-sm font-medium text-green-800">
                                        ✅ Esta orden se marcará como COMPLETADA
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botón Confirmar */}
                        <button
                            onClick={handleConfirmarPago}
                            disabled={getTotalNewPayments() <= 0}
                            className="flex h-14 w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            <Check className="h-5 w-5" />
                            <span>Confirmar Pago (${getTotalNewPayments().toLocaleString()})</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
