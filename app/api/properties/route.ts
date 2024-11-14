import { NextResponse } from 'next/server';
import { getProperties } from '@/utils/getProperties';
import { PropertyFilters } from "@/types/propertyTypes";
import {ZodError} from "zod";
import { Decimal } from '@prisma/client/runtime/library';
import {propertySchema} from "@/lib/propertySchema";
import {auth} from "@/auth";
import prisma from '@/prisma/prisma';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type') as 'SALE' | 'RENT' | undefined;
        const userId = url.searchParams.get('userId') || undefined;
        const searchQuery = url.searchParams.get('searchQuery') || undefined;
        const propertyType = url.searchParams.get('propertyType') as 'APARTMENT' | 'HOUSE' | 'LAND_PLOT' | undefined;
        const minPrice = url.searchParams.get('minPrice') ? parseFloat(url.searchParams.get('minPrice')!) : undefined;
        const maxPrice = url.searchParams.get('maxPrice') ? parseFloat(url.searchParams.get('maxPrice')!) : undefined;
        const minBedrooms = url.searchParams.get('minBedrooms') ? parseInt(url.searchParams.get('minBedrooms')!) : undefined;
        const maxBedrooms = url.searchParams.get('maxBedrooms') ? parseInt(url.searchParams.get('maxBedrooms')!) : undefined;

        const filters: PropertyFilters = {
            type,
            userId,
            searchQuery,
            propertyType,
            minPrice,
            maxPrice,
            minBedrooms,
            maxBedrooms,
        };

        const properties = await getProperties(filters);
        return NextResponse.json(properties);
    } catch (error) {
        console.error('Ошибка при получении недвижимости:', error);
        return NextResponse.json({ message: 'Ошибка при получении недвижимости' }, { status: 500 });
    }
}

// Функция для создания нового объявления недвижимости
export async function POST(request: Request) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const validatedData = propertySchema.parse(data);

        // Создание основного объявления с данными, включая все поля
        const property = await prisma.post.create({
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
                createdAt: validatedData.createdAt ?? new Date(),
                updatedAt: validatedData.updatedAt ?? new Date(),
                views: validatedData.views ?? 0,
                userId: session.user.id,

                apartment: validatedData.property === "APARTMENT" && validatedData.apartment ? {
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
                    }
                } : undefined,

                house: validatedData.property === "HOUSE" && validatedData.house ? {
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
                    }
                } : undefined,

                landPlot: validatedData.property === "LAND_PLOT" && validatedData.landPlot ? {
                    create: {
                        landArea: validatedData.landPlot.landArea ? Number(validatedData.landPlot.landArea) : undefined,
                        landPurpose: validatedData.landPlot.landPurpose ?? undefined,
                        waterSource: validatedData.landPlot.waterSource ?? undefined,
                        fencing: validatedData.landPlot.fencing ?? false,
                    }
                } : undefined,

                rentalFeatures: validatedData.type === "RENT" && validatedData.rentalFeatures ? {
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
                    }
                } : undefined,

                saleFeatures: validatedData.type === "SALE" && validatedData.saleFeatures ? {
                    create: {
                        mortgageAvailable: validatedData.saleFeatures.mortgageAvailable ?? false,
                        priceNegotiable: validatedData.saleFeatures.priceNegotiable ?? false,
                        availabilityDate: validatedData.saleFeatures.availabilityDate ?? undefined,
                        titleDeedUrl: validatedData.saleFeatures.titleDeedUrl ?? undefined,
                    }
                } : undefined,
            },
        });

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