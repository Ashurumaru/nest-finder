//app/api/user/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

// Получение пользователя по ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
        return NextResponse.json(
            { message: 'Error fetching user' },
            { status: 500 }
        );
    }
}

// Обновление пользователя по ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: {
                name,
                surname, // Учитываем опциональное поле
                email,
                phoneNumber,
                role,
                image, // Учитываем изображение
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        return NextResponse.json(
            { message: 'Error updating user' },
            { status: 500 }
        );
    }
}

// Удаление пользователя по ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const user = await prisma.user.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        return NextResponse.json(
            { message: 'Error deleting user' },
            { status: 500 }
        );
    }
}
