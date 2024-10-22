import {
    Prisma,
    Type,
    Property,
    HeatingType,
    ParkingType,
    PetPolicy,
    RentalTerm,
    UtilitiesPayment,
    BuildingType
} from '@prisma/client';

// Интерфейс для основной сущности PropertyDB
export interface PropertyDB {
    id?: string;
    title: string;
    price: number | Prisma.Decimal;
    imageUrls: string[];
    address: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
    type: Type; // 'SALE' | 'RENT'
    property: Property; // 'APARTMENT' | 'HOUSE' | 'LAND_PLOT'
    description?: string | null;
    yearBuilt?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
    views?: number;
    userId: string;

    // Связанные модели для разных типов недвижимости
    apartment?: ApartmentDB | null;
    house?: HouseDB | null;
    landPlot?: LandPlotDB | null;

    // Характеристики аренды и продажи
    rentalFeatures?: RentalFeaturesDB | null;
    saleFeatures?: SaleFeaturesDB | null;
}

// Интерфейс для апартаментов (квартир)
export interface ApartmentDB {
    id: string;
    numBedrooms: number;
    numBathrooms: number;
    floorNumber?: number;
    totalFloors?: number;
    apartmentArea?: number;
    buildingType?: BuildingType | null;
    yearBuilt?: number;
    ceilingHeight?: number;
    hasBalcony?: boolean;
    hasLoggia?: boolean;
    hasWalkInCloset?: boolean;
    hasPassengerElevator?: boolean;
    hasFreightElevator?: boolean;
    elevatorType?: string;
    heatingType?: HeatingType | null;
    renovationState?: string;
    parkingType?: ParkingType | null;
    furnished?: boolean | null;
    internetSpeed?: number;
    flooring?: string;
    soundproofing?: boolean;
}

// Интерфейс для домов
export interface HouseDB {
    id: string;
    numberOfFloors?: number;
    numberOfRooms?: number;
    houseArea?: number;
    landArea?: number;
    wallMaterial?: string;
    hasGarage?: boolean;
    garageArea?: number;
    hasBasement?: boolean;
    basementArea?: number;
    additionalBuildings?: string;
    heatingType?: HeatingType | null;
    houseCondition?: string;
    fencing?: boolean;
    furnished?: boolean | null;
    internetSpeed?: number;
    flooring?: string;
    soundproofing?: boolean;
}

// Интерфейс для земельных участков
export interface LandPlotDB {
    id: string;
    landArea?: number;
    landPurpose?: string;
    waterSource?: string;
    fencing?: boolean;
}

// Интерфейс для характеристик аренды
export interface RentalFeaturesDB {
    id: string;
    rentalTerm?: RentalTerm; // 'DAILY_PAYMENT' | 'WEEKLY_PAYMENT' | 'MONTHLY_PAYMENT'
    securityDeposit?: number | Prisma.Decimal;
    securityDepositConditions?: string;
    utilitiesPayment?: UtilitiesPayment;
    utilitiesCost?: number | Prisma.Decimal;
    leaseAgreementUrl?: string;
    petPolicy?: PetPolicy | null; // 'ALLOWED' | 'NOT_ALLOWED'
    availabilityDate?: Date;
    minimumLeaseTerm?: number;
    maximumLeaseTerm?: number;
}

// Интерфейс для характеристик продажи
export interface SaleFeaturesDB {
    id: string;
    mortgageAvailable?: boolean;
    priceNegotiable?: boolean;
    availabilityDate?: Date;
    titleDeedUrl?: string;
}

// Окончательная версия интерфейса для данных публикации (PostData)
export interface PostData {
    id?: string;
    title: string;
    price: number | Prisma.Decimal;
    imageUrls: string[];
    address: string;
    city: string;
    latitude?: number | Prisma.Decimal | null;
    longitude?: number | Prisma.Decimal | null;
    type: Type; // 'SALE' | 'RENT'
    property: Property; // 'APARTMENT' | 'HOUSE' | 'LAND_PLOT'
    description?: string | null;


    // Связанные данные
    apartment?: ApartmentDB | null;
    house?: HouseDB | null;
    landPlot?: LandPlotDB | null;
    rentalFeatures?: RentalFeaturesDB | null;
    saleFeatures?: SaleFeaturesDB | null;

    createdAt?: Date | null;
    updatedAt?: Date | null;
    views?: number;
    user?: {
        id: string;
        name: string;
        surname: string | null;
        email: string | null;
        phoneNumber: string | null;
    };
}

// Фильтры для поиска недвижимости
export interface PropertyFilters {
    type?: 'SALE' | 'RENT';  // Тип сделки
    propertyType?: 'APARTMENT' | 'HOUSE' | 'LAND_PLOT'; // Тип недвижимости
    searchQuery?: string;    // Поиск по ключевым словам
    minPrice?: number;       // Минимальная цена
    maxPrice?: number;       // Максимальная цена
    minBedrooms?: number;    // Минимальное количество спален
    maxBedrooms?: number;    // Максимальное количество спален
    minBathrooms?: number;   // Минимальное количество ванных комнат
    maxBathrooms?: number;   // Максимальное количество ванных комнат
    minPropertySize?: number; // Минимальный размер недвижимости
    maxPropertySize?: number; // Максимальный размер недвижимости
    petPolicy?: 'ALLOWED' | 'NOT_ALLOWED' | 'ALLOWED_WITH_RESTRICTIONS'; // Политика по животным
    heatingType?: 'GAS' | 'ELECTRIC' | 'SOLAR' | 'OTHER'; // Тип отопления
    parking?: boolean;       // Наличие парковки
    furnished?: boolean;     // Меблированность
    airConditioning?: boolean; // Наличие кондиционера
}

// Интерфейс для данных формы (PropertyFormData)
export type PropertyFormData = {
    // Шаг 1
    type: 'SALE' | 'RENT';
    property: 'APARTMENT' | 'HOUSE' | 'LAND_PLOT';
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
