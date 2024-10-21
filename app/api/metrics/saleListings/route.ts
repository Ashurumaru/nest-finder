// app/api/metrics/saleListings/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        const saleListings = await prisma.post.count({
            where: {
                type: 'SALE',
                createdAt: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
        });

        return NextResponse.json({ count: saleListings });
    } catch (error) {
        console.error('Ошибка при получении количества объявлений продажи:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
