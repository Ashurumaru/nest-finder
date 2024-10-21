// pages/api/properties/create.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request) {
    // Получаем сессию пользователя
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    try {
        // Возвращаем заглушку
        return NextResponse.json({ message: 'Создание недвижимости временно недоступно' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при создании недвижимости:', error);
        return NextResponse.json({ message: 'Ошибка при создании недвижимости' }, { status: 500 });
    }
}
