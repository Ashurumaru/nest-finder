import prisma from "@/prisma/prisma";

// Функция для получения недвижимости по её id
export async function getPropertyById(id: string) {
    const property = await prisma.post.findUnique({
        where: { id },
        include: {
            postDetail: true, // Включаем детали недвижимости
        },
    });

    // Если недвижимость не найдена, возвращаем null
    if (!property) {
        return null;
    }

    // Возвращаем только нужные данные
    return {
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
            utilitiesIncluded: property.postDetail?.utilitiesIncluded ?? undefined,
            petPolicy: property.postDetail?.petPolicy ?? undefined,
            incomeRequirement: property.postDetail?.incomeRequirement ?? undefined,
            schoolDistance: property.postDetail?.schoolDistance ?? undefined,
            busStopDistance: property.postDetail?.busStopDistance ?? undefined,
            restaurantDistance: property.postDetail?.restaurantDistance ?? undefined,
        },
        type: property.type,
        property: property.property,
    };
}
