// app/api/saved-posts/[postId]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: Request, { params }: { params: { postId: string } }) {
    const { userId } = await request.json();

    try {
        const savedPost = await prisma.savedPost.create({
            data: {
                userId,
                postId: params.postId,
            },
        });

        return NextResponse.json(savedPost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { postId: string } }) {
    const { userId } = await request.json();

    try {
        await prisma.savedPost.delete({
            where: {
                userId_postId: {
                    userId,
                    postId: params.postId,
                },
            },
        });

        return NextResponse.json({ message: 'Post removed from saved' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove post from saved' }, { status: 500 });
    }
}
