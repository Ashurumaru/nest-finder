//app/api/user/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

// Получение пользователя по ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        throw new Error('ID пользователя не предоставлено');
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id, // Убедитесь, что здесь передается корректный ID
            },
        });

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Ошибка при получении пользователя', { status: 500 });
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
