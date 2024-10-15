// app/api/metrics/pieGraphData/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        const pieData = await prisma.post.groupBy({
            by: ['type'],
            _count: {
                type: true,
            },
            where: {
                createdAt: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
        });

        // Преобразуем данные в формат, удобный для PieGraph
        const formattedData = pieData.map((item) => ({
            type: item.type,
            count: item._count.type,
        }));

        return NextResponse.json({ data: formattedData });
    } catch (error) {
        console.error('Ошибка при получении данных для PieGraph:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
