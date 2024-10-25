import { PostData } from "@/types/propertyTypes";

// Функция для получения данных о недвижимости
export async function fetchProperty(id: string): Promise<PostData | null> {
    const res = await fetch(`${process.env.API_URL}/api/properties/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
}

// Функция для проверки, является ли объект избранным
export async function fetchIsFavorite(id: string): Promise<boolean> {
    const res = await fetch(`${process.env.API_URL}/api/saved-properties/${id}/is-favorite`);
    if (!res.ok) return false;
    const { isFavorite } = await res.json();
    return isFavorite;
}
