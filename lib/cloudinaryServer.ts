// lib/cloudinaryServer.ts

import { v2 as cloudinary } from 'cloudinary';

// Настройка Cloudinary с использованием переменных окружения
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функция для загрузки изображений на сервере (если требуется)
export const uploadAvatar = async (filePath: string, folder: string) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            transformation: [{ width: 150, height: 150, crop: 'fill' }],
        });

        return result;
    } catch (error) {
        console.error('Ошибка при загрузке изображения в Cloudinary:', error);
        throw new Error('Ошибка при загрузке изображения');
    }
};

// Функция для удаления изображений
export const deleteImage = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Ошибка при удалении изображения из Cloudinary:', error);
        throw new Error('Ошибка при удалении изображения');
    }
};
