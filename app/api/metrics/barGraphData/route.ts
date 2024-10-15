// app/api/metrics/barGraphData/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { format } from 'date-fns';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        const barData = await prisma.post.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
            _count: {
                createdAt: true,
            },
        });

        // Форматируем даты для удобства отображения (например, '2024-04-01')
        const formattedData = barData.map((item) => ({
            date: format(item.createdAt, 'yyyy-MM-dd'),
            count: item._count.createdAt,
        }));

        return NextResponse.json({ data: formattedData });
    } catch (error) {
        console.error('Ошибка при получении данных для BarGraph:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
