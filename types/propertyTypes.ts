import {
    Prisma,
    Type,
    Property,
    HeatingType,
    ParkingType,
    PetPolicy,
    RentalTerm,
    UtilitiesPayment,
    BuildingType,
    RenovationState
} from '@prisma/client';

// Интерфейс для данных бронирования (ReservationData)
export interface ReservationData {
    id: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number | Prisma.Decimal;
    postId: string;
    userId: string;
    createdAt?: Date;
    status?: string;  // Возможные статусы: "PENDING", "CONFIRMED", "CANCELLED"

    // Связанные данные: минимальные данные о недвижимости и пользователе
    post?: {
        id: string;
        title: string;
        price: number | Prisma.Decimal;
        imageUrls: string[];
        address: string;
        city: string;
    } | null;

    user?: {
        id: string;
        name: string;
        email?: string | null;
    } | null;
}

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

    apartment?: ApartmentDB | null;
    house?: HouseDB | null;
    landPlot?: LandPlotDB | null;

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
    renovationState?: RenovationState | null;
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
    yearBuilt?: number;
    hasBasement?: boolean;
    basementArea?: number;
    additionalBuildings?: string;
    heatingType?: HeatingType | null;
    houseCondition?: RenovationState | null;
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
        image: string | null;
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
    maxBedrooms?: number;    // Минимальное количество спален
}
