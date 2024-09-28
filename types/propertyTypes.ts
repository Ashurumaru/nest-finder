export interface PostDetail {
    description?: string;           // Описание недвижимости
    propertySize?: number | null;   // Разрешаем null в качестве допустимого значения
    utilitiesIncluded?: string | null; // Услуги, включенные в аренду
    petPolicy?: string | null;      // Политика по домашним животным
    incomeRequirement?: string | null; // Требование к доходу
    schoolDistance?: number | null; // Расстояние до школы
    busStopDistance?: number | null; // Расстояние до автобусной остановки
    restaurantDistance?: number | null; // Расстояние до ресторанов
}

export interface Property {
    id: string;
    title: string;
    price: number;
    imageUrls: string[];
    address: string;
    city: string;
    numBedrooms: number;
    numBathrooms: number;
    latitude: number;
    longitude: number;
    postDetail?: PostDetail; // Связанные детали
    type: 'sale' | 'rent';   // Тип недвижимости: аренда или продажа
    property: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial' | 'land'; // Тип собственности
}

export interface PropertyFilters {
    type?: "sale" | "rent";
    propertyType?: "apartment" | "house" | "condo" | "townhouse" | "commercial" | "land";
    searchQuery?: string;  // Поле для поиска по ключевым словам
    minPrice?: number;     // Минимальная цена
    maxPrice?: number;     // Максимальная цена
    minBedrooms?: number;  // Минимальное количество спален
    maxBedrooms?: number;  // Максимальное количество спален
    minBathrooms?: number; // Минимальное количество ванных комнат
    maxBathrooms?: number; // Максимальное количество ванных комнат
}