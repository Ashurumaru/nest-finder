import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import {Type, Property, HeatingType, ParkingType, LeaseTerm, PetPolicy} from '@prisma/client';
import { PropertyDB } from '@/types/propertyTypes'; // Убедитесь, что путь правильный

const propertySchema = z.object({
    // Обязательные поля
    title: z.string(),
    price: z.number(),
    imageUrls: z.array(z.string()),
    address: z.string(),
    city: z.string(),
    numBedrooms: z.number(),
    numBathrooms: z.number(),
    latitude: z.number(),
    longitude: z.number(),
    type: z.nativeEnum(Type),
    property: z.nativeEnum(Property),
    parking: z.boolean(),
    hasElevator: z.boolean(),
    furnished: z.boolean(),
    basement: z.boolean(),
    balcony: z.boolean(),
    airConditioning: z.boolean(),
    internetIncluded: z.boolean(),
    smokingAllowed: z.boolean(),

    // Необязательные поля
    description: z.string().nullable().optional(),
    petPolicy: z.nativeEnum(PetPolicy).nullable().optional(),
    propertySize: z.number().nullable().optional(),
    schoolDistance: z.number().nullable().optional(),
    busStopDistance: z.number().nullable().optional(),
    yearBuilt: z.number().nullable().optional(),
    floorNumber: z.number().nullable().optional(),
    totalFloors: z.number().nullable().optional(),
    heatingType: z.nativeEnum(HeatingType).nullable().optional(),
    parkingType: z.nativeEnum(ParkingType).nullable().optional(),
    hoaFees: z.number().nullable().optional(),
    lotSize: z.number().nullable().optional(),
    moveInDate: z.string().nullable().optional(),
    leaseTerm: z.nativeEnum(LeaseTerm).nullable().optional(),
});

export async function POST(request: Request) {
    // Получаем сессию пользователя
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const body = await request.json();

        // Валидация данных с использованием zod
        const result = propertySchema.safeParse(body);

        if (!result.success) {
            // Обработка ошибок валидации
            return NextResponse.json(
                { message: 'Некорректные данные', errors: result.error.flatten() },
                { status: 400 }
            );
        }

        // Используем интерфейс PostData для типизации данных
        const data: PropertyDB = {
            ...result.data,
            moveInDate: result.data.moveInDate ? new Date(result.data.moveInDate) : null,
            userId: userId,
        };

        // Создаем новую запись недвижимости в базе данных
        const newProperty = await prisma.post.create({
            data: data,
        });

        return NextResponse.json(newProperty);
    } catch (error) {
        console.error('Ошибка при создании недвижимости:', error);
        return NextResponse.json({ message: 'Ошибка при создании недвижимости' }, { status: 500 });
    }
}
