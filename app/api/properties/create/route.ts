// pages/api/properties/create.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/prisma';
import { propertySchema } from '@/lib/propertySchema';
import { ZodError } from 'zod';

export async function POST(request: Request) {
    // Проверка авторизации пользователя
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    try {
        // Получаем данные из запроса
        const data = await request.json();

        // Валидация данных с помощью Zod
        const validatedData = propertySchema.parse(data);

        // Создание основного объявления
        const property = await prisma.post.create({
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
                userId: session.user.id,
            },
        });

        // В зависимости от типа недвижимости, создаём соответствующую запись
        if (validatedData.property === 'APARTMENT' && validatedData.apartment) {
            await prisma.apartment.create({
                data: {
                    numBedrooms: validatedData.apartment.numBedrooms,
                    numBathrooms: validatedData.apartment.numBathrooms,
                    floorNumber: validatedData.apartment.floorNumber,
                    totalFloors: validatedData.apartment.totalFloors,
                    apartmentArea: validatedData.apartment.apartmentArea,
                    buildingType: validatedData.apartment.buildingType,
                    yearBuilt: validatedData.apartment.yearBuilt,
                    ceilingHeight: validatedData.apartment.ceilingHeight,
                    hasBalcony: validatedData.apartment.hasBalcony,
                    hasLoggia: validatedData.apartment.hasLoggia,
                    hasWalkInCloset: validatedData.apartment.hasWalkInCloset,
                    hasPassengerElevator: validatedData.apartment.hasPassengerElevator,
                    hasFreightElevator: validatedData.apartment.hasFreightElevator,
                    heatingType: validatedData.apartment.heatingType,
                    renovationState: validatedData.apartment.renovationState,
                    parkingType: validatedData.apartment.parkingType,
                    furnished: validatedData.apartment.furnished,
                    internetSpeed: validatedData.apartment.internetSpeed,
                    flooring: validatedData.apartment.flooring,
                    soundproofing: validatedData.apartment.soundproofing,
                    postId: property.id,
                },
            });
        } else if (validatedData.property === 'HOUSE' && validatedData.house) {
            await prisma.house.create({
                data: {
                    numberOfFloors: validatedData.house.numberOfFloors,
                    numberOfRooms: validatedData.house.numberOfRooms,
                    houseArea: validatedData.house.houseArea,
                    landArea: validatedData.house.landArea,
                    wallMaterial: validatedData.house.wallMaterial,
                    yearBuilt: validatedData.house.yearBuilt,
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
                    postId: property.id,
                },
            });
        } else if (validatedData.property === 'LAND_PLOT' && validatedData.landPlot) {
            await prisma.landPlot.create({
                data: {
                    landArea: validatedData.landPlot.landArea,
                    landPurpose: validatedData.landPlot.landPurpose,
                    waterSource: validatedData.landPlot.waterSource,
                    fencing: validatedData.landPlot.fencing,
                    postId: property.id,
                },
            });
        }

        // Создаём характеристики аренды или продажи
        if (validatedData.type === 'RENT' && validatedData.rentalFeatures) {
            await prisma.rentalFeatures.create({
                data: {
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
                    postId: property.id,
                },
            });
        } else if (validatedData.type === 'SALE' && validatedData.saleFeatures) {
            await prisma.saleFeatures.create({
                data: {
                    mortgageAvailable: validatedData.saleFeatures.mortgageAvailable,
                    priceNegotiable: validatedData.saleFeatures.priceNegotiable,
                    availabilityDate: validatedData.saleFeatures.availabilityDate,
                    titleDeedUrl: validatedData.saleFeatures.titleDeedUrl,
                    postId: property.id,
                },
            });
        }

        return NextResponse.json(
            { message: 'Объявление успешно создано', property },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: 'Ошибка валидации данных', errors: error.errors },
                { status: 400 }
            );
        }

        console.error('Ошибка при создании недвижимости:', error);
        return NextResponse.json(
            { message: 'Ошибка при создании недвижимости' },
            { status: 500 }
        );
    }
}
