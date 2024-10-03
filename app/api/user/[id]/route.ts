import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

// GET-запрос для получения данных пользователя
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Получаем пользователя по ID
    const user = await prisma.user.findUnique({
        where: { id },
    });

    // Если пользователь не найден, возвращаем 404
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Возвращаем данные пользователя
    return NextResponse.json(user);
}
