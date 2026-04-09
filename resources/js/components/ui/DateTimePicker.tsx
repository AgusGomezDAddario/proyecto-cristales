import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

interface DateTimePickerProps {
    value: string; // formato YYYY-MM-DD HH:mm (o Date string de js)
    onChange: (date: string) => void;
    minDate?: string; 
    maxDate?: string; 
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function DateTimePicker({
    value,
    onChange,
    minDate,
    maxDate,
    placeholder = 'Seleccionar fecha y hora',
    error = false,
    disabled = false,
    className = '',
}: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Convertir YYYY-MM-DD HH:mm a Date
    const parseDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;
        try {
            const cleanStr = dateStr.replace('T', ' ');
            const [datePart, timePart] = cleanStr.split(' ');
            const [year, month, day] = datePart.split('-').map(Number);
            let hours = 0, minutes = 0;
            if (timePart) {
                const timeParts = timePart.split(':').map(Number);
                hours = timeParts[0] || 0;
                minutes = timeParts[1] || 0;
            }
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                // Try fallback to standard Date parsing
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) return d;
                return null;
            }
            return new Date(year, month - 1, day, hours, minutes);
        } catch (e) {
            return null;
        }
    };

    // Convertir Date a YYYY-MM-DD HH:mm
    const formatForBackend = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    // Convertir a dd/mm/yyyy hh:mm (para mostrar)
    const formatForDisplay = (dateStr: string): string => {
        if (!dateStr) return '';
        const date = parseDate(dateStr);
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    useEffect(() => {
        if (value) {
            const date = parseDate(value);
            if (date && !isNaN(date.getTime())) setViewDate(date);
        } else {
            // If empty, set viewDate to current time so when user clicks a day, it gets now's time
            setViewDate(new Date());
        }
    }, [value]);

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
        const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, viewDate.getHours(), viewDate.getMinutes());
        const formatted = formatForBackend(selectedDate);

        if (minDate && formatted < minDate) return;
        if (maxDate && formatted > maxDate) return;

        onChange(formatted);
        // keep open so they can edit time
    };

    const handleTimeChange = (type: 'hours' | 'minutes', val: string) => {
        const num = parseInt(val, 10) || 0;
        const newDate = new Date(viewDate.getTime());
        if (type === 'hours') newDate.setHours(Math.max(0, Math.min(23, num)));
        if (type === 'minutes') newDate.setMinutes(Math.max(0, Math.min(59, num)));
        
        setViewDate(newDate);
        
        // If an actual date is selected (value has something), update it
        if (value) {
            const parsedValue = parseDate(value);
            if (parsedValue) {
                const updatedSelectedDate = new Date(parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate(), newDate.getHours(), newDate.getMinutes());
                onChange(formatForBackend(updatedSelectedDate));
            }
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setViewDate(new Date());
    };

    const prevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1, viewDate.getHours(), viewDate.getMinutes()));
    };

    const nextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1, viewDate.getHours(), viewDate.getMinutes()));
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

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDateForCheck = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            const dateStrForCheck = `${currentDateForCheck.getFullYear()}-${String(currentDateForCheck.getMonth() + 1).padStart(2, '0')}-${String(currentDateForCheck.getDate()).padStart(2, '0')}`;

            const isSelected =
                selectedDate &&
                currentDateForCheck.getDate() === selectedDate.getDate() &&
                currentDateForCheck.getMonth() === selectedDate.getMonth() &&
                currentDateForCheck.getFullYear() === selectedDate.getFullYear();

            const isToday =
                currentDateForCheck.getDate() === today.getDate() &&
                currentDateForCheck.getMonth() === today.getMonth() &&
                currentDateForCheck.getFullYear() === today.getFullYear();

            const isDisabled = false;

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDate(day)}
                    disabled={isDisabled}
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

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full min-w-[320px] bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
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

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                            <div key={i} className="text-center text-xs font-bold text-gray-500 p-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">Hora:</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                min="0" max="23"
                                value={String(viewDate.getHours()).padStart(2, '0')}
                                onChange={(e) => handleTimeChange('hours', e.target.value)}
                                className="w-12 p-1 text-center bg-white border border-gray-300 rounded outline-none focus:border-green-500 text-sm"
                            />
                            <span className="font-bold text-gray-500">:</span>
                            <input
                                type="number"
                                min="0" max="59"
                                value={String(viewDate.getMinutes()).padStart(2, '0')}
                                onChange={(e) => handleTimeChange('minutes', e.target.value)}
                                className="w-12 p-1 text-center bg-white border border-gray-300 rounded outline-none focus:border-green-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date();
                                onChange(formatForBackend(today));
                                setIsOpen(false);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                            Ahora
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
