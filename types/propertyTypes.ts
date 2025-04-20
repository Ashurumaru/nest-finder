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
    RenovationState,
    ReservationStatus
} from '@prisma/client';

export interface ReservationData {
    id: string;
    userId: string;
    postId: string;
    startDate: Date | string;
    endDate: Date | string;
    totalPrice: number | Prisma.Decimal;
    status: ReservationStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    post?: PostData;
    user?: UserData;
}

export interface UserData {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string | null;
    image?: string | null;
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
    reservations?: ReservationData[];

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

export interface ReservationDB {
    id?: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number | Prisma.Decimal;
    postId: string;
    userId: string;
    createdAt?: Date;
    status?: ReservationStatus;
}

// Интерфейс для основной сущности PropertyDB
export interface PropertyDB {
    id?: string;
    title: string;
    price: number | Prisma.Decimal;
    imageUrls: string[];
    address: string;
    city: string;
    latitude: number | Prisma.Decimal;
    longitude: number | Prisma.Decimal;
    type: Type; // 'SALE' | 'RENT'
    property: Property; // 'APARTMENT' | 'HOUSE' | 'LAND_PLOT'
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    views?: number;
    userId: string;

    apartment?: ApartmentDB | null;
    house?: HouseDB | null;
    landPlot?: LandPlotDB | null;
    reservations?: ReservationDB[];
    rentalFeatures?: RentalFeaturesDB | null;
    saleFeatures?: SaleFeaturesDB | null;
}

// Интерфейс для апартаментов (квартир)
export interface ApartmentDB {
    id?: string;
    numBedrooms?: number;
    numBathrooms?: number;
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
    id?: string;
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
    furnished?: boolean;
    internetSpeed?: number;
    flooring?: string;
    soundproofing?: boolean;
}

// Интерфейс для земельных участков
export interface LandPlotDB {
    id?: string;
    landArea?: number;
    landPurpose?: string;
    waterSource?: string;
    fencing?: boolean;
}

// Интерфейс для характеристик аренды
export interface RentalFeaturesDB {
    id?: string;
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
    id?: string;
    mortgageAvailable?: boolean;
    priceNegotiable?: boolean;
    availabilityDate?: Date;
    titleDeedUrl?: string;
}


// Фильтры для поиска недвижимости
export interface PropertyFilters {
    userId?: string;
    type?: 'SALE' | 'RENT';  // Тип сделки
    propertyType?: 'APARTMENT' | 'HOUSE' | 'LAND_PLOT'; // Тип недвижимости
    searchQuery?: string;    // Поиск по ключевым словам
    minPrice?: number;       // Минимальная цена
    maxPrice?: number;       // Максимальная цена
    minBedrooms?: number;    // Минимальное количество спален
    maxBedrooms?: number;    // Минимальное количество спален
}

export interface PropertyFormValues {
    id?: string;
    title: string;
    price: number | Prisma.Decimal;
    imageUrls: string[];
    address: string;
    city: string;
    latitude: number | Prisma.Decimal;
    longitude: number | Prisma.Decimal;
    type: Type;
    property: Property;
    description?: string | null;
    views?: number;
    updatedAt?: Date;
    createdAt?: Date;
    userId?: string;
    isArchive?: boolean;

    // Apartment specific data
    apartment?: {
        numBedrooms?: number | null;
        numBathrooms?: number | null;
        floorNumber?: number | null;
        totalFloors?: number | null;
        apartmentArea?: number | null;
        buildingType?: BuildingType | null;
        yearBuilt?: number | null;
        ceilingHeight?: number | null;
        hasBalcony?: boolean | null;
        balconyType?: string | null;
        hasLoggia?: boolean | null;
        hasWalkInCloset?: boolean | null;
        hasPassengerElevator?: boolean | null;
        hasFreightElevator?: boolean | null;
        heatingType?: HeatingType | null;
        renovationState?: RenovationState | null;
        parkingType?: ParkingType | null;
        furnished?: boolean | null;
        internetSpeed?: number | null;
        flooring?: string | null;
        soundproofing?: boolean | null;
    };

    // House specific data
    house?: {
        numberOfFloors?: number | null;
        numberOfRooms?: number | null;
        houseArea?: number | null;
        landArea?: number | null;
        wallMaterial?: string | null;
        yearBuilt?: number | null;
        hasGarage?: boolean | null;
        garageArea?: number | null;
        hasBasement?: boolean | null;
        basementArea?: number | null;
        heatingType?: HeatingType | null;
        houseCondition?: RenovationState | null;
        fencing?: boolean | null;
        furnished?: boolean | null;
        internetSpeed?: number | null;
        flooring?: string | null;
        soundproofing?: boolean | null;
    };

    // Land plot specific data
    landPlot?: {
        landArea?: number | null;
        landPurpose?: string | null;
        waterSource?: string | null;
        fencing?: boolean | null;
    };

    // Rental features
    rentalFeatures?: {
        rentalTerm?: RentalTerm | null;
        securityDeposit?: number | Prisma.Decimal | null;
        securityDepositConditions?: string | null;
        utilitiesPayment?: UtilitiesPayment | null;
        utilitiesCost?: number | Prisma.Decimal | null;
        leaseAgreementUrl?: string | null;
        petPolicy?: PetPolicy | null;
        availabilityDate?: Date | null;
        minimumLeaseTerm?: number | null;
        maximumLeaseTerm?: number | null;
    };

    // Sale features
    saleFeatures?: {
        mortgageAvailable?: boolean | null;
        priceNegotiable?: boolean | null;
        availabilityDate?: Date | null;
        titleDeedUrl?: string | null;
    };
}