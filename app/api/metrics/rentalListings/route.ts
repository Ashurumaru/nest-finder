// app/api/metrics/rentalListings/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        const rentalListings = await prisma.post.count({
            where: {
                type: 'rent',
                createdAt: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
        });

        return NextResponse.json({ count: rentalListings });
    } catch (error) {
        console.error('Ошибка при получении количества объявлений аренды:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
