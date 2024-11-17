import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { IoCloudUploadOutline } from "react-icons/io5";

interface UploadImageProps {
    onUploadComplete: (urls: string[]) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onUploadComplete }) => {
    const [uploadedImagePaths, setUploadedImagePaths] = useState<string[]>([]);

    // Обработчик успешной загрузки изображения
    const handleUploadSuccess = (result: any) => {
        if (result.event === "success" && result.info.secure_url) {
            const imageUrl = result.info.secure_url;
            setUploadedImagePaths((prevPaths) => {
                const updatedPaths = [...prevPaths, imageUrl];
                onUploadComplete(updatedPaths);
                return updatedPaths;
            });
        }
    };

    return (
        <div className="space-y-4">
            <CldUploadWidget
                uploadPreset="property_photos"
                onUpload={handleUploadSuccess}
                options={{
                    maxFiles: 5,
                    multiple: true,
                    resourceType: "image",
                    clientAllowedFormats: ["jpeg", "png", "jpg"],
                }}
            >
                {({ open }) => {
                    if (!open) {
                        return <div>Error: Upload widget not initialized properly.</div>;
                    }

                    return (
                        <div
                            onClick={() => open()}
                            className="relative cursor-pointer border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                        >
                            <IoCloudUploadOutline size="2.5em" />
                            <span className="font-medium">Click to upload images</span>
                        </div>
                    );
                }}
            </CldUploadWidget>

            <div className="grid grid-cols-3 gap-4">
                {uploadedImagePaths.map((url, index) => (
                    <div key={index} className="relative">
                        <img
                            src={url}
                            alt={`Uploaded image ${index + 1}`}
                            className="object-cover rounded-md shadow-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadImage;
