import prisma from "@/prisma/prisma";
import { PropertyDB, PropertyFilters } from "@/types/propertyTypes";

// Функция для получения недвижимости с применением фильтров
export async function getProperties(filters: PropertyFilters = {}): Promise<PropertyDB[]> {
    const {
        type,
        propertyType,
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
        whereClause.apartment = {
            ...(whereClause.apartment || {}),
            ...(minBedrooms ? { numBedrooms: { gte: minBedrooms } } : {}),
            ...(maxBedrooms ? { numBedrooms: { lte: maxBedrooms } } : {}),
        };
    }

    // Фильтрация по количеству ванных комнат
    if (minBathrooms || maxBathrooms) {
        whereClause.apartment = {
            ...(whereClause.apartment || {}),
            ...(minBathrooms ? { numBathrooms: { gte: minBathrooms } } : {}),
            ...(maxBathrooms ? { numBathrooms: { lte: maxBathrooms } } : {}),
        };
    }

    const properties = await prisma.post.findMany({
        where: whereClause,
        include: {
            user: true,
            apartment: true,
            house: true,
            landPlot: true,
            rentalFeatures: true,
            saleFeatures: true,
        },
    });

    return properties.map((property) => ({
        id: property.id,
        title: property.title,
        price: property.price.toNumber(),
        imageUrls: property.imageUrls,
        address: property.address,
        city: property.city,
        latitude: property.latitude?.toNumber() ?? null,
        longitude: property.longitude?.toNumber() ?? null,
        type: property.type,
        property: property.property,
        description: property.description ?? null,

        // Информация об апартаментах, если есть
        apartment: property.apartment
            ? {
                id: property.apartment.id,
                numBedrooms: property.apartment.numBedrooms ?? 0,
                numBathrooms: property.apartment.numBathrooms ?? 0,
                floorNumber: property.apartment.floorNumber ?? undefined,
                totalFloors: property.apartment.totalFloors ?? undefined,
                apartmentArea: property.apartment.apartmentArea ?? undefined,
                buildingType: property.apartment.buildingType ?? null,
                yearBuilt: property.apartment.yearBuilt ?? undefined,
                ceilingHeight: property.apartment.ceilingHeight ?? undefined,
                hasBalcony: property.apartment.hasBalcony ?? undefined,
                hasLoggia: property.apartment.hasLoggia ?? undefined,
                hasWalkInCloset: property.apartment.hasWalkInCloset ?? undefined,
                hasPassengerElevator: property.apartment.hasPassengerElevator ?? undefined,
                hasFreightElevator: property.apartment.hasFreightElevator ?? undefined,
                heatingType: property.apartment.heatingType ?? undefined,
                renovationState: property.apartment.renovationState ?? undefined,
                parkingType: property.apartment.parkingType ?? undefined,
                furnished: property.apartment.furnished ?? undefined,
                internetSpeed: property.apartment.internetSpeed ?? undefined,
                flooring: property.apartment.flooring ?? undefined,
                soundproofing: property.apartment.soundproofing ?? undefined,
            }
            : null,

        // Информация о домах, если есть
        house: property.house
            ? {
                id: property.house.id,
                numberOfFloors: property.house.numberOfFloors ?? undefined,
                numberOfRooms: property.house.numberOfRooms ?? undefined,
                houseArea: property.house.houseArea ?? undefined,
                landArea: property.house.landArea ?? undefined,
                wallMaterial: property.house.wallMaterial ?? undefined,
                hasGarage: property.house.hasGarage ?? undefined,
                garageArea: property.house.garageArea ?? undefined,
                hasBasement: property.house.hasBasement ?? undefined,
                basementArea: property.house.basementArea ?? undefined,
                heatingType: property.house.heatingType ?? undefined,
                houseCondition: property.house.houseCondition ?? undefined,
                fencing: property.house.fencing ?? undefined,
                furnished: property.house.furnished ?? undefined,
                internetSpeed: property.house.internetSpeed ?? undefined,
                flooring: property.house.flooring ?? undefined,
                soundproofing: property.house.soundproofing ?? undefined,
            }
            : null,

        // Информация о земельных участках, если есть
        landPlot: property.landPlot
            ? {
                id: property.landPlot.id,
                landArea: property.landPlot.landArea ?? undefined,
                landPurpose: property.landPlot.landPurpose ?? undefined,
                waterSource: property.landPlot.waterSource ?? undefined,
                fencing: property.landPlot.fencing ?? undefined,
            }
            : null,

        // Характеристики аренды, если есть
        rentalFeatures: property.rentalFeatures
            ? {
                id: property.rentalFeatures.id,
                rentalTerm: property.rentalFeatures.rentalTerm ?? undefined,
                securityDeposit: property.rentalFeatures.securityDeposit?.toNumber() ?? undefined,
                securityDepositConditions: property.rentalFeatures.securityDepositConditions ?? undefined,
                utilitiesPayment: property.rentalFeatures.utilitiesPayment ?? undefined,
                utilitiesCost: property.rentalFeatures.utilitiesCost?.toNumber() ?? undefined,
                leaseAgreementUrl: property.rentalFeatures.leaseAgreementUrl ?? undefined,
                petPolicy: property.rentalFeatures.petPolicy ?? undefined,
                availabilityDate: property.rentalFeatures.availabilityDate ?? undefined,
                minimumLeaseTerm: property.rentalFeatures.minimumLeaseTerm ?? undefined,
                maximumLeaseTerm: property.rentalFeatures.maximumLeaseTerm ?? undefined,
            }
            : null,

        // Характеристики продажи, если есть
        saleFeatures: property.saleFeatures
            ? {
                id: property.saleFeatures.id,
                mortgageAvailable: property.saleFeatures.mortgageAvailable ?? undefined,
                priceNegotiable: property.saleFeatures.priceNegotiable ?? undefined,
                availabilityDate: property.saleFeatures.availabilityDate
                    ? new Date(property.saleFeatures.availabilityDate)
                    : undefined,
                titleDeedUrl: property.saleFeatures.titleDeedUrl ?? undefined,
            }
            : null,

        createdAt: property.createdAt ? new Date(property.createdAt) : undefined,
        updatedAt: property.updatedAt ? new Date(property.updatedAt) : undefined,
        views: property.views ?? 0,
        userId: property.userId,
    }));
}
