import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { PropertyFormData } from '@/types/propertyTypes';

const Step4Photos = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext<PropertyFormData>();
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange: (value: FileList | null) => void
    ) => {
        const files = e.target.files;
        if (files) {
            onChange(files);
            const urls = Array.from(files).map((file) =>
                URL.createObjectURL(file)
            );
            setPreviewUrls(urls);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Добавить фотографии</h2>

            <div className="mb-4">
                <Controller
                    name="images"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, field.onChange)}
                            className="input"
                        />
                    )}
                />
                {errors.images?.message && (
                    <p className="text-red-500">{errors.images.message}</p>
                )}
            </div>

            {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Предпросмотр ${index + 1}`}
                            className="w-full h-auto"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Step4Photos;
