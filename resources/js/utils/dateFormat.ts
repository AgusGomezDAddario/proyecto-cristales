// ══════════════════════════════════════════════════════════════════
// HELPER PARA FORMATEAR FECHAS EN FORMATO ARGENTINO (dd/mm/yyyy)
// ══════════════════════════════════════════════════════════════════

// Crear archivo: resources/js/utils/dateFormat.ts

export function formatDateToArgentina(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString + 'T00:00:00'); // Evita problemas de timezone
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

export function formatDateTimeToArgentina(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}