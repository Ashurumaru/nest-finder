"use client"

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { PropertyFormData } from '@/types/propertyTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    step1ValidationSchema,
    step2ValidationSchema,
    step3ValidationSchema,
    step4ValidationSchema,
} from '@/lib/validationSchema';

import Step1BasicInfo from './Step1BasicInfo';
import Step2PropertyDetails from './Step2PropertyDetails';
import Step3Amenities from './Step3Amenities';
import Step4Photos from './Step4Photos';
import Step5Review from './Step5Review';
import { uploadImageToCloudinary } from '@/lib/cloudinaryClient';
import toast from 'react-hot-toast';
import { z } from 'zod';

const steps: Array<{
    component: React.FC;
    validationSchema: z.ZodTypeAny | null;
}> = [
    { component: Step1BasicInfo, validationSchema: step1ValidationSchema },
    { component: Step2PropertyDetails, validationSchema: step2ValidationSchema },
    { component: Step3Amenities, validationSchema: step3ValidationSchema },
    { component: Step4Photos, validationSchema: step4ValidationSchema },
    { component: Step5Review, validationSchema: null },
];

const CreatePropertyWizard = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const methods = useForm<PropertyFormData>({
        defaultValues: {
            type: 'sale',
            property: 'apartment',
            title: '',
            description: '',
            price: undefined,
            address: '',
            city: '',
            latitude: undefined,
            longitude: undefined,
            images: null,
        },
        resolver: steps[currentStep].validationSchema
            ? zodResolver(steps[currentStep].validationSchema!)
            : undefined,
        mode: 'onChange',
    });

    const { handleSubmit, trigger } = methods;

    const onNext = async (data: PropertyFormData) => {
        const isValid = await trigger();
        if (isValid) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                await onSubmit(data);
            }
        }
    };

    const onBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (data: PropertyFormData) => {
        try {
            // Обработка загрузки изображений
            let imageUrls: string[] = [];

            if (data.images && data.images.length > 0) {
                imageUrls = await Promise.all(
                    Array.from(data.images).map((file) => uploadImageToCloudinary(file))
                );
            }

            // Подготовка данных для отправки
            const formData = {
                ...data,
                imageUrls,
                price: Number(data.price),
                numBedrooms: data.numBedrooms ? Number(data.numBedrooms) : undefined,
                numBathrooms: data.numBathrooms ? Number(data.numBathrooms) : undefined,
            };

            // Отправка данных на сервер
            const response = await fetch('/api/properties/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Перенаправление после успешного создания
                // Например, router.push('/properties');
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    const fieldErrors = errorData.errors.fieldErrors as Record<string, string[]>;
                    Object.entries(fieldErrors).forEach(([field, errors]) => {
                        errors.forEach((error) => toast.error(`${field}: ${error}`));
                    });
                } else {
                    toast.error(errorData.message || 'Ошибка при создании объявления');
                }
            }
        } catch (error) {
            console.error('Ошибка при создании объявления:', error);
            toast.error('Ошибка при создании объявления');
        }
    };

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onNext)}>
                <CurrentStepComponent />
                <div className="flex justify-between mt-4">
                    {currentStep > 0 && (
                        <button type="button" onClick={onBack} className="btn">
                            Назад
                        </button>
                    )}
                    <button type="submit" className="btn">
                        {currentStep === steps.length - 1 ? 'Опубликовать' : 'Далее'}
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default CreatePropertyWizard;
