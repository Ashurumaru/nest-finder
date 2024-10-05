// lib/cloudinaryClient.ts

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    formData.append('upload_preset', 'property_photos');

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    const data = await response.json();

    if (data.secure_url) {
        return data.secure_url;
    } else {
        throw new Error('Ошибка при загрузке изображения на Cloudinary');
    }
};
