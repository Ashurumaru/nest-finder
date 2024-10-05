import { Prisma, Type, Property, HeatingType, ParkingType, LeaseTerm, PetPolicy } from '@prisma/client';


export interface PropertyDB {
    id?: string;
    title: string;
    price: number | Prisma.Decimal;
    imageUrls: string[];
    address: string;
    city: string;
    numBedrooms: number;
    numBathrooms: number;
    latitude: number | Prisma.Decimal;
    longitude: number | Prisma.Decimal;
    type: Type;
    property: Property;
    description?: string | null;
    petPolicy?: PetPolicy | null;
    propertySize?: number | null;
    schoolDistance?: number | null;
    busStopDistance?: number | null;
    yearBuilt?: number | null;
    floorNumber?: number | null;
    totalFloors?: number | null;
    heatingType?: HeatingType | null;
    parking: boolean;
    parkingType?: ParkingType | null;
    hasElevator: boolean;
    furnished: boolean;
    hoaFees?: number | Prisma.Decimal | null;
    lotSize?: number | null;
    basement: boolean;
    balcony: boolean;
    airConditioning: boolean;
    internetIncluded: boolean;
    smokingAllowed: boolean;
    moveInDate?: Date | null;
    leaseTerm?: LeaseTerm | null;
    createdAt?: Date;
    updatedAt?: Date;
    views?: number;
    userId: string;
}

export interface PostData {
    id: string;
    title: string;
    price: number | Prisma.Decimal;
    imageUrls: string[];
    address: string;
    city: string;
    numBedrooms: number;
    numBathrooms: number;
    latitude: number | Prisma.Decimal;
    longitude: number | Prisma.Decimal;
    type: Type;
    property: Property;
    description?: string | null;
    petPolicy?: PetPolicy | null;
    propertySize?: number | null;
    schoolDistance?: number | null;
    busStopDistance?: number | null;
    yearBuilt?: number | null;
    floorNumber?: number | null;
    totalFloors?: number | null;
    heatingType?: HeatingType | null;
    parking: boolean;
    parkingType?: ParkingType | null;
    hasElevator: boolean;
    furnished: boolean;
    hoaFees?: number | Prisma.Decimal | null;
    lotSize?: number | null;
    basement: boolean;
    balcony: boolean;
    airConditioning: boolean;
    internetIncluded: boolean;
    smokingAllowed: boolean;
    moveInDate?: string | null;
    leaseTerm?: LeaseTerm | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    views?: number;
    user?: {
        id: string;
        name: string;
        surname: string | null;
        email: string | null;
        phoneNumber: string | null;
    };}

export interface PropertyFilters {
    type?: 'sale' | 'rent';  // Тип сделки: аренда или продажа
    propertyType?: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial' | 'land'; // Тип недвижимости
    searchQuery?: string;    // Поиск по ключевым словам
    minPrice?: number;       // Минимальная цена
    maxPrice?: number;       // Максимальная цена
    minBedrooms?: number;    // Минимальное количество спален
    maxBedrooms?: number;    // Максимальное количество спален
    minBathrooms?: number;   // Минимальное количество ванных комнат
    maxBathrooms?: number;   // Максимальное количество ванных комнат
    minPropertySize?: number; // Минимальный размер недвижимости
    maxPropertySize?: number; // Максимальный размер недвижимости
    petPolicy?: 'ALLOWED' | 'NOT_ALLOWED' | 'NEGOTIABLE'; // Политика по животным
    heatingType?: 'GAS' | 'ELECTRIC' | 'SOLAR' | 'OTHER'; // Тип отопления
    parking?: boolean;       // Наличие парковки
    furnished?: boolean;     // Меблированность
    hasElevator?: boolean;   // Наличие лифта
    airConditioning?: boolean; // Наличие кондиционера
}

export type PropertyFormData = {
    // Шаг 1
    type: 'sale' | 'rent';
    property: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial' | 'land';
    title: string;
    description: string;

    // Шаг 2
    price: number;
    address: string;
    city: string;
    numBedrooms?: number;
    numBathrooms?: number;
    floorNumber?: number;
    totalFloors?: number;
    hasElevator?: boolean;
    lotSize?: number;
    basement?: boolean;
    latitude: number;
    longitude: number;

    // Шаг 3
    furnished?: boolean;
    airConditioning?: boolean;
    balcony?: boolean;
    moveInDate?: string; // ISO строка даты
    leaseTerm?: 'monthToMonth' | 'sixMonths' | 'oneYear' | 'twoYears' | 'other';

    // Шаг 4
    images: FileList | null;

    // Дополнительные поля
    [key: string]: any;
};