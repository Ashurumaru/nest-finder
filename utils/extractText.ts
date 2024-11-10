import { TRANSLATIONS } from "@/constants/translations";

export function extractCityFromAddress(address: string): string {
    const parts = address.split(',');
    return parts.length > 4 ? parts[3].trim() : '';
}

export function getTranslation(enumType: keyof typeof TRANSLATIONS, value: string): string {
    const enumTranslations = TRANSLATIONS[enumType] as Record<string, string>;
    return enumTranslations[value] || value;
}
