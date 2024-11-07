// pages/api/properties/create.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/prisma';
import { propertySchema } from '@/lib/propertySchema';
import { ZodError } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(request: Request) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    try {
        const data = await request.json();

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
        if (data.apartment && typeof data.apartment.apartmentArea === 'number') {
            data.apartment.apartmentArea = data.apartment.apartmentArea.toString();
        }
        // Валидация данных с помощью Zod
        const validatedData = propertySchema.parse(data);

        // Создание основного объявления
        const property = await prisma.post.create({
            data: {
                title: validatedData.title,
                price: new Decimal(validatedData.price),
                imageUrls: validatedData.imageUrls,
                address: validatedData.address,
                city: validatedData.city,
                latitude: new Decimal(validatedData.latitude),
                longitude: new Decimal(validatedData.longitude),
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
                    postId: property.id,
                },
            });
        } else if (validatedData.property === 'HOUSE' && validatedData.house) {
            await prisma.house.create({
                data: {
                    numberOfFloors: validatedData.house.numberOfFloors
                        ? Number(validatedData.house.numberOfFloors)
                        : null,
                    numberOfRooms: validatedData.house.numberOfRooms
                        ? Number(validatedData.house.numberOfRooms)
                        : null,
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
                    internetSpeed: validatedData.house.internetSpeed
                        ? Number(validatedData.house.internetSpeed)
                        : null,
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
            console.error('Ошибка валидации данных:', error.errors);
            return NextResponse.json(
                {
                    message: 'Ошибка валидации данных',
                    errors: error.format()
                },
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
