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
        price: property.price.toNumber(),
        imageUrls: property.imageUrls,
        address: property.address,
        city: property.city,
        numBedrooms: property.numBedrooms,
        numBathrooms: property.numBathrooms,
        latitude: property.latitude?.toNumber(),
        longitude: property.longitude?.toNumber(),
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
        hoaFees: property.hoaFees?.toNumber(),
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
    };
}
