export interface Property  {
    id: string;
    title: string;
    price: number;
    imageUrls: string[];    // Массив URL изображений
    address: string;
    city: string;
    numBedrooms: number;    // Количество спален
    numBathrooms: number;   // Количество ванных комнат
    latitude: number;       // Широта
    longitude: number;      // Долгота
    type: 'sale' | 'rent';  // Тип недвижимости: аренда или продажа
    property: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial' | 'land'; // Тип собственности
    description: string | undefined | null;
    utilitiesIncluded?: string | undefined | null;  // Услуги, включенные в аренду
    petPolicy?: string | undefined | null;         // Политика по домашним животным
    incomeRequirement?: string | undefined | null;  // Требование к доходу
    propertySize?: number | undefined | null;       // Размер недвижимости (в кв. м.)
    schoolDistance?: number | undefined | null;     // Расстояние до школы
    busStopDistance?: number | undefined | null;    // Расстояние до автобусной остановки
    restaurantDistance?: number | undefined | null; // Расстояние до ресторанов
    createdAt: string;      // Дата создания
    updatedAt?: string;     // Дата обновления (необязательное поле)
    views: number;          // Количество просмотров
    userId: string;         // ID пользователя, разместившего объявление
    author?: string;        // Имя автора публикации
}

export interface PropertyFilters {
    type?: 'sale' | 'rent';  // Тип недвижимости: аренда или продажа
    propertyType?: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial' | 'land'; // Тип собственности
    searchQuery?: string;    // Поле для поиска по ключевым словам
    minPrice?: number;       // Минимальная цена
    maxPrice?: number;       // Максимальная цена
    minBedrooms?: number;    // Минимальное количество спален
    maxBedrooms?: number;    // Максимальное количество спален
    minBathrooms?: number;   // Минимальное количество ванных комнат
    maxBathrooms?: number;   // Максимальное количество ванных комнат
    createdAtBefore?: string;  // Фильтр по дате создания (до)
    createdAtAfter?: string;   // Фильтр по дате создания (после)
}
