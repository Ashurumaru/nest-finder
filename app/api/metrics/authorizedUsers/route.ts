// app/api/metrics/authorizedUsers/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        const authorizedUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
        });

        return NextResponse.json({ count: authorizedUsers });
    } catch (error) {
        console.error('Ошибка при получении количества авторизованных пользователей:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
