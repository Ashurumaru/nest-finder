import { NextResponse } from 'next/server';
import { getPropertyById } from '@/utils/getPropertyById';
import {auth} from "@/auth";
import prisma from '@/prisma/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Получаем объект недвижимости по ID
    const property = await getPropertyById(id);

    // Если объект не найден, возвращаем 404
    if (!property) {
        return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    // Возвращаем данные о недвижимости
    return NextResponse.json(property);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Получаем сессию пользователя
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Неавторизован' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const body = await request.json();

        // Проверяем, существует ли недвижимость
        const property = await prisma.post.findUnique({
            where: { id },
        });

        if (!property) {
            return NextResponse.json({ message: 'Недвижимость не найдена' }, { status: 404 });
        }

        // Проверяем, является ли пользователь владельцем недвижимости
        if (property.userId !== userId) {
            return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
        }

        // Обновляем данные недвижимости
        const updatedProperty = await prisma.post.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({
            ...updatedProperty
        });    } catch (error) {
        console.error('Ошибка при обновлении недвижимости:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении недвижимости' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Получаем сессию пользователя
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

        // Проверяем, является ли пользователь владельцем недвижимости
        if (property.userId !== userId) {
            return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
        }

        // Удаляем запись недвижимости из базы данных
        await prisma.post.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Недвижимость успешно удалена' });
    } catch (error) {
        console.error('Ошибка при удалении недвижимости:', error);
        return NextResponse.json({ message: 'Ошибка при удалении недвижимости' }, { status: 500 });
    }
}