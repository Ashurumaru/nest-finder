// pages/api/properties/[id]/update.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/prisma';
import { propertySchema } from '@/lib/propertySchema';
import { ZodError } from 'zod';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Проверка авторизации пользователя
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    const propertyId = params.id;

    try {
        // Получаем данные из запроса
        const data = await request.json();

        if (typeof data.latitude === 'number') {
            data.latitude = data.latitude.toString();
        }
        if (typeof data.longitude === 'number') {
            data.longitude = data.longitude.toString();
        }
        if (data.apartment && typeof data.apartment.numBedrooms === 'number') {
            data.apartment.numBedrooms = data.apartment.numBedrooms.toString();
        }
        if (data.apartment && typeof data.apartment.numBathrooms === 'number') {
            data.apartment.numBathrooms = data.apartment.numBathrooms.toString();
        }
        if (data.saleFeatures && data.saleFeatures.availabilityDate) {
            data.saleFeatures.availabilityDate = new Date(data.saleFeatures.availabilityDate);
        }
        if (data.rentalFeatures && data.rentalFeatures.availabilityDate) {
            data.rentalFeatures.availabilityDate = new Date(data.rentalFeatures.availabilityDate);
        }
        if (data.apartment && typeof data.apartment.internetSpeed === 'number') {
            data.apartment.internetSpeed = data.apartment.internetSpeed.toString();
        }

        // Валидация данных
        const validatedData = propertySchema.parse(data);

        // Проверяем, что объявление принадлежит текущему пользователю
        const existingProperty = await prisma.post.findUnique({
            where: { id: propertyId },
        });

        if (!existingProperty || existingProperty.userId !== session.user.id) {
            return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
        }

        // Обновляем основное объявление
        const updatedProperty = await prisma.post.update({
            where: { id: propertyId },
            data: {
                title: validatedData.title,
                price: validatedData.price,
                imageUrls: validatedData.imageUrls,
                address: validatedData.address,
                city: validatedData.city,
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                type: validatedData.type,
                property: validatedData.property,
                description: validatedData.description,
            },
        });

        // Обновляем или создаём связанные записи в зависимости от типа недвижимости
        if (validatedData.property === 'APARTMENT' && validatedData.apartment) {
            await prisma.apartment.upsert({
                where: { postId: propertyId },
                update: {
                    numBedrooms: validatedData.apartment.numBedrooms
                        ? Number(validatedData.apartment.numBedrooms)
                        : null,
                    numBathrooms: validatedData.apartment.numBathrooms
                        ? Number(validatedData.apartment.numBathrooms)
                        : null,
                    floorNumber: validatedData.apartment.floorNumber
                        ? Number(validatedData.apartment.floorNumber)
                        : null,
                    totalFloors: validatedData.apartment.totalFloors
                        ? Number(validatedData.apartment.totalFloors)
                        : null,
                    apartmentArea: validatedData.apartment.apartmentArea
                        ? Number(validatedData.apartment.apartmentArea)
                        : null,
                    buildingType: validatedData.apartment.buildingType ?? null,
                    yearBuilt: validatedData.apartment.yearBuilt
                        ? Number(validatedData.apartment.yearBuilt)
                        : null,
                    ceilingHeight: validatedData.apartment.ceilingHeight
                        ? Number(validatedData.apartment.ceilingHeight)
                        : null,
                    hasBalcony: validatedData.apartment.hasBalcony ?? false,
                    hasLoggia: validatedData.apartment.hasLoggia ?? false,
                    hasWalkInCloset: validatedData.apartment.hasWalkInCloset ?? false,
                    hasPassengerElevator: validatedData.apartment.hasPassengerElevator ?? false,
                    hasFreightElevator: validatedData.apartment.hasFreightElevator ?? false,
                    heatingType: validatedData.apartment.heatingType ?? null,
                    renovationState: validatedData.apartment.renovationState ?? null,
                    parkingType: validatedData.apartment.parkingType ?? null,
                    furnished: validatedData.apartment.furnished ?? false,
                    internetSpeed: validatedData.apartment.internetSpeed
                        ? Number(validatedData.apartment.internetSpeed)
                        : null,
                    flooring: validatedData.apartment.flooring ?? "",
                    soundproofing: validatedData.apartment.soundproofing ?? false,
                },
                create: {
                    numBedrooms: validatedData.apartment.numBedrooms
                        ? Number(validatedData.apartment.numBedrooms)
                        : null,
                    numBathrooms: validatedData.apartment.numBathrooms
                        ? Number(validatedData.apartment.numBathrooms)
                        : null,
                    floorNumber: validatedData.apartment.floorNumber
                        ? Number(validatedData.apartment.floorNumber)
                        : null,
                    totalFloors: validatedData.apartment.totalFloors
                        ? Number(validatedData.apartment.totalFloors)
                        : null,
                    apartmentArea: validatedData.apartment.apartmentArea
                        ? Number(validatedData.apartment.apartmentArea)
                        : null,
                    buildingType: validatedData.apartment.buildingType ?? null,
                    yearBuilt: validatedData.apartment.yearBuilt
                        ? Number(validatedData.apartment.yearBuilt)
                        : null,
                    ceilingHeight: validatedData.apartment.ceilingHeight
                        ? Number(validatedData.apartment.ceilingHeight)
                        : null,
                    hasBalcony: validatedData.apartment.hasBalcony ?? false,
                    hasLoggia: validatedData.apartment.hasLoggia ?? false,
                    hasWalkInCloset: validatedData.apartment.hasWalkInCloset ?? false,
                    hasPassengerElevator: validatedData.apartment.hasPassengerElevator ?? false,
                    hasFreightElevator: validatedData.apartment.hasFreightElevator ?? false,
                    heatingType: validatedData.apartment.heatingType ?? null,
                    renovationState: validatedData.apartment.renovationState ?? null,
                    parkingType: validatedData.apartment.parkingType ?? null,
                    furnished: validatedData.apartment.furnished ?? false,
                    internetSpeed: validatedData.apartment.internetSpeed
                        ? Number(validatedData.apartment.internetSpeed)
                        : null,
                    flooring: validatedData.apartment.flooring ?? "",
                    soundproofing: validatedData.apartment.soundproofing ?? false,
                    postId: propertyId,
                },
            });
        } else if (validatedData.property === 'HOUSE' && validatedData.house) {
            await prisma.house.upsert({
                where: { postId: propertyId },
                update: {
                    numberOfFloors: validatedData.house.numberOfFloors,
                    numberOfRooms: validatedData.house.numberOfRooms,
                    houseArea: validatedData.house.houseArea,
                    landArea: validatedData.house.landArea,
                    wallMaterial: validatedData.house.wallMaterial,
                    yearBuilt: validatedData.house.yearBuilt
                        ? Number(validatedData.house.yearBuilt)
                        : null,
                    hasGarage: validatedData.house.hasGarage,
                    garageArea: validatedData.house.garageArea,
                    hasBasement: validatedData.house.hasBasement,
                    basementArea: validatedData.house.basementArea,
                    heatingType: validatedData.house.heatingType,
                    houseCondition: validatedData.house.houseCondition,
                    fencing: validatedData.house.fencing,
                    furnished: validatedData.house.furnished,
                    internetSpeed: validatedData.house.internetSpeed,
                    flooring: validatedData.house.flooring,
                    soundproofing: validatedData.house.soundproofing,
                },
                create: {
                    numberOfFloors: validatedData.house.numberOfFloors,
                    numberOfRooms: validatedData.house.numberOfRooms,
                    houseArea: validatedData.house.houseArea,
                    landArea: validatedData.house.landArea,
                    wallMaterial: validatedData.house.wallMaterial,
                    yearBuilt: validatedData.house.yearBuilt
                        ? Number(validatedData.house.yearBuilt)
                        : null,
                    hasGarage: validatedData.house.hasGarage,
                    garageArea: validatedData.house.garageArea,
                    hasBasement: validatedData.house.hasBasement,
                    basementArea: validatedData.house.basementArea,
                    heatingType: validatedData.house.heatingType,
                    houseCondition: validatedData.house.houseCondition,
                    fencing: validatedData.house.fencing,
                    furnished: validatedData.house.furnished,
                    internetSpeed: validatedData.house.internetSpeed,
                    flooring: validatedData.house.flooring,
                    soundproofing: validatedData.house.soundproofing,
                    postId: propertyId,
                },
            });
        } else if (validatedData.property === 'LAND_PLOT' && validatedData.landPlot) {
            await prisma.landPlot.upsert({
                where: { postId: propertyId },
                update: {
                    landArea: validatedData.landPlot.landArea,
                    landPurpose: validatedData.landPlot.landPurpose,
                    waterSource: validatedData.landPlot.waterSource,
                    fencing: validatedData.landPlot.fencing,
                },
                create: {
                    landArea: validatedData.landPlot.landArea,
                    landPurpose: validatedData.landPlot.landPurpose,
                    waterSource: validatedData.landPlot.waterSource,
                    fencing: validatedData.landPlot.fencing,
                    postId: propertyId,
                },
            });
        }

        // Обновляем характеристики аренды или продажи
        if (validatedData.type === 'RENT' && validatedData.rentalFeatures) {
            await prisma.rentalFeatures.upsert({
                where: { postId: propertyId },
                update: {
                    rentalTerm: validatedData.rentalFeatures.rentalTerm,
                    securityDeposit: validatedData.rentalFeatures.securityDeposit,
                    securityDepositConditions: validatedData.rentalFeatures.securityDepositConditions,
                    utilitiesPayment: validatedData.rentalFeatures.utilitiesPayment,
                    utilitiesCost: validatedData.rentalFeatures.utilitiesCost,
                    leaseAgreementUrl: validatedData.rentalFeatures.leaseAgreementUrl,
                    petPolicy: validatedData.rentalFeatures.petPolicy,
                    availabilityDate: validatedData.rentalFeatures.availabilityDate,
                    minimumLeaseTerm: validatedData.rentalFeatures.minimumLeaseTerm,
                    maximumLeaseTerm: validatedData.rentalFeatures.maximumLeaseTerm,
                },
                create: {
                    rentalTerm: validatedData.rentalFeatures.rentalTerm,
                    securityDeposit: validatedData.rentalFeatures.securityDeposit,
                    securityDepositConditions: validatedData.rentalFeatures.securityDepositConditions,
                    utilitiesPayment: validatedData.rentalFeatures.utilitiesPayment,
                    utilitiesCost: validatedData.rentalFeatures.utilitiesCost,
                    leaseAgreementUrl: validatedData.rentalFeatures.leaseAgreementUrl,
                    petPolicy: validatedData.rentalFeatures.petPolicy,
                    availabilityDate: validatedData.rentalFeatures.availabilityDate,
                    minimumLeaseTerm: validatedData.rentalFeatures.minimumLeaseTerm,
                    maximumLeaseTerm: validatedData.rentalFeatures.maximumLeaseTerm,
                    postId: propertyId,
                },
            });
        } else if (validatedData.type === 'SALE' && validatedData.saleFeatures) {
            await prisma.saleFeatures.upsert({
                where: { postId: propertyId },
                update: {
                    mortgageAvailable: validatedData.saleFeatures.mortgageAvailable,
                    priceNegotiable: validatedData.saleFeatures.priceNegotiable,
                    availabilityDate: validatedData.saleFeatures.availabilityDate,
                    titleDeedUrl: validatedData.saleFeatures.titleDeedUrl,
                },
                create: {
                    mortgageAvailable: validatedData.saleFeatures.mortgageAvailable,
                    priceNegotiable: validatedData.saleFeatures.priceNegotiable,
                    availabilityDate: validatedData.saleFeatures.availabilityDate,
                    titleDeedUrl: validatedData.saleFeatures.titleDeedUrl,
                    postId: propertyId,
                },
            });
        }

        return NextResponse.json(
            { message: 'Объявление успешно обновлено', property: updatedProperty },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: 'Ошибка валидации данных', errors: error.errors },
                { status: 400 }
            );
        }

        console.error('Ошибка при обновлении недвижимости:', error);
        return NextResponse.json(
            { message: 'Ошибка при обновлении недвижимости' },
            { status: 500 }
        );
    }
}
