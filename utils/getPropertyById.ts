import {PropertyFormValues} from "@/components/property/create-property/CreateUpdateProperty";
import prisma from "@/prisma/prisma";

export async function getPropertyById(id: string) {
    const property = await prisma.post.findUnique({
        where: { id },
        include: {
            user: true,
            apartment: true,
            house: true,
            landPlot: true,
            rentalFeatures: true,
            saleFeatures: true,
        },
    });

    if (!property) return null;

    const parsedProperty: PropertyFormValues = {
        id: property.id,
        title: property.title,
        price: property.price.toString(),
        address: property.address,
        city: property.city,
        latitude: property.latitude !== null ? Number(property.latitude) : 0,
        longitude: property.longitude !== null ? Number(property.longitude) : 0,
        type: property.type,
        property: property.property,
        description: property.description ?? "",
        imageUrls: property.imageUrls ?? [],
        views: property.views,
        updatedAt: property.updatedAt ?? new Date(),
        createdAt: property.createdAt ?? new Date(),
        apartment: property.apartment
            ? {
                numBedrooms: property.apartment.numBedrooms?.toString() ?? "",
                numBathrooms: property.apartment.numBathrooms?.toString() ?? "",
                floorNumber: property.apartment.floorNumber?.toString() ?? "",
                totalFloors: property.apartment.totalFloors?.toString() ?? "",
                apartmentArea: property.apartment.apartmentArea?.toString() ?? "",
                buildingType: property.apartment.buildingType ?? null,
                yearBuilt: property.apartment.yearBuilt?.toString() ?? "",
                ceilingHeight: property.apartment.ceilingHeight?.toString() ?? "",
                hasBalcony: property.apartment.hasBalcony ?? false,
                hasLoggia: property.apartment.hasLoggia ?? false,
                hasWalkInCloset: property.apartment.hasWalkInCloset ?? false,
                hasPassengerElevator: property.apartment.hasPassengerElevator ?? false,
                hasFreightElevator: property.apartment.hasFreightElevator ?? false,
                heatingType: property.apartment.heatingType ?? null,
                renovationState: property.apartment.renovationState ?? null,
                parkingType: property.apartment.parkingType ?? null,
                furnished: property.apartment.furnished ?? false,
                internetSpeed: property.apartment.internetSpeed?.toString() ?? "",
                flooring: property.apartment.flooring ?? "",
                soundproofing: property.apartment.soundproofing ?? false,
            }
            : undefined,

        house: property.house
            ? {
                numberOfFloors: property.house.numberOfFloors?.toString() ?? "",
                numberOfRooms: property.house.numberOfRooms?.toString() ?? "",
                houseArea: property.house.houseArea ?? 0,
                landArea: property.house.landArea ?? 0,
                wallMaterial: property.house.wallMaterial ?? "",
                yearBuilt: property.house.yearBuilt?.toString() ?? "",
                hasGarage: property.house.hasGarage ?? false,
                garageArea: property.house.garageArea ?? 0,
                hasBasement: property.house.hasBasement ?? false,
                basementArea: property.house.basementArea ?? 0,
                heatingType: property.house.heatingType ?? null,
                houseCondition: property.house.houseCondition ?? null,
                fencing: property.house.fencing ?? false,
                furnished: property.house.furnished ?? false,
                internetSpeed: property.house.internetSpeed ?? 0,
                flooring: property.house.flooring ?? "",
                soundproofing: property.house.soundproofing ?? false,
            }
            : undefined,

        landPlot: property.landPlot
            ? {
                landArea: property.landPlot?.landArea ?? undefined,
                landPurpose: property.landPlot.landPurpose ?? "",
                waterSource: property.landPlot.waterSource ?? "",
                fencing: property.landPlot.fencing ?? false,
            }
            : undefined,

        rentalFeatures: property.rentalFeatures
            ? {
                rentalTerm: property.rentalFeatures.rentalTerm ?? 'DAILY_PAYMENT',  // Обработка null значений
                securityDeposit: Number(property.rentalFeatures.securityDeposit ?? 0),
                securityDepositConditions: property.rentalFeatures.securityDepositConditions ?? "",
                utilitiesPayment: property.rentalFeatures.utilitiesPayment ?? 'INCLUDED',
                utilitiesCost: Number(property.rentalFeatures.utilitiesCost ?? 0),
                leaseAgreementUrl: property.rentalFeatures.leaseAgreementUrl ?? "",
                petPolicy: property.rentalFeatures.petPolicy ?? 'NOT_ALLOWED',
                availabilityDate: property.rentalFeatures.availabilityDate ?? new Date(),
                minimumLeaseTerm: Number(property.rentalFeatures.minimumLeaseTerm ?? 0),
                maximumLeaseTerm: Number(property.rentalFeatures.maximumLeaseTerm ?? 0),
            }
            : undefined,

        saleFeatures: property.saleFeatures
            ? {
                mortgageAvailable: property.saleFeatures.mortgageAvailable ?? false,
                priceNegotiable: property.saleFeatures.priceNegotiable ?? false,
                availabilityDate: property.saleFeatures.availabilityDate ?? new Date(),
                titleDeedUrl: property.saleFeatures.titleDeedUrl ?? "",
            }
            : undefined,
    };

    return parsedProperty;
}
