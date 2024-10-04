import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getProperties } from '@/utils/getProperties';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        const properties = await prisma.post.findMany({
            where: { userId },
        });

        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json({ message: 'Error fetching properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();

    // Фильтрация на основе body
    const properties = await getProperties(body);

    return NextResponse.json(properties);
}
