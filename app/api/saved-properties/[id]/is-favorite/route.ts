import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { auth } from '@/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();

        // Если пользователь не авторизован, возвращаем, что объект не в избранном
        if (!session?.user?.id) {
            return NextResponse.json({ isFavorite: false });
        }

        const userId = session.user.id;
        const postId = params.id;

        // Убедитесь, что `postId` передан корректно
        if (!postId) {
            throw new Error("Post ID is missing.");
        }

        // Проверяем, находится ли объект в избранном у пользователя
        const favoritePost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });

        return NextResponse.json({ isFavorite: !!favoritePost });
    } catch (error) {
        console.error('Ошибка при проверке избранного:', error);
        return NextResponse.json({ error: 'Не удалось проверить избранное' }, { status: 500 });
    }
}
