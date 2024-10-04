import prisma from "@/prisma/prisma";

// Функция для получения недвижимости по её id
export async function getPropertyById(id: string) {
    const property = await prisma.post.findUnique({
        where: { id },
        include: {
            user: true, // Включаем автора (пользователя, который выложил объявление)
        },
    });

    // Если недвижимость не найдена, возвращаем null
    if (!property) {
        return null;
    }

    // Обновляем количество просмотров при каждом запросе
    await prisma.post.update({
        where: { id },
        data: {
            views: property.views + 1, // Увеличиваем количество просмотров
        },
    });

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
        views: property.views + 1, // Обновляем количество просмотров
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
        author: property.user.name, // Автор (имя пользователя)
        description: property.description ?? undefined,
        propertySize: property.propertySize ?? undefined,
        utilitiesIncluded: property.utilitiesIncluded ?? undefined,
        petPolicy: property.petPolicy ?? undefined,
        incomeRequirement: property.incomeRequirement ?? undefined,
        schoolDistance: property.schoolDistance ?? undefined,
        busStopDistance: property.busStopDistance ?? undefined,
        restaurantDistance: property.restaurantDistance ?? undefined,
        type: property.type,
        property: property.property,
    };
}
