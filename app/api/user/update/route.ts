import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { uploadAvatar, deleteImage } from '@/lib/cloudinary';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
    const body = await request.json();
    const { name, surname, email, phoneNumber, password, image, userId } = body;

    try {
        // Найдём пользователя по ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Создадим объект обновлений
        const updates: any = {
            name,
            surname,
            email,
            phoneNumber,
        };

        // Если нужно обновить пароль
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // Хэшируем пароль
            updates.hashedPassword = hashedPassword;
        }

        // Если нужно обновить аватар
        if (image) {
            // Если у пользователя уже есть аватар, удалим старое изображение
            if (user.image) {
                const publicId = user.image.split('/').pop()?.split('.')[0]; // Извлекаем publicId
                // await deleteImage(publicId as string); // Удаляем старое изображение
            }

            // Загрузка аватара в Cloudinary
            const uploadResponse = await uploadAvatar(image, 'avatars'); // Загружаем новое изображение

            // Сохраняем URL загруженного изображения в базе данных
            updates.image = uploadResponse.secure_url;
        }

        // Обновляем пользователя в базе данных
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updates,
        });

        return NextResponse.json(updatedUser); // Возвращаем обновленного пользователя
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении профиля', error }, { status: 500 });
    }
}
