"use client";

import React, { useState, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface UploadImageProps {
    onUploadComplete?: (urls: string[]) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onUploadComplete }) => {
    const [uploadedImagePaths, setUploadedImagePaths] = useState<string[]>([]);

    const handleUploadSuccess = (result: any) => {
        if (result.event === "success" && result.info.secure_url) {
            const imageUrl = result.info.secure_url;
            setUploadedImagePaths((prevPaths) => {
                const updatedPaths = [...prevPaths, imageUrl];
                onUploadComplete?.(updatedPaths);
                return updatedPaths;
            });
        }
    };

    const removeImage = (index: number) => {
        const updatedPaths = uploadedImagePaths.filter((_, i) => i !== index);
        setUploadedImagePaths(updatedPaths);
        onUploadComplete?.(updatedPaths);
    };

    return (
        <div className="space-y-4">
            <CldUploadWidget
                onUpload={handleUploadSuccess}
                uploadPreset="property_photos"
                options={{
                    maxFiles: 5,
                    multiple: true,
                    resourceType: "image",
                    clientAllowedFormats: ["jpeg", "png", "jpg"],
                }}
            >
                {({ open }) => (
                    <div
                        onClick={() => open?.()} // Ensure 'open' is defined before calling
                        className="relative cursor-pointer border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                        <IoCloudUploadOutline size="2.5em" />
                        <span className="font-medium">Нажмите для загрузки изображений</span>
                    </div>
                )}
            </CldUploadWidget>

            <div className="grid grid-cols-3 gap-4">
                {uploadedImagePaths.map((url, index) => (
                    <div key={index} className="relative">
                        <Image
                            src={url}
                            alt={`Uploaded image ${index + 1}`}
                            width={150}
                            height={150}
                            className="object-cover rounded-md shadow-lg"
                        />
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1"
                        >
                            X
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadImage;
