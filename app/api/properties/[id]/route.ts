import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/prisma/prisma';
import { ZodError } from 'zod';
import { propertySchema } from "@/lib/propertySchema"; // Импорт схемы валидации
import { Decimal } from '@prisma/client/runtime/library';

// Функция для получения данных о недвижимости
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const property = await prisma.post.findUnique({
        where: { id: params.id },
        include: {
            apartment: true,
            house: true,
            landPlot: true,
            rentalFeatures: true,
            saleFeatures: true,
        },
    });

    if (!property) {
        return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
}

// Функция для обновления недвижимости
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Неавторизован' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const data = await request.json();
        const validatedData = propertySchema.parse(data);

        // Проверяем, существует ли недвижимость
        const property = await prisma.post.findUnique({
            where: { id },
        });

        if (!property) {
            return NextResponse.json({ message: 'Недвижимость не найдена' }, { status: 404 });
        }

        // Проверяем, является ли пользователь владельцем недвижимости
        if (property.userId !== userId && session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
        }

        // Обновляем данные недвижимости с использованием всех полей
        const updatedProperty = await prisma.post.update({
            where: { id },
            data: {
                title: validatedData.title,
                price: new Decimal(validatedData.price),
                imageUrls: validatedData.imageUrls ?? [],
                address: validatedData.address,
                city: validatedData.city,
                latitude: new Decimal(validatedData.latitude),
                longitude: new Decimal(validatedData.longitude),
                type: validatedData.type,
                property: validatedData.property,
                description: validatedData.description ?? undefined,
                updatedAt: new Date(),

                apartment: validatedData.property === "APARTMENT" && validatedData.apartment ? {
                    upsert: {
                        create: {
                            numBedrooms: validatedData.apartment.numBedrooms ? Number(validatedData.apartment.numBedrooms) : undefined,
                            numBathrooms: validatedData.apartment.numBathrooms ? Number(validatedData.apartment.numBathrooms) : undefined,
                            floorNumber: validatedData.apartment.floorNumber ? Number(validatedData.apartment.floorNumber) : undefined,
                            totalFloors: validatedData.apartment.totalFloors ? Number(validatedData.apartment.totalFloors) : undefined,
                            apartmentArea: validatedData.apartment.apartmentArea ? Number(validatedData.apartment.apartmentArea) : undefined,
                            buildingType: validatedData.apartment.buildingType ?? null,
                            yearBuilt: validatedData.apartment.yearBuilt ? Number(validatedData.apartment.yearBuilt) : undefined,
                            ceilingHeight: validatedData.apartment.ceilingHeight ? Number(validatedData.apartment.ceilingHeight) : undefined,
                            hasBalcony: validatedData.apartment.hasBalcony ?? false,
                            hasLoggia: validatedData.apartment.hasLoggia ?? false,
                            hasWalkInCloset: validatedData.apartment.hasWalkInCloset ?? false,
                            hasPassengerElevator: validatedData.apartment.hasPassengerElevator ?? false,
                            hasFreightElevator: validatedData.apartment.hasFreightElevator ?? false,
                            heatingType: validatedData.apartment.heatingType ?? null,
                            renovationState: validatedData.apartment.renovationState ?? null,
                            parkingType: validatedData.apartment.parkingType ?? null,
                            furnished: validatedData.apartment.furnished ?? false,
                            internetSpeed: validatedData.apartment.internetSpeed ? Number(validatedData.apartment.internetSpeed) : undefined,
                            flooring: validatedData.apartment.flooring ?? undefined,
                            soundproofing: validatedData.apartment.soundproofing ?? false,
                        },
                        update: {
                            numBedrooms: validatedData.apartment.numBedrooms ? Number(validatedData.apartment.numBedrooms) : undefined,
                            numBathrooms: validatedData.apartment.numBathrooms ? Number(validatedData.apartment.numBathrooms) : undefined,
                            floorNumber: validatedData.apartment.floorNumber ? Number(validatedData.apartment.floorNumber) : undefined,
                            totalFloors: validatedData.apartment.totalFloors ? Number(validatedData.apartment.totalFloors) : undefined,
                            apartmentArea: validatedData.apartment.apartmentArea ? Number(validatedData.apartment.apartmentArea) : undefined,
                            buildingType: validatedData.apartment.buildingType ?? null,
                            yearBuilt: validatedData.apartment.yearBuilt ? Number(validatedData.apartment.yearBuilt) : undefined,
                            ceilingHeight: validatedData.apartment.ceilingHeight ? Number(validatedData.apartment.ceilingHeight) : undefined,
                            hasBalcony: validatedData.apartment.hasBalcony ?? false,
                            hasLoggia: validatedData.apartment.hasLoggia ?? false,
                            hasWalkInCloset: validatedData.apartment.hasWalkInCloset ?? false,
                            hasPassengerElevator: validatedData.apartment.hasPassengerElevator ?? false,
                            hasFreightElevator: validatedData.apartment.hasFreightElevator ?? false,
                            heatingType: validatedData.apartment.heatingType ?? null,
                            renovationState: validatedData.apartment.renovationState ?? null,
                            parkingType: validatedData.apartment.parkingType ?? null,
                            furnished: validatedData.apartment.furnished ?? false,
                            internetSpeed: validatedData.apartment.internetSpeed ? Number(validatedData.apartment.internetSpeed) : undefined,
                            flooring: validatedData.apartment.flooring ?? undefined,
                            soundproofing: validatedData.apartment.soundproofing ?? false,
                        },
                    }
                } : {
                    delete: true
                },

                house: validatedData.property === "HOUSE" && validatedData.house ? {
                    upsert: {
                        create: {
                            numberOfFloors: validatedData.house.numberOfFloors ? Number(validatedData.house.numberOfFloors) : undefined,
                            numberOfRooms: validatedData.house.numberOfRooms ? Number(validatedData.house.numberOfRooms) : undefined,
                            houseArea: validatedData.house.houseArea ? Number(validatedData.house.houseArea) : undefined,
                            landArea: validatedData.house.landArea ? Number(validatedData.house.landArea) : undefined,
                            wallMaterial: validatedData.house.wallMaterial ?? undefined,
                            yearBuilt: validatedData.house.yearBuilt ? Number(validatedData.house.yearBuilt) : undefined,
                            hasGarage: validatedData.house.hasGarage ?? false,
                            garageArea: validatedData.house.garageArea ? Number(validatedData.house.garageArea) : undefined,
                            hasBasement: validatedData.house.hasBasement ?? false,
                            basementArea: validatedData.house.basementArea ? Number(validatedData.house.basementArea) : undefined,
                            heatingType: validatedData.house.heatingType ?? null,
                            houseCondition: validatedData.house.houseCondition ?? null,
                            fencing: validatedData.house.fencing ?? false,
                            furnished: validatedData.house.furnished ?? false,
                            internetSpeed: validatedData.house.internetSpeed ? Number(validatedData.house.internetSpeed) : undefined,
                            flooring: validatedData.house.flooring ?? undefined,
                            soundproofing: validatedData.house.soundproofing ?? false,
                        },
                        update: {
                            numberOfFloors: validatedData.house.numberOfFloors ? Number(validatedData.house.numberOfFloors) : undefined,
                            numberOfRooms: validatedData.house.numberOfRooms ? Number(validatedData.house.numberOfRooms) : undefined,
                            houseArea: validatedData.house.houseArea ? Number(validatedData.house.houseArea) : undefined,
                            landArea: validatedData.house.landArea ? Number(validatedData.house.landArea) : undefined,
                            wallMaterial: validatedData.house.wallMaterial ?? undefined,
                            yearBuilt: validatedData.house.yearBuilt ? Number(validatedData.house.yearBuilt) : undefined,
                            hasGarage: validatedData.house.hasGarage ?? false,
                            garageArea: validatedData.house.garageArea ? Number(validatedData.house.garageArea) : undefined,
                            hasBasement: validatedData.house.hasBasement ?? false,
                            basementArea: validatedData.house.basementArea ? Number(validatedData.house.basementArea) : undefined,
                            heatingType: validatedData.house.heatingType ?? null,
                            houseCondition: validatedData.house.houseCondition ?? null,
                            fencing: validatedData.house.fencing ?? false,
                            furnished: validatedData.house.furnished ?? false,
                            internetSpeed: validatedData.house.internetSpeed ? Number(validatedData.house.internetSpeed) : undefined,
                            flooring: validatedData.house.flooring ?? undefined,
                            soundproofing: validatedData.house.soundproofing ?? false,
                        },
                    }
                } : {
                    delete: true
                },

                landPlot: validatedData.property === "LAND_PLOT" && validatedData.landPlot ? {
                    upsert: {
                        create: {
                            landArea: validatedData.landPlot.landArea ? Number(validatedData.landPlot.landArea) : undefined,
                            landPurpose: validatedData.landPlot.landPurpose ?? undefined,
                            waterSource: validatedData.landPlot.waterSource ?? undefined,
                            fencing: validatedData.landPlot.fencing ?? false,
                        },
                        update: {
                            landArea: validatedData.landPlot.landArea ? Number(validatedData.landPlot.landArea) : undefined,
                            landPurpose: validatedData.landPlot.landPurpose ?? undefined,
                            waterSource: validatedData.landPlot.waterSource ?? undefined,
                            fencing: validatedData.landPlot.fencing ?? false,
                        },
                    }
                } : {
                    delete: true
                },

                rentalFeatures: validatedData.type === "RENT" && validatedData.rentalFeatures ? {
                    upsert: {
                        create: {
                            rentalTerm: validatedData.rentalFeatures.rentalTerm ?? undefined,
                            securityDeposit: validatedData.rentalFeatures.securityDeposit ? new Decimal(validatedData.rentalFeatures.securityDeposit) : undefined,
                            securityDepositConditions: validatedData.rentalFeatures.securityDepositConditions ?? undefined,
                            utilitiesPayment: validatedData.rentalFeatures.utilitiesPayment ?? undefined,
                            utilitiesCost: validatedData.rentalFeatures.utilitiesCost ? new Decimal(validatedData.rentalFeatures.utilitiesCost) : undefined,
                            leaseAgreementUrl: validatedData.rentalFeatures.leaseAgreementUrl ?? undefined,
                            petPolicy: validatedData.rentalFeatures.petPolicy ?? null,
                            availabilityDate: validatedData.rentalFeatures.availabilityDate ?? undefined,
                            minimumLeaseTerm: validatedData.rentalFeatures.minimumLeaseTerm ? Number(validatedData.rentalFeatures.minimumLeaseTerm) : undefined,
                            maximumLeaseTerm: validatedData.rentalFeatures.maximumLeaseTerm ? Number(validatedData.rentalFeatures.maximumLeaseTerm) : undefined,
                        },
                        update: {
                            rentalTerm: validatedData.rentalFeatures.rentalTerm ?? undefined,
                            securityDeposit: validatedData.rentalFeatures.securityDeposit ? new Decimal(validatedData.rentalFeatures.securityDeposit) : undefined,
                            securityDepositConditions: validatedData.rentalFeatures.securityDepositConditions ?? undefined,
                            utilitiesPayment: validatedData.rentalFeatures.utilitiesPayment ?? undefined,
                            utilitiesCost: validatedData.rentalFeatures.utilitiesCost ? new Decimal(validatedData.rentalFeatures.utilitiesCost) : undefined,
                            leaseAgreementUrl: validatedData.rentalFeatures.leaseAgreementUrl ?? undefined,
                            petPolicy: validatedData.rentalFeatures.petPolicy ?? null,
                            availabilityDate: validatedData.rentalFeatures.availabilityDate ?? undefined,
                            minimumLeaseTerm: validatedData.rentalFeatures.minimumLeaseTerm ? Number(validatedData.rentalFeatures.minimumLeaseTerm) : undefined,
                            maximumLeaseTerm: validatedData.rentalFeatures.maximumLeaseTerm ? Number(validatedData.rentalFeatures.maximumLeaseTerm) : undefined,
                        },
                    }
                } : {
                    delete: true
                },

                saleFeatures: validatedData.type === "SALE" && validatedData.saleFeatures ? {
                    upsert: {
                        create: {
                            mortgageAvailable: validatedData.saleFeatures.mortgageAvailable ?? false,
                            priceNegotiable: validatedData.saleFeatures.priceNegotiable ?? false,
                            availabilityDate: validatedData.saleFeatures.availabilityDate ?? undefined,
                            titleDeedUrl: validatedData.saleFeatures.titleDeedUrl ?? undefined,
                        },
                        update: {
                            mortgageAvailable: validatedData.saleFeatures.mortgageAvailable ?? false,
                            priceNegotiable: validatedData.saleFeatures.priceNegotiable ?? false,
                            availabilityDate: validatedData.saleFeatures.availabilityDate ?? undefined,
                            titleDeedUrl: validatedData.saleFeatures.titleDeedUrl ?? undefined,
                        },
                    }
                } : {
                    delete: true
                }
            },
        });

        return NextResponse.json(updatedProperty);
    } catch (error) {
        console.error('Ошибка при обновлении недвижимости:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении недвижимости' }, { status: 500 });
    }
}

// Функция для удаления недвижимости
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Неавторизован' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        // Проверяем, существует ли недвижимость
        const property = await prisma.post.findUnique({
            where: { id },
        });

        if (!property) {
            return NextResponse.json({ message: 'Недвижимость не найдена' }, { status: 404 });
        }

        // Проверяем, является ли пользователь владельцем или администратором
        if (session.user.role !== 'ADMIN' && property.userId !== userId) {
            return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
        }

        // Обновляем isArchive на true вместо удаления
        await prisma.post.update({
            where: { id },
            data: { isArchive: true },
        });

        return NextResponse.json({ message: 'Недвижимость успешно архивирована' });
    } catch (error) {
        console.error('Ошибка при архивировании недвижимости:', error);
        return NextResponse.json({ message: 'Ошибка при архивировании' }, { status: 500 });
    }
}