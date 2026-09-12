import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Compara dos textos alfabéticamente en español (ignora acentos y
 * mayúsculas, y ordena los números de forma natural: 2 antes que 10).
 */
export function compararAlfabetico(a: string, b: string): number {
    return (a ?? '').localeCompare(b ?? '', 'es', {
        sensitivity: 'base',
        numeric: true,
    });
}

/**
 * Devuelve una copia del array ordenada alfabéticamente por la etiqueta
 * que ve el usuario. Se usa para que las opciones de los desplegables
 * aparezcan siempre de la A a la Z.
 */
export function ordenarPorEtiqueta<T>(items: T[], getLabel: (item: T) => string): T[] {
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => compararAlfabetico(getLabel(a), getLabel(b)));
}
