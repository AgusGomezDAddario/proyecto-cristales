// resources/js/utils/dateFormat.ts

/**
 * Obtiene la fecha actual en Argentina (UTC-3)
 * Retorna en formato yyyy-mm-dd para inputs type="date"
 */
export function getArgentinaToday(): string {
  const now = new Date();
  // Convertir a Argentina (UTC-3)
  const argDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  
  const year = argDate.getFullYear();
  const month = String(argDate.getMonth() + 1).padStart(2, '0');
  const day = String(argDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Obtiene la fecha y hora actual en Argentina (UTC-3)
 * Retorna en formato yyyy-mm-dd hh:mm para inputs y valores por defecto
 */
export function getArgentinaNow(): string {
  const now = new Date();
  const argDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  
  const year = argDate.getFullYear();
  const month = String(argDate.getMonth() + 1).padStart(2, '0');
  const day = String(argDate.getDate()).padStart(2, '0');
  const hours = String(argDate.getHours()).padStart(2, '0');
  const minutes = String(argDate.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Convierte una fecha en formato yyyy-mm-dd a dd/mm/yyyy para mostrar
 * @param dateString - Fecha en formato yyyy-mm-dd o ISO
 * @returns Fecha en formato dd/mm/yyyy
 */
export function formatDateToArgentina(dateString: string | null | undefined): string {
  if (!dateString) return '';
  
  try {
    // Manejo de diferentes formatos
    let date: Date;
    
    // Si es formato yyyy-mm-dd (del backend o input)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } 
    // Si es formato ISO completo
    else {
      date = new Date(dateString);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida:', dateString);
      return '';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error al formatear fecha:', dateString, error);
    return '';
  }
}

/**
 * Convierte una fecha-hora en formato ISO a dd/mm/yyyy hh:mm para mostrar
 * @param dateString - Fecha en formato ISO
 * @returns Fecha en formato dd/mm/yyyy hh:mm
 */
export function formatDateTimeToArgentina(dateString: string | null | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn('Fecha-hora inválida:', dateString);
      return '';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error al formatear fecha-hora:', dateString, error);
    return '';
  }
}

/**
 * Convierte dd/mm/yyyy a yyyy-mm-dd para inputs
 * @param dateString - Fecha en formato dd/mm/yyyy
 * @returns Fecha en formato yyyy-mm-dd
 */
export function parseArgentinaDate(dateString: string): string {
  if (!dateString) return '';
  
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
}