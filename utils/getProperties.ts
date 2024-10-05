import prisma from "@/prisma/prisma";
import { PropertyFilters } from "@/types/propertyTypes";

export async function getProperties(filters: PropertyFilters = {}) {
    const {
        type,
        propertyType,
        searchQuery,
        minPrice,
        maxPrice,
        minBedrooms,
        maxBedrooms,
        minBathrooms,
        maxBathrooms,
        minPropertySize,
        maxPropertySize,
        petPolicy,
        heatingType,
        parking,
        furnished,
        hasElevator,
        airConditioning,
    } = filters;

    const whereClause: any = {};

    // Фильтрация по типу сделки (аренда или продажа)
    if (type) {
        whereClause.type = type;
    }

    // Фильтрация по типу недвижимости
    if (propertyType) {
        whereClause.property = propertyType;
    }

    // Поиск по ключевым словам (например, по заголовку, адресу, городу, описанию)
    if (searchQuery) {
        whereClause.OR = [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { address: { contains: searchQuery, mode: "insensitive" } },
            { city: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
        ];
    }

    // Фильтрация по цене
    if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) {
            whereClause.price.gte = minPrice;
        }
        if (maxPrice) {
            whereClause.price.lte = maxPrice;
        }
    }

    // Фильтрация по количеству спален
    if (minBedrooms || maxBedrooms) {
        whereClause.numBedrooms = {};
        if (minBedrooms) {
            whereClause.numBedrooms.gte = minBedrooms;
        }
        if (maxBedrooms) {
            whereClause.numBedrooms.lte = maxBedrooms;
        }
    }

    // Фильтрация по количеству ванных комнат
    if (minBathrooms || maxBathrooms) {
        whereClause.numBathrooms = {};
        if (minBathrooms) {
            whereClause.numBathrooms.gte = minBathrooms;
        }
        if (maxBathrooms) {
            whereClause.numBathrooms.lte = maxBathrooms;
        }
    }

    // Фильтрация по размеру недвижимости
    if (minPropertySize || maxPropertySize) {
        whereClause.propertySize = {};
        if (minPropertySize) {
            whereClause.propertySize.gte = minPropertySize;
        }
        if (maxPropertySize) {
            whereClause.propertySize.lte = maxPropertySize;
        }
    }

    // Фильтрация по политике относительно животных
    if (petPolicy) {
        whereClause.petPolicy = petPolicy;
    }

    // Фильтрация по типу отопления
    if (heatingType) {
        whereClause.heatingType = heatingType;
    }

    // Фильтрация по наличию парковки
    if (parking !== undefined) {
        whereClause.parking = parking;
    }

    // Фильтрация по меблированности
    if (furnished !== undefined) {
        whereClause.furnished = furnished;
    }

    // Фильтрация по наличию лифта
    if (hasElevator !== undefined) {
        whereClause.hasElevator = hasElevator;
    }

    // Фильтрация по наличию кондиционера
    if (airConditioning !== undefined) {
        whereClause.airConditioning = airConditioning;
    }

    // Запрос к базе данных с учётом фильтров
    const properties = await prisma.post.findMany({
        where: whereClause,
        include: {
            user: true, // Если нужна информация о пользователе
        },
    });

    // Возвращаем только нужные данные
    return properties.map((property) => ({
        id: property.id,
        title: property.title,
        price: property.price.toNumber(),
        imageUrls: property.imageUrls,
        address: property.address,
        city: property.city,
        numBedrooms: property.numBedrooms,
        numBathrooms: property.numBathrooms,
        latitude: property.latitude.toNumber(),
        longitude: property.longitude.toNumber(),
        type: property.type,
        property: property.property,
        description: property.description,
        petPolicy: property.petPolicy,
        propertySize: property.propertySize,
        schoolDistance: property.schoolDistance,
        busStopDistance: property.busStopDistance,
        yearBuilt: property.yearBuilt,
        floorNumber: property.floorNumber,
        totalFloors: property.totalFloors,
        heatingType: property.heatingType,
        parking: property.parking,
        parkingType: property.parkingType,
        hasElevator: property.hasElevator,
        furnished: property.furnished,
        hoaFees: property.hoaFees,
        lotSize: property.lotSize,
        basement: property.basement,
        balcony: property.balcony,
        airConditioning: property.airConditioning,
        internetIncluded: property.internetIncluded,
        smokingAllowed: property.smokingAllowed,
        moveInDate: property.moveInDate ? property.moveInDate.toISOString() : null,
        leaseTerm: property.leaseTerm,
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt?.toISOString(),
        views: property.views,
        user: {
            id: property.user.id,
            name: property.user.name,
            surname: property.user.surname,
            email: property.user.email,
            phoneNumber: property.user.phoneNumber,
        },
    }));
}
