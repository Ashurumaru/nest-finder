// services/propertyService.ts
import {PostData, ReservationData} from "@/types/propertyTypes";

const API_URL = process.env.API_URL;

// Функция для получения данных конкретной недвижимости по её ID
export async function fetchProperty(id: string): Promise<PostData | null> {
    const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: 'GET',
        cache: 'no-store',
    });

    if (res.status === 404) return null;
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка при получении данных недвижимости');
    }

    return res.json();
}

// Функция для получения данных о недвижимости
export async function fetchProperties(filters?: { userId?: string; type?: 'SALE' | 'RENT' }): Promise<PostData[]> {
    const url = new URL(`${API_URL}/api/properties`);

    // Логгирование входных данных
    console.log("Запрос на получение недвижимости начат с фильтрами:", filters);

    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
                console.log(`Добавлен параметр запроса: ${key} = ${value}`);
            }
        });
    }

    try {
        console.log("Формирование запроса по URL:", url.toString());

        const res = await fetch(url.toString(), {
            method: 'GET',
            cache: 'no-store',
        });

        console.log("Ответ сервера получен со статусом:", res.status);

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Ошибка в ответе сервера:", errorData);
            throw new Error(errorData.message || 'Ошибка при получении недвижимости');
        }

        const data = await res.json();
        console.log("Успешно получены данные недвижимости:", data);
        return data;
    } catch (error) {
        console.error('Ошибка при запросе fetchProperties:', error);
        throw error;
    }
}



// Функция для проверки, является ли объект избранным
export async function fetchIsFavorite(id: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/api/saved-properties/${id}/is-favorite`);
    if (!res.ok) return false;
    const { isFavorite } = await res.json();
    return isFavorite;
}

// Функция для получения списка бронирований с возможностью фильтрации
export async function fetchReservations(filters?: {
    postId?: string;
    userId?: string;
    future?: boolean;
    current?: boolean;
    past?: boolean;
}): Promise<ReservationData[]> {
    const url = new URL(`${API_URL}/api/reservations`);
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) url.searchParams.append(key, String(value));
        });
    }

    const res = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-store',
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка при получении бронирований');
    }

    return res.json();
}

// Функция для получения конкретного бронирования по id
export async function fetchReservationById(id: string): Promise<ReservationData | null> {
    const res = await fetch(`${API_URL}/api/reservations/${id}`, {
        method: 'GET',
        cache: 'no-store',
    });

    if (res.status === 404) return null;
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка при получении бронирования');
    }

    return res.json();
}

// Функция для создания бронирования
export interface CreateReservationParams {
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    postId: string;
}

export async function createReservation(data: CreateReservationParams): Promise<ReservationData> {
    const res = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            startDate: data.startDate,
            endDate: data.endDate,
            totalPrice: data.totalPrice,
            postId: data.postId,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка при создании бронирования');
    }

    return res.json();
}

// Функция для удаления бронирования
export async function deleteReservation(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/reservations/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка при удалении бронирования');
    }
}
