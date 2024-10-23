"use client";

import React, { useState, useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import RadialProgress from "@/components/ui/progress";
import { uploadImageToCloudinary } from "@/lib/cloudinaryClient";

interface UploadImageProps {
    onUploadComplete?: (urls: string[]) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onUploadComplete }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [uploadedImagePaths, setUploadedImagePaths] = useState<string[]>([]);

    const handleImageUpload = async (image: File) => {
        setLoading(true);
        try {
            const url = await uploadImageToCloudinary(image, (progressEvent) => {
                if (progressEvent.total) {
                    const percentage = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentage);
                }
            });
            setUploadedImagePaths((prev) => [...prev, url]);
            if (onUploadComplete) {
                onUploadComplete([...uploadedImagePaths, url]);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            handleImageUpload(file);
        });
    }, [uploadedImagePaths]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
        } as Accept,
        multiple: true,
    });

    const removeImage = (index: number) => {
        const updatedPaths = uploadedImagePaths.filter((_, i) => i !== index);
        setUploadedImagePaths(updatedPaths);
        if (onUploadComplete) onUploadComplete(updatedPaths);
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 ${
                    isDragActive ? "border-blue-500" : "border-gray-300"
                }`}
            >
                <input {...getInputProps()} />
                <IoCloudUploadOutline size="2em" />
                <p className="ml-2">Drag & drop images here, or click to select</p>
            </div>

            {loading && (
                <div className="flex items-center space-x-2">
                    <RadialProgress progress={progress} />
                    <span>Uploading...</span>
                </div>
            )}

            <div className="grid grid-cols-3 gap-4">
                {uploadedImagePaths.map((url, index) => (
                    <div key={index} className="relative">
                        <Image
                            src={url}
                            alt={`Uploaded image ${index + 1}`}
                            width={150}
                            height={150}
                            className="object-cover rounded-md"
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
