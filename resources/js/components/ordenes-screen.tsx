'use client';

import type React from 'react';

import { Car, DollarSign, Mail, Phone, Plus, Printer, QrCode, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentMethod {
    id: string;
    metodo: string;
    monto: number;
}

export function OrdenesScreen() {
    const [formData, setFormData] = useState({
        // Datos del Cliente
        nombreCliente: '',
        telefono: '',
        email: '',

        // Detalles del Vidrio
        tipoVidrio: '',
        conColocacion: false,
        cantidad: 1,

        // Pago
        precioUnitario: '',
        total: 0,
    });

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([{ id: '1', metodo: 'efectivo', monto: 0 }]);

    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [showQRModal, setShowQRModal] = useState(false);
    const [generatedOrder, setGeneratedOrder] = useState<any>(null);

    // Cálculo automático del total
    useEffect(() => {
        const precio = Number.parseFloat(formData.precioUnitario) || 0;
        const cantidad = formData.cantidad || 1;
        setFormData((prev) => ({ ...prev, total: precio * cantidad }));
    }, [formData.precioUnitario, formData.cantidad]);

    const metodosPago = ['Efectivo', 'Transferencia', 'Cheque', 'Tarjeta de Crédito', 'Tarjeta de Débito'];

    const addPaymentMethod = () => {
        const newId = (paymentMethods.length + 1).toString();
        setPaymentMethods([...paymentMethods, { id: newId, metodo: 'efectivo', monto: 0 }]);
    };

    const removePaymentMethod = (id: string) => {
        if (paymentMethods.length > 1) {
            setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
        }
    };

    const updatePaymentMethod = (id: string, field: 'metodo' | 'monto', value: string | number) => {
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

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const numeroOrden = `OT-${Date.now().toString().slice(-6)}`;

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
                fecha: new Date().toLocaleDateString('es-AR'),
            };

            setGeneratedOrder(orderData);

            const paymentSummary = paymentMethods
                .filter((pm) => pm.monto > 0)
                .map((pm) => `${pm.metodo}: $${pm.monto.toLocaleString()}`)
                .join('\n');

            alert(`Orden de trabajo generada exitosamente!
      
Número: ${numeroOrden}
Cliente: ${formData.nombreCliente}
Vidrio: ${formData.tipoVidrio}
Total: $${formData.total.toLocaleString()}

Pagos registrados:
${paymentSummary}
Total pagado: $${getTotalPayments().toLocaleString()}`);

            // Reset form
            setFormData({
                nombreCliente: '',
                telefono: '',
                email: '',
                tipoVidrio: '',
                conColocacion: false,
                cantidad: 1,
                precioUnitario: '',
                total: 0,
            });
            setPaymentMethods([{ id: '1', metodo: 'efectivo', monto: 0 }]);
        }
    };

    const handleGenerateQR = () => {
        if (!generatedOrder) {
            alert('Primero debe guardar la orden de trabajo');
            return;
        }
        setShowQRModal(true);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="rounded-lg bg-white shadow-sm">
            <div className="border-b p-6">
                <h1 className="text-xl font-semibold text-gray-800">📋 Nueva Orden de Trabajo</h1>
                <p className="mt-1 text-gray-600">Complete todos los campos obligatorios marcados con *</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 p-6">
                {/* Datos del Cliente */}
                <div className="rounded-lg bg-blue-50 p-6">
                    <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                        <User className="mr-2 h-5 w-5 text-blue-600" />
                        Datos del Cliente
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Nombre Completo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.nombreCliente}
                                onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                                className={`h-12 w-full rounded-lg border px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                                    errors.nombreCliente ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Ej: Juan Carlos Pérez"
                            />
                            {errors.nombreCliente && <p className="mt-1 text-sm text-red-500">Este campo es obligatorio</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Teléfono <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    className={`h-12 w-full rounded-lg border pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                                        errors.telefono ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: 11-1234-5678"
                                />
                            </div>
                            {errors.telefono && <p className="mt-1 text-sm text-red-500">Este campo es obligatorio</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Email (opcional)</label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 w-full rounded-lg border border-gray-300 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: juan@email.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detalles del Vidrio */}
                <div className="rounded-lg bg-green-50 p-6">
                    <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                        <Car className="mr-2 h-5 w-5 text-green-600" />
                        Detalles del Vidrio
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Tipo de Vidrio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.tipoVidrio}
                                onChange={(e) => setFormData({ ...formData, tipoVidrio: e.target.value })}
                                className={`h-12 w-full rounded-lg border px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                                    errors.tipoVidrio ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Ej: Parabrisas Chevrolet Onix 2020"
                            />
                            {errors.tipoVidrio && <p className="mt-1 text-sm text-red-500">Este campo es obligatorio</p>}
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="conColocacion"
                                checked={formData.conColocacion}
                                onChange={(e) => setFormData({ ...formData, conColocacion: e.target.checked })}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <label htmlFor="conColocacion" className="font-medium text-gray-700">
                                🔧 Con colocación incluida
                            </label>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.cantidad}
                                onChange={(e) => setFormData({ ...formData, cantidad: Number.parseInt(e.target.value) || 1 })}
                                className="h-12 w-full rounded-lg border border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-yellow-50 p-6">
                    <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                        <DollarSign className="mr-2 h-5 w-5 text-yellow-600" />
                        Información de Pago
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Precio Unitario <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precioUnitario}
                                    onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })}
                                    className={`h-12 w-full rounded-lg border pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                                        errors.precioUnitario ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.precioUnitario && <p className="mt-1 text-sm text-red-500">Este campo es obligatorio</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Total de la Orden</label>
                            <div className="relative">
                                <DollarSign className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.total.toLocaleString()}
                                    readOnly
                                    className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 pr-4 pl-10 text-lg font-semibold"
                                />
                            </div>
                        </div>

                        {/* Multiple Payment Methods */}
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
                                {paymentMethods.map((payment, index) => (
                                    <div key={payment.id} className="flex items-center gap-3 rounded-lg border bg-white p-3">
                                        <div className="flex-1">
                                            <select
                                                value={payment.metodo}
                                                onChange={(e) => updatePaymentMethod(payment.id, 'metodo', e.target.value)}
                                                className="h-10 w-full rounded-lg border border-gray-300 px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
                                        {paymentMethods.length > 1 && (
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
                                    <span className="font-medium text-gray-700">Total a cobrar:</span>
                                    <span className="font-semibold text-gray-800">${formData.total.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">Total registrado:</span>
                                    <span className={`font-semibold ${getTotalPayments() === formData.total ? 'text-green-600' : 'text-orange-600'}`}>
                                        ${getTotalPayments().toLocaleString()}
                                    </span>
                                </div>
                                {getTotalPayments() !== formData.total && formData.total > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">Pendiente:</span>
                                        <span className="font-semibold text-red-600">${(formData.total - getTotalPayments()).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                        type="submit"
                        className="flex h-14 flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        <span>💾 Guardar Orden</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleGenerateQR}
                        className="flex h-14 items-center justify-center space-x-2 rounded-lg bg-gray-600 px-6 font-semibold text-white transition-colors hover:bg-gray-700 sm:w-auto"
                    >
                        <QrCode className="h-5 w-5" />
                        <span>Generar QR</span>
                    </button>
                </div>
            </form>

            {showQRModal && generatedOrder && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Vista Previa de Impresión</h3>
                                <button onClick={() => setShowQRModal(false)} className="rounded-lg p-2 text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Print Preview Content */}
                            <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-6 print:border-none print:bg-white">
                                <div className="mb-6 text-center">
                                    <h2 className="text-xl font-bold text-gray-800">VIDRIERÍA</h2>
                                    <p className="text-gray-600">Orden de Trabajo</p>
                                </div>

                                {/* QR Code Placeholder */}
                                <div className="mb-6 flex justify-center">
                                    <div className="flex h-32 w-32 items-center justify-center border-2 border-gray-400 bg-gray-200">
                                        <QrCode className="h-16 w-16 text-gray-500" />
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
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={handlePrint}
                                    className="flex h-12 flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700"
                                >
                                    <Printer className="h-5 w-5" />
                                    <span>Imprimir</span>
                                </button>
                                <button
                                    onClick={() => setShowQRModal(false)}
                                    className="h-12 rounded-lg bg-gray-300 px-6 font-semibold text-gray-700 transition-colors hover:bg-gray-400"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
