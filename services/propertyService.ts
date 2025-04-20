import {User} from "@/types/userTypes";
import {PostData, PropertyDB, PropertyFormValues, ReservationData} from "@/types/propertyTypes";
import { ReservationStatus } from "@prisma/client";

const API_URL = process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'https://nest-finder-diplom.vercel.app'
    : 'http://localhost:3000';


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

/**
 * Creates a new property listing
 */
export async function createProperty(data: PropertyFormValues): Promise<PropertyFormValues> {
    try {
        // Ensure proper date handling
        const formattedData = formatPropertyData(data);

        const res = await fetch(`/api/properties`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedData),
        });

        const responseData = await res.json();

        if (!res.ok) {
            // Extract error details from the response
            const errorMessage = responseData.message || 'Ошибка при создании объявления';
            console.error('API Error:', responseData);

            if (responseData.errors) {
                // Handle validation errors
                const validationErrors = formatValidationErrors(responseData.errors);
                throw new Error(`${errorMessage}: ${validationErrors}`);
            }

            throw new Error(errorMessage);
        }

        return responseData.property;
    } catch (error) {
        console.error('Error creating property:', error);
        throw error;
    }
}

/**
 * Updates an existing property listing
 */
export async function updateProperty(id: string, data: PropertyFormValues): Promise<PropertyFormValues> {
    try {
        // Ensure proper date handling
        const formattedData = formatPropertyData(data);

        const res = await fetch(`/api/properties/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedData),
        });

        const responseData = await res.json();

        if (!res.ok) {
            // Extract error details from the response
            const errorMessage = responseData.message || 'Ошибка при обновлении объявления';
            console.error('API Error:', responseData);

            if (responseData.errors) {
                // Handle validation errors
                const validationErrors = formatValidationErrors(responseData.errors);
                throw new Error(`${errorMessage}: ${validationErrors}`);
            }

            throw new Error(errorMessage);
        }

        return responseData;
    } catch (error) {
        console.error('Error updating property:', error);
        throw error;
    }
}

/**
 * Formats property data for API submission
 */
function formatPropertyData(data: PropertyFormValues): PropertyFormValues {
    const formattedData = { ...data };

    // Convert string price to number
    if (typeof formattedData.price === 'string') {
        const priceAsString = formattedData.price as unknown as string;
        formattedData.price = Number(priceAsString.replace(/\s+/g, ''));
    }

    // Format apartment data if present
    if (formattedData.property === 'APARTMENT' && formattedData.apartment) {
        formattedData.apartment = cleanObjectValues(formattedData.apartment);
    }

    // Format house data if present
    if (formattedData.property === 'HOUSE' && formattedData.house) {
        formattedData.house = cleanObjectValues(formattedData.house);
    }

    // Format land plot data if present
    if (formattedData.property === 'LAND_PLOT' && formattedData.landPlot) {
        formattedData.landPlot = cleanObjectValues(formattedData.landPlot);
    }

    // Format rental features if present
    if (formattedData.type === 'RENT' && formattedData.rentalFeatures) {
        formattedData.rentalFeatures = cleanObjectValues(formattedData.rentalFeatures);
    }

    // Format sale features if present
    if (formattedData.type === 'SALE' && formattedData.saleFeatures) {
        formattedData.saleFeatures = cleanObjectValues(formattedData.saleFeatures);
    }

    return formattedData;
}
/**
 * Cleans object values (removes empty strings, formats dates)
 */
function cleanObjectValues(obj: Record<string, any>): Record<string, any> {
    const cleanedObj: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        // Skip empty values
        if (value === '' || value === null || value === undefined) {
            continue;
        }

        // Handle Date objects
        if (value instanceof Date) {
            cleanedObj[key] = value;
        } else {
            cleanedObj[key] = value;
        }
    }

    return cleanedObj;
}

/**
 * Formats validation errors into a readable string
 */
function formatValidationErrors(errors: Record<string, any>): string {
    const errorMessages: string[] = [];

    for (const field in errors) {
        if (errors[field]?._errors?.length) {
            errorMessages.push(`${field}: ${errors[field]._errors.join(', ')}`);
        }
    }

    return errorMessages.join('; ');
}

/**
 * Gets a property by ID
 */
export async function getPropertyById(id: string): Promise<PropertyFormValues | null> {
    try {
        const res = await fetch(`/api/properties/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            if (res.status === 404) {
                return null;
            }
            throw new Error('Ошибка при получении объявления');
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching property:', error);
        return null;
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