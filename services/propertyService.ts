import {User} from "@/types/userTypes";

const API_URL = process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'https://nest-finder-diplom.vercel.app'
    : 'http://localhost:3000';

// services/propertyService.ts
import { PostData, PropertyDB, ReservationData } from "@/types/propertyTypes";
import { ReservationStatus } from "@prisma/client";
import { PropertyFormValues } from "@/components/property/create-property/CreateUpdateProperty";

// Функция для получения данных конкретной недвижимости по её ID
export async function fetchPropertyData(id: string): Promise<PropertyFormValues | null> {
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
    const url = new URL(`${API_URL}/api/properties/`);
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    try {
        const res = await fetch(url.toString(), {
            method: 'GET',
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Ошибка в ответе сервера:", errorData);
            throw new Error(errorData.message || 'Ошибка при получении недвижимости');
        }

        return await res.json();
    } catch (error) {
        console.error('Ошибка при запросе fetchProperties:', error);
        throw error;
    }
}

export async function createProperty(data: PropertyFormValues): Promise<PropertyFormValues> {
    const res = await fetch(`${API_URL}/api/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка при создании объявления');
    }

    return res.json();
}

// Функция для обновления объявления недвижимости
export async function updateProperty(id: string, data: PropertyFormValues): Promise<PropertyFormValues> {
    const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка при обновлении объявления');
    }

    return res.json();
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
    status?: ReservationStatus;
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

export async function updateReservationStatus(id: string, status: ReservationStatus) {
    const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Ошибка при обновлении статуса.");
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

// пример fetchUserById
export async function fetchUserById(userId: string): Promise<User>  {
    const res = await fetch(`/api/user/${userId}`);

    if (!res.ok) {
        throw new Error('Не удалось получить данные пользователя');
    }

    return res.json();
};


export async function updateUser(userId: string, userData: any) {
    const res = await fetch(`${API_URL}/api/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, userId }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка при обновлении профиля');
    }

    return res.json();
}

export async function fetchUsers(): Promise<User[]> {
    try {
        const res = await fetch(`${process.env.API_URL}/api/user`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Ошибка при получении данных пользователей');
        }

        return await res.json();
    } catch (error) {
        return [];
    }
}

export async function submitComplaint(data: {
    postId: string;
    reason: string;
    description?: string;
}) {
    try {
        const response = await fetch('/api/complaints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to submit complaint');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting complaint:', error);
        throw error;
    }
}

export async function fetchComplaints(params?: {
    status?: string;
    page?: number;
    limit?: number;
}) {
    try {
        const queryParams = new URLSearchParams();

        if (params?.status) {
            queryParams.append('status', params.status);
        }

        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }

        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const url = `/api/complaints${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch complaints');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching complaints:', error);
        throw error;
    }
}

export async function updateComplaintStatus(complaintId: string, status: string) {
    try {
        const response = await fetch(`/api/complaints/${complaintId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update complaint status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating complaint status:', error);
        throw error;
    }
}