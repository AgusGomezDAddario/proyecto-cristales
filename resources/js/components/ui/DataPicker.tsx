import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
    value: string; // formato YYYY-MM-DD (para el backend)
    onChange: (date: string) => void;
    minDate?: string; // YYYY-MM-DD
    maxDate?: string; // YYYY-MM-DD
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function DatePicker({
    value,
    onChange,
    minDate,
    maxDate,
    placeholder = 'Seleccionar fecha',
    error = false,
    disabled = false,
    className = '',
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Convertir YYYY-MM-DD a Date
    const parseDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // Convertir Date a YYYY-MM-DD
    const formatForBackend = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Convertir YYYY-MM-DD a dd/mm/yyyy (para mostrar)
    const formatForDisplay = (dateStr: string): string => {
        if (!dateStr) return '';
        const date = parseDate(dateStr);
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Sincronizar viewDate con value cuando cambia
    useEffect(() => {
        if (value) {
            const date = parseDate(value);
            if (date) setViewDate(date);
        }
    }, [value]);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleSelectDate = (day: number) => {
        const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const formatted = formatForBackend(selectedDate);

        // Validar min/max
        if (minDate && formatted < minDate) return;
        if (maxDate && formatted > maxDate) return;

        onChange(formatted);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    const prevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(viewDate);
        const firstDay = getFirstDayOfMonth(viewDate);
        const days = [];

        const selectedDate = value ? parseDate(value) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Días vacíos del mes anterior
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2" />);
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            const dateStr = formatForBackend(currentDate);

            const isSelected =
                selectedDate &&
                currentDate.getDate() === selectedDate.getDate() &&
                currentDate.getMonth() === selectedDate.getMonth() &&
                currentDate.getFullYear() === selectedDate.getFullYear();

            const isToday =
                currentDate.getDate() === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

            const isDisabled =
                (minDate && dateStr < minDate) ||
                (maxDate && dateStr > maxDate);

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => !isDisabled && handleSelectDate(day)}
                    disabled={isDisabled ? true : false}
                    className={`
                        p-2 text-sm font-medium rounded-lg transition-all
                        ${isSelected
                            ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
                            : isToday
                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                : isDisabled
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                        }
                    `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const displayValue = formatForDisplay(value);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Input */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between gap-2
                    rounded-xl border-2 bg-gray-50 px-4 py-3 
                    font-medium text-gray-900 transition cursor-pointer
                    ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <div className="flex items-center gap-2 flex-1">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className={displayValue ? 'text-gray-900' : 'text-gray-400'}>
                        {displayValue || placeholder}
                    </span>
                </div>
                {displayValue && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1 hover:bg-gray-200 rounded-lg transition"
                    >
                        <X className="h-4 w-4 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Calendar Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full min-w-[320px] bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="text-center font-bold text-gray-800">
                            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </div>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Días de la semana */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                            <div key={i} className="text-center text-xs font-bold text-gray-500 p-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Días del mes */}
                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>

                    {/* Footer con botón Hoy */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date();
                                const formatted = formatForBackend(today);
                                
                                // Validar min/max
                                if (minDate && formatted < minDate) return;
                                if (maxDate && formatted > maxDate) return;

                                onChange(formatted);
                                setIsOpen(false);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                            Hoy
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}