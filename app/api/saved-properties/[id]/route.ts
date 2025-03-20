// app/api/saved-properties/[id]/route.ts

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
        return NextResponse.json({ error: "Post ID is missing" }, { status: 400 });
    }

    try {
        // Проверяем, существует ли пост
        const postExists = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!postExists) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Проверяем, не добавлен ли уже пост в избранное
        const existingSaved = await prisma.savedPost.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });

        if (existingSaved) {
            return NextResponse.json({ message: "Already in favorites" }, { status: 200 });
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

// Удаление из избранного
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const postId = params.id;

    if (!postId) {
        return NextResponse.json({ error: "Post ID is missing" }, { status: 400 });
    }

    try {
        // Проверяем, существует ли запись в избранном
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });

        if (!savedPost) {
            return NextResponse.json({ error: "Post not found in favorites" }, { status: 404 });
        }

        // Удаляем из избранного
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