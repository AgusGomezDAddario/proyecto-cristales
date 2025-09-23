import { Car, DollarSign, FileText, Mail, Phone, Plus, Printer, Trash2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PaymentMethod {
    id: string;
    metodo: string;
    monto: number;
}

export default function CreateOrdenes() {
    const [formData, setFormData] = useState({
        // Datos del Cliente
        nombreCliente: '',
        telefono: '',
        email: '',

        // Datos del Vehículo
        patente: '',
        marca: '',
        modelo: '',
        anio: 1,

        // Detalles del Vidrio
        tipoVidrio: '',
        conColocacion: false,
        conFactura: false,
        cantidad: 1,
        observacion: '',

        // Pago
        precioUnitario: '',
        total: 0,
    });

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([{ id: '1', metodo: 'efectivo', monto: 0 }]);

    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [generatedOrder, setGeneratedOrder] = useState<any>(null);

    // TODO: Reemplazar con método GET 'obtenerMetodosPago' en el futuro
    const metodosPago = ['efectivo', 'credito', 'debito', 'transferencia'];

    // Cálculo automático del total
    useEffect(() => {
        const precio = Number.parseFloat(formData.precioUnitario) || 0;
        const cantidad = formData.cantidad || 1;
        setFormData((prev) => ({ ...prev, total: precio * cantidad }));
    }, [formData.precioUnitario, formData.cantidad]);

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
        if (!formData.patente) newErrors.patente = true;
        if (formData.email && !formData.email.includes('@')) newErrors.email = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const prefix = formData.conFactura ? 'FC-' : 'OT-';
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
                    anio: formData.anio,
                },
                tipoVidrio: formData.tipoVidrio,
                conColocacion: formData.conColocacion,
                conFactura: formData.conFactura,
                cantidad: formData.cantidad,
                observacion: formData.observacion,
                total: formData.total,
                totalPagado: getTotalPayments(),
                paymentMethods: paymentMethods.filter((pm) => pm.monto > 0),
                fecha: new Date().toLocaleDateString('es-AR'),
                estado: 'Iniciado',
            };

            setGeneratedOrder(orderData);

            const paymentSummary = paymentMethods
                .filter((pm) => pm.monto > 0)
                .map((pm) => `${pm.metodo}: $${pm.monto.toLocaleString()}`)
                .join('\n');

            alert(
                `Orden de trabajo generada exitosamente!\n\nNúmero: ${numeroOrden}\nCliente: ${formData.nombreCliente}\nTotal: $${formData.total.toLocaleString()}`,
            );

            // Reset form
            setFormData({
                nombreCliente: '',
                telefono: '',
                email: '',
                patente: '',
                marca: '',
                modelo: '',
                anio: 1,
                tipoVidrio: '',
                conColocacion: false,
                conFactura: false,
                cantidad: 1,
                observacion: '',
                precioUnitario: '',
                total: 0,
            });
            setPaymentMethods([{ id: '1', metodo: 'efectivo', monto: 0 }]);
        }
    };

    const handlePrint = () => {
        console.log('Función de impresión a implementar');
    };

    // const handleGenerateQR = () => {
    //   console.log("Función de QR a implementar");
    // };

    return (
        <div className="rounded-lg border bg-background">
            <div className="border-b p-6">
                <h1 className="text-2xl font-semibold text-foreground">📋 Nueva Orden de Trabajo</h1>
                <p className="mt-1 text-muted-foreground">Complete todos los campos obligatorios marcados con *</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {/* Sección: Datos del Cliente */}
                <div className="rounded-lg border bg-muted/50 p-6">
                    <h2 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                        <User className="mr-2 h-5 w-5 text-primary" />
                        Datos del Cliente
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Nombre Completo <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.nombreCliente}
                                onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                                className={`h-10 w-full rounded-md border px-3 focus:border-primary focus:ring-2 focus:ring-primary ${
                                    errors.nombreCliente ? 'border-destructive' : 'border-input'
                                }`}
                                placeholder="Ej: Juan Carlos Pérez"
                            />
                            {errors.nombreCliente && <p className="mt-1 text-sm text-destructive">Este campo es obligatorio</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Teléfono <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setFormData({ ...formData, telefono: value });
                                    }}
                                    className={`h-10 w-full rounded-md border pr-3 pl-9 focus:border-primary focus:ring-2 focus:ring-primary ${
                                        errors.telefono ? 'border-destructive' : 'border-input'
                                    }`}
                                    placeholder="Ej: 1112345678"
                                />
                            </div>
                            {errors.telefono && <p className="mt-1 text-sm text-destructive">Este campo es obligatorio</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Email (opcional)</label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`h-10 w-full rounded-md border pr-3 pl-9 focus:border-primary focus:ring-2 focus:ring-primary ${
                                        errors.email ? 'border-destructive' : 'border-input'
                                    }`}
                                    placeholder="Ej: juan@email.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-destructive">Ingrese un email válido</p>}
                        </div>
                    </div>
                </div>

                {/* Sección: Datos del Vehículo */}
                <div className="rounded-lg border bg-muted/50 p-6">
                    <h2 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                        <Car className="mr-2 h-5 w-5 text-primary" />
                        Datos del Vehículo
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Patente <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.patente}
                                onChange={(e) => setFormData({ ...formData, patente: e.target.value })}
                                className={`h-10 w-full rounded-md border px-3 focus:border-primary focus:ring-2 focus:ring-primary ${
                                    errors.patente ? 'border-destructive' : 'border-input'
                                }`}
                                placeholder="Ej: AB123CD"
                            />
                            {errors.patente && <p className="mt-1 text-sm text-destructive">Este campo es obligatorio</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Marca (opcional)</label>
                            <input
                                type="text"
                                value={formData.marca}
                                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                className="h-10 w-full rounded-md border border-input px-3 focus:border-primary focus:ring-2 focus:ring-primary"
                                placeholder="Ej: Chevrolet"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Modelo (opcional)</label>
                            <input
                                type="text"
                                value={formData.modelo}
                                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                                className="h-10 w-full rounded-md border border-input px-3 focus:border-primary focus:ring-2 focus:ring-primary"
                                placeholder="Ej: Onix"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Año (opcional)</label>
                            <input
                                type="number"
                                min="1900"
                                max={new Date().getFullYear()}
                                value={formData.anio}
                                onChange={(e) => setFormData({ ...formData, anio: Number(e.target.value) || 1 })}
                                className="h-10 w-full rounded-md border border-input px-3 focus:border-primary focus:ring-2 focus:ring-primary"
                                placeholder="Ej: 2020"
                            />
                        </div>
                    </div>
                </div>

                {/* Sección: Detalles del Vidrio */}
                <div className="rounded-lg border bg-muted/50 p-6">
                    <h2 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        Detalles del Vidrio
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Tipo de Vidrio <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.tipoVidrio}
                                onChange={(e) => setFormData({ ...formData, tipoVidrio: e.target.value })}
                                className={`h-10 w-full rounded-md border px-3 focus:border-primary focus:ring-2 focus:ring-primary ${
                                    errors.tipoVidrio ? 'border-destructive' : 'border-input'
                                }`}
                                placeholder="Ej: Parabrisas Chevrolet Onix 2020"
                            />
                            {errors.tipoVidrio && <p className="mt-1 text-sm text-destructive">Este campo es obligatorio</p>}
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="conColocacion"
                                checked={formData.conColocacion}
                                onChange={(e) => setFormData({ ...formData, conColocacion: e.target.checked })}
                                className="h-4 w-4 rounded text-primary"
                            />
                            <label htmlFor="conColocacion" className="font-medium text-foreground">
                                🔧 Con colocación incluida
                            </label>
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="conFactura"
                                checked={formData.conFactura}
                                onChange={(e) => setFormData({ ...formData, conFactura: e.target.checked })}
                                className="h-4 w-4 rounded text-primary"
                            />
                            <label htmlFor="conFactura" className="font-medium text-foreground">
                                🧾 Con factura
                            </label>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.cantidad}
                                onChange={(e) => setFormData({ ...formData, cantidad: Number.parseInt(e.target.value) || 1 })}
                                className="h-10 w-full rounded-md border border-input px-3 focus:border-primary focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Observación (opcional)</label>
                            <textarea
                                value={formData.observacion}
                                onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
                                rows={3}
                                className="w-full rounded-md border border-input px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary"
                                placeholder="Notas adicionales sobre la orden..."
                                maxLength={500}
                            />
                            <p className="mt-1 text-sm text-muted-foreground">{formData.observacion.length}/500 caracteres</p>
                        </div>
                    </div>
                </div>

                {/* Sección: Información de Pago */}
                <div className="rounded-lg border bg-muted/50 p-6">
                    <h2 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                        <DollarSign className="mr-2 h-5 w-5 text-primary" />
                        Información de Pago
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Precio Unitario <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precioUnitario}
                                    onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })}
                                    className={`h-10 w-full rounded-md border pr-3 pl-9 focus:border-primary focus:ring-2 focus:ring-primary ${
                                        errors.precioUnitario ? 'border-destructive' : 'border-input'
                                    }`}
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.precioUnitario && <p className="mt-1 text-sm text-destructive">Este campo es obligatorio</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Total de la Orden</label>
                            <div className="relative">
                                <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <input
                                    type="text"
                                    value={formData.total.toLocaleString()}
                                    readOnly
                                    className="h-10 w-full rounded-md border border-input bg-muted pr-3 pl-9 font-semibold"
                                />
                            </div>
                        </div>

                        {/* Múltiples Métodos de Pago */}
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <label className="block text-sm font-medium text-foreground">Métodos de Pago</label>
                                <button
                                    type="button"
                                    onClick={addPaymentMethod}
                                    className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1 text-sm text-primary transition-colors hover:bg-primary/20"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar método
                                </button>
                            </div>

                            <div className="space-y-3">
                                {paymentMethods.map((payment) => (
                                    <div key={payment.id} className="flex items-center gap-3 rounded-md border bg-background p-3">
                                        <div className="flex-1">
                                            <select
                                                value={payment.metodo}
                                                onChange={(e) => updatePaymentMethod(payment.id, 'metodo', e.target.value)}
                                                className="h-9 w-full rounded-md border border-input px-3 focus:border-primary focus:ring-2 focus:ring-primary"
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
                                                <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={payment.monto || ''}
                                                    onChange={(e) => updatePaymentMethod(payment.id, 'monto', Number.parseFloat(e.target.value) || 0)}
                                                    className="h-9 w-full rounded-md border border-input pr-3 pl-9 focus:border-primary focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                        </div>
                                        {paymentMethods.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePaymentMethod(payment.id)}
                                                className="rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 rounded-md bg-primary/10 p-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-foreground">Total a cobrar:</span>
                                    <span className="font-semibold text-foreground">${formData.total.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-foreground">Total registrado:</span>
                                    <span className={`font-semibold ${getTotalPayments() === formData.total ? 'text-green-600' : 'text-amber-600'}`}>
                                        ${getTotalPayments().toLocaleString()}
                                    </span>
                                </div>
                                {getTotalPayments() !== formData.total && formData.total > 0 && (
                                    <div className="flex items-center justify-between text-sm">
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
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        type="submit"
                        className="h-11 flex-1 rounded-md bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        💾 Guardar Orden
                    </button>

                    {/* <button
            type="button"
            onClick={handleGenerateQR}
            className="sm:w-auto px-4 h-11 bg-secondary text-secondary-foreground font-semibold rounded-md transition-colors hover:bg-secondary/80"
          >
            <QrCode className="w-4 h-4 mr-2 inline" />
            Generar QR
          </button> */}

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="h-11 rounded-md bg-muted px-4 font-semibold text-muted-foreground transition-colors hover:bg-muted/80 sm:w-auto"
                    >
                        <Printer className="mr-2 inline h-4 w-4" />
                        Imprimir
                    </button>
                </div>
            </form>
        </div>
    );
}
