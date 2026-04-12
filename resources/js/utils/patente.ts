const PATENTE_REGEX = /^(?:[A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/;

export function normalizePatente(value: string) {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidPatente(value: string) {
    return PATENTE_REGEX.test(normalizePatente(value));
}

export function getPatenteError(value: string) {
    if (!value.trim()) {
        return "La patente es obligatoria.";
    }

    if (!isValidPatente(value)) {
        return "Ingresá una patente válida. Ejemplos: ABC123 o AB123CD.";
    }

    return "";
}
