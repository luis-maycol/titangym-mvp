const currencyFormatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
});

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

/**
 * Format an amount in soles, e.g. "S/ 80.00".
 */
export function formatPen(amount: string | number): string {
    return currencyFormatter.format(Number(amount));
}

/**
 * Format a "YYYY-MM-DD" date without shifting it to the browser timezone.
 */
export function formatDate(date: string | null): string {
    if (!date) {
        return '—';
    }

    const [year, month, day] = date.slice(0, 10).split('-').map(Number);

    return dateFormatter.format(new Date(year, month - 1, day));
}

/**
 * Human label for a plan duration, e.g. "1 mes" or "12 meses".
 */
export function formatDuration(months: number): string {
    return months === 1 ? '1 mes' : `${months} meses`;
}

const dateTimeFormatter = new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

/**
 * Format an ISO timestamp in the browser's local time, e.g. "05 feb., 14:30".
 */
export function formatDateTime(value: string | null): string {
    return value ? dateTimeFormatter.format(new Date(value)) : '—';
}
