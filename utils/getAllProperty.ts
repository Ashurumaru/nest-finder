import prisma from "@/prisma/prisma";
import { PropertyDB } from "@/types/propertyTypes";

export async function getAllProperties(): Promise<PropertyDB[]> {
    const properties = await prisma.post.findMany({
        include: {
            user: true,
        },
    });

    return properties.map((property) => ({
        id: property.id,
        title: property.title,
        price: property.price,
        imageUrls: property.imageUrls,
        address: property.address,
        city: property.city,
        numBedrooms: property.numBedrooms ?? 0,
        numBathrooms: property.numBathrooms ?? 0,
        latitude: property.latitude?.toNumber() ?? null,
        longitude: property.longitude?.toNumber() ?? null,
        type: property.type,
        property: property.property,
        description: property.description ?? null,
        petPolicy: property.petPolicy ?? null,
        propertySize: property.propertySize ?? null,
        schoolDistance: property.schoolDistance ?? null,
        busStopDistance: property.busStopDistance ?? null,
        yearBuilt: property.yearBuilt ?? null,
        floorNumber: property.floorNumber ?? null,
        totalFloors: property.totalFloors ?? null,
        heatingType: property.heatingType ?? null,
        parking: property.parking ?? null,
        parkingType: property.parkingType ?? null,
        hasElevator: property.hasElevator ?? null,
        furnished: property.furnished ?? null,
        hoaFees: property.hoaFees ? property.hoaFees : null,
        lotSize: property.lotSize ?? null,
        basement: property.basement ?? null,
        balcony: property.balcony ?? null,
        airConditioning: property.airConditioning ?? null,
        internetIncluded: property.internetIncluded ?? null,
        smokingAllowed: property.smokingAllowed ?? null,
        moveInDate: property.moveInDate ? new Date(property.moveInDate) : null,
        leaseTerm: property.leaseTerm ?? null,
        createdAt: property.createdAt ? new Date(property.createdAt) : undefined,
        updatedAt: property.updatedAt ? new Date(property.updatedAt) : undefined,
        views: property.views ?? 0,
        userId: property.userId,
    }));
}
