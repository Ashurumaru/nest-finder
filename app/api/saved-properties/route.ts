// app/api/saved-posts/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const savedPosts = await prisma.savedPost.findMany({
            where: {
                userId: userId,
            },
            include: {
                post: true,
            },
        });

        return NextResponse.json(savedPosts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch saved posts' }, { status: 500 });
    }
}
