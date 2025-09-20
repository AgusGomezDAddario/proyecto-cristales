import React, { useState, useEffect } from 'react';
import { DollarSign, User, Phone, Mail, Car, FileText, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface PaymentMethod {
  id: string;
  metodo: string;
  monto: number;
}

export default function OrdenesScreen() {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    telefono: '',
    email: '',
    patente: '',
    marca: '',
    modelo: '',
    anio: '',
    tipoVidrio: '',
    conColocacion: false,
    conFactura: false,
    cantidad: 1,
    observacion: '',
    precioUnitario: '',
    total: 0,
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', metodo: 'efectivo', monto: 0 }
  ]);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const metodosPago = ['efectivo', 'credito', 'debito', 'transferencia'];

  useEffect(() => {
    const precio = parseFloat(formData.precioUnitario) || 0;
    const cantidad = formData.cantidad || 1;
    setFormData(prev => ({ ...prev, total: precio * cantidad }));
  }, [formData.precioUnitario, formData.cantidad]);

  const addPaymentMethod = () => {
    const newId = (paymentMethods.length + 1).toString();
    setPaymentMethods([...paymentMethods, { id: newId, metodo: 'efectivo', monto: 0 }]);
  };

  const removePaymentMethod = (id: string) => {
    if (paymentMethods.length > 1) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    }
  };

  const updatePaymentMethod = (id: string, field: 'metodo' | 'monto', value: string | number) => {
    setPaymentMethods(paymentMethods.map(pm => 
      pm.id === id ? { ...pm, [field]: value } : pm
    ));
  };

  const getTotalPayments = () => {
    return paymentMethods.reduce((sum, pm) => sum + pm.monto, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, boolean> = {};
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

      alert(`Orden ${numeroOrden} creada exitosamente!`);
      
      // Reset form
      setFormData({
        nombreCliente: '',
        telefono: '',
        email: '',
        patente: '',
        marca: '',
        modelo: '',
        anio: '',
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

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">📋 Nueva Orden de Trabajo</h1>
        <p className="text-gray-600 mt-1">Complete todos los campos obligatorios marcados con *</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Secciones del formulario con el nuevo color de marca */}
        <Section title="Datos del Cliente" icon={User} color="blue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre Completo *"
              value={formData.nombreCliente}
              onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
              error={errors.nombreCliente}
              placeholder="Ej: Juan Carlos Pérez"
            />
            
            <Input
              label="Teléfono *"
              type="tel"
              icon={Phone}
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/[^0-9]/g, '') })}
              error={errors.telefono}
              placeholder="Ej: 1112345678"
            />
            
            <Input
              label="Email (opcional)"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="Ej: juan@email.com"
            />
          </div>
        </Section>

        <Section title="Datos del Vehículo" icon={Car} color="green">
          {/* ... resto del formulario ... */}
        </Section>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" className="flex-1">
            💾 Guardar Orden
          </Button>
          
          <Button type="button" variant="outline" onClick={() => console.log('QR')}>
            Generar QR
          </Button>
        </div>
      </form>
    </div>
  );
}

// Componente de sección reutilizable
const Section: React.FC<{
  title: string;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  children: React.ReactNode;
}> = ({ title, icon: Icon, color, children }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200'
  };

  const iconColors = {
    blue: 'text-[var(--color-primary)]',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600'
  };

  return (
    <div className={`rounded-lg p-6 border-2 ${colorClasses[color]}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Icon className={`w-5 h-5 mr-2 ${iconColors[color]}`} />
        {title}
      </h2>
      {children}
    </div>
  );
};