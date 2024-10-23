// lib/cloudinaryClient.ts

import axios, { AxiosProgressEvent } from "axios";

export const uploadImageToCloudinary = async (
    file: File,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'property_photos');

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        formData,
        {
            onUploadProgress,
        }
    );

    if (response.data.secure_url) {
        return response.data.secure_url;
    } else {
        throw new Error('Ошибка при загрузке изображения на Cloudinary');
    }
};
