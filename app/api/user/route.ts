//app/api/user/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

// Получение всех пользователей
export async function GET() {
    try {
        const users = await prisma.user.findMany();

        if (users.length === 0) {
            return NextResponse.json({ message: 'No users found' }, { status: 404 });
        }

        return NextResponse.json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        return NextResponse.json(
            { message: 'Error fetching users' },
            { status: 500 }
        );
    }
}

// Создание нового пользователя
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, surname, email, phoneNumber, role, image } = body;

        // Проверка обязательных данных
        if (!name || !email) {
            return NextResponse.json(
                { message: 'Name and email are required' },
                { status: 400 }
            );
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                surname, // Учитываем опциональное поле
                email,
                phoneNumber,
                role: role || 'user', // Роль по умолчанию - "user"
                image, // Учитываем изображение
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        return NextResponse.json(
            { message: 'Error creating user' },
            { status: 500 }
        );
    }
}
