// app/api/saved-posts/[postId]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { auth } from '@/auth';

// Добавление в избранное
export async function POST(request: Request, { params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const postId = params.id;

    if (!postId) {
        throw new Error("Post ID is missing.");
    }

    try {
        // Проверяем, существует ли пост
        const postExists = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!postExists) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Добавляем пост в избранное
        const savedPost = await prisma.savedPost.create({
            data: {
                userId,
                postId,
            },
        });

        return NextResponse.json(savedPost);
    } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
        return NextResponse.json({ error: 'Не удалось добавить в избранное' }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const postId = params.id;

    if (!postId) {
        throw new Error("Post ID is missing.");
    }

    try {
        await prisma.savedPost.delete({
            where: {
                userId_postId: { userId, postId },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
        return NextResponse.json({ error: 'Не удалось удалить из избранного' }, { status: 500 });
    }
}
