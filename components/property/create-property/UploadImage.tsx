'use client';

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle, Upload, Image as ImageIcon } from "lucide-react";

interface UploadImageProps {
    onUploadComplete: (urls: string[]) => void;
    initialImages?: string[];
}

const UploadImage: React.FC<UploadImageProps> = ({
                                                     onUploadComplete,
                                                     initialImages = []
                                                 }) => {
    const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);
    const [isUploading, setIsUploading] = useState(false);

    // Handle successful upload
    const handleUploadSuccess = (result: any) => {
        if (result.event === "success" && result.info.secure_url) {
            const imageUrl = result.info.secure_url;
            const updatedImages = [...uploadedImages, imageUrl];
            setUploadedImages(updatedImages);
            onUploadComplete(updatedImages);
            setIsUploading(false);
        }
    };

    // Remove image
    const handleRemoveImage = (indexToRemove: number) => {
        const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
        setUploadedImages(updatedImages);
        onUploadComplete(updatedImages);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {uploadedImages.map((url, index) => (
                    <Card key={index} className="relative overflow-hidden group">
                        <img
                            src={url}
                            alt={`Uploaded image ${index + 1}`}
                            className="w-full h-48 object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                        >
                            <XCircle className="h-6 w-6 text-rose-500" />
                        </button>
                    </Card>
                ))}

                {uploadedImages.length < 5 && (
                    <CldUploadWidget
                        uploadPreset="property_photos"
                        onUpload={handleUploadSuccess}
                        options={{
                            maxFiles: 1,
                            resourceType: "image",
                            clientAllowedFormats: ["jpeg", "png", "jpg", "webp"],
                        }}
                    >
                        {({ open }) => {
                            return (
                                <Card
                                    onClick={() => {
                                        setIsUploading(true);
                                        open();
                                    }}
                                    className="flex flex-col items-center justify-center h-48 border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                                            <p className="text-sm text-muted-foreground">Загрузка...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-2">
                                            <Upload className="h-10 w-10 text-muted-foreground" />
                                            <p className="text-sm font-medium">Загрузить фото</p>
                                            <p className="text-xs text-muted-foreground">JPEG, PNG или WebP</p>
                                        </div>
                                    )}
                                </Card>
                            );
                        }}
                    </CldUploadWidget>
                )}
            </div>

            {uploadedImages.length === 0 && (
                <div className="bg-muted/50 rounded-lg p-8 flex flex-col items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-center text-muted-foreground">
                        Загрузите фотографии объекта недвижимости для привлечения покупателей
                    </p>
                    <CldUploadWidget
                        uploadPreset="property_photos"
                        onUpload={handleUploadSuccess}
                        options={{
                            maxFiles: 5,
                            multiple: true,
                            resourceType: "image",
                            clientAllowedFormats: ["jpeg", "png", "jpg", "webp"],
                        }}
                    >
                        {({ open }) => (
                            <Button
                                onClick={() => {
                                    setIsUploading(true);
                                    open();
                                }}
                                className="mt-4"
                            >
                                {isUploading ? "Загрузка..." : "Выбрать фотографии"}
                            </Button>
                        )}
                    </CldUploadWidget>
                </div>
            )}
        </div>
    );
};

export default UploadImage;