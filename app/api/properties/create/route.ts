// pages/api/properties/create.ts

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { Type, Property, HeatingType, ParkingType, LeaseTerm, PetPolicy } from '@prisma/client';
import { PropertyDB } from '@/types/propertyTypes'; // Убедитесь, что путь правильный


// 1. Базовая схема с общими полями для всех типов недвижимости
const baseSchema = z.object({
    title: z.string().nonempty('Заголовок обязателен'),
    price: z.number().positive('Цена должна быть положительным числом'),
    imageUrls: z.array(z.string()).optional().default([]),
    address: z.string().nonempty('Адрес обязателен'),
    city: z.string().nonempty('Город обязателен'),
    latitude: z.preprocess((val) => parseFloat(val as string), z.number().min(-90).max(90, 'Недопустимая широта')),
    longitude: z.preprocess((val) => parseFloat(val as string), z.number().min(-180).max(180, 'Недопустимая долгота')),
    type: z.nativeEnum(Type),
    property: z.nativeEnum(Property),
    description: z.string().nullable().optional(),
    moveInDate: z.string().nullable().optional(),
    leaseTerm: z.nativeEnum(LeaseTerm).nullable().optional(),
    userId: z.string(),
});

// 2. Схемы для конкретных типов недвижимости

// 2.1. Квартира
const apartmentSchema = baseSchema.extend({
    property: z.literal(Property.apartment), // Уникальное значение
    numBedrooms: z.number().min(0, 'Количество спален не может быть отрицательным'),
    numBathrooms: z.number().min(0, 'Количество ванных комнат не может быть отрицательным'),
    floorNumber: z.preprocess((val) => val ? parseInt(val as string) : null, z.number().nullable().optional()),
    totalFloors: z.preprocess((val) => val ? parseInt(val as string) : null, z.number().nullable().optional()),
    hasElevator: z.boolean().default(false),
    parking: z.boolean().default(false),
    heatingType: z.nativeEnum(HeatingType).nullable().optional(),
    furnished: z.boolean().default(false),
    basement: z.boolean().default(false),
    balcony: z.boolean().default(false),
    airConditioning: z.boolean().default(false),
    internetIncluded: z.boolean().default(false),
    smokingAllowed: z.boolean().default(false),
    petPolicy: z.nativeEnum(PetPolicy).nullable().optional(),
    parkingType: z.nativeEnum(ParkingType).nullable().optional(),
});

// 2.2. Дом
const houseSchema = baseSchema.extend({
    property: z.literal(Property.house), // Уникальное значение
    numBedrooms: z.number().min(0, 'Количество спален не может быть отрицательным'),
    numBathrooms: z.number().min(0, 'Количество ванных комнат не может быть отрицательным'),
    lotSize: z.number().min(0, 'Площадь участка не может быть отрицательной').nullable().optional(),
    yearBuilt: z.number().min(0, 'Год постройки не может быть отрицательным').nullable().optional(),
    heatingType: z.nativeEnum(HeatingType).nullable().optional(),
    furnished: z.boolean(),
    basement: z.boolean(),
    balcony: z.boolean(),
    airConditioning: z.boolean(),
    internetIncluded: z.boolean(),
    smokingAllowed: z.boolean(),
    petPolicy: z.nativeEnum(PetPolicy).nullable().optional(),
    parking: z.boolean(),
    parkingType: z.nativeEnum(ParkingType).nullable().optional(),
});


const propertySchema = z.discriminatedUnion('property', [
    apartmentSchema,
    houseSchema,
]);

export async function POST(request: Request) {
    // Получаем сессию пользователя
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const body = await request.json();

        // Валидация данных с использованием обновленной схемы
        const result = propertySchema.safeParse({ ...body, userId });

        if (!result.success) {
            return NextResponse.json(
                {
                    message: 'Некорректные данные',
                    errors: result.error.flatten()
                },
                { status: 400 }
            );
        }


        // Преобразование даты переезда в объект Date
        const moveInDate = result.data.moveInDate ? new Date(result.data.moveInDate) : null;

        // Подготовка данных для сохранения в базу данных
        const data: PropertyDB = {
            ...result.data,
            moveInDate,
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
