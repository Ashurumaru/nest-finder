export function extractCityFromAddress(address: string): string {
    const parts = address.split(',');
    return parts.length > 4 ? parts[3].trim() : '';
}