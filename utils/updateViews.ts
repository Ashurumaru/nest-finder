import prisma from '@/prisma/prisma';

/**
 * Увеличивает количество просмотров для поста с указанным ID.
 * @param postId - Идентификатор поста.
 */
export async function incrementPostViews(postId: string): Promise<void> {
    try {
        await prisma.post.update({
            where: { id: postId },
            data: { views: { increment: 1 } },
        });
    } catch (error) {
        console.error(`Ошибка при увеличении просмотров для поста ${postId}:`, error);
        throw new Error('Не удалось увеличить просмотры');
    }
}
