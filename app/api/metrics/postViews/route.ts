// app/api/metrics/postViews/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        const postViews = await prisma.post.aggregate({
            _sum: {
                views: true,
            },
            where: {
                createdAt: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
        });

        return NextResponse.json({ count: postViews._sum.views || 0 });
    } catch (error) {
        console.error('Ошибка при получении количества просмотров постов:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
