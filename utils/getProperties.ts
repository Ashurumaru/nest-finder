import prisma from "@/prisma/prisma";
import {PropertyFilters} from "@/types/propertyTypes";


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

    // Поиск по ключевым словам (например, по заголовку, адресу, городу)
    if (searchQuery) {
        whereClause.OR = [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { address: { contains: searchQuery, mode: "insensitive" } },
            { city: { contains: searchQuery, mode: "insensitive" } },
            { postDetail: { description: { contains: searchQuery, mode: "insensitive" } } },
        ];
    }

    // Фильтрация по цене
    if (minPrice) {
        whereClause.price = { ...whereClause.price, gte: minPrice }; // Минимальная цена
    }
    if (maxPrice) {
        whereClause.price = { ...whereClause.price, lte: maxPrice }; // Максимальная цена
    }

    // Фильтрация по количеству спален
    if (minBedrooms) {
        whereClause.numBedrooms = { ...whereClause.numBedrooms, gte: minBedrooms }; // Минимум спален
    }
    if (maxBedrooms) {
        whereClause.numBedrooms = { ...whereClause.numBedrooms, lte: maxBedrooms }; // Максимум спален
    }

    // Фильтрация по количеству ванных комнат
    if (minBathrooms) {
        whereClause.numBathrooms = { ...whereClause.numBathrooms, gte: minBathrooms }; // Минимум ванных комнат
    }
    if (maxBathrooms) {
        whereClause.numBathrooms = { ...whereClause.numBathrooms, lte: maxBathrooms }; // Максимум ванных комнат
    }

    // Запрос к базе данных с учётом фильтров
    const properties = await prisma.post.findMany({
        where: whereClause,
        include: {
            postDetail: true,
        },
    });

    // Возвращаем только нужные данные
    return properties.map((property) => ({
        id: property.id,
        title: property.title,
        price: property.price,
        imageUrls: property.imageUrls,
        address: property.address,
        city: property.city,
        numBedrooms: property.numBedrooms,
        numBathrooms: property.numBathrooms,
        latitude: property.latitude,
        longitude: property.longitude,
        postDetail: {
            propertySize: property.postDetail?.propertySize ?? undefined,
            description: property.postDetail?.description ?? undefined,
        },
        type: property.type,
        property: property.property,
    }));
}
