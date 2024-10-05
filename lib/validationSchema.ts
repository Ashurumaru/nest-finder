// validationSchema.ts

import { z } from 'zod';

export const step1ValidationSchema = z.object({
    type: z.enum(['sale', 'rent'], { required_error: 'Выберите тип сделки' }),
    property: z.enum(
        ['apartment', 'house', 'condo', 'townhouse', 'commercial', 'land'],
        { required_error: 'Выберите тип недвижимости' }
    ),
    title: z.string().min(1, 'Введите заголовок объявления'),
    description: z.string().min(1, 'Введите описание'),
});

export const step2ValidationSchema = z.object({
    price: z
        .string()
        .min(1, 'Введите цену')
        .transform((val) => Number(val))
        .refine((val) => val > 0, { message: 'Цена должна быть положительной' }),
    address: z.string().min(1, 'Введите адрес'),
    city: z.string().min(1, 'Введите город'),
    latitude: z
        .string()
        .min(1, 'Введите широту')
        .transform((val) => Number(val))
        .refine((val) => val >= -90 && val <= 90, {
            message: 'Широта должна быть от -90 до 90',
        }),
    longitude: z
        .string()
        .min(1, 'Введите долготу')
        .transform((val) => Number(val))
        .refine((val) => val >= -180 && val <= 180, {
            message: 'Долгота должна быть от -180 до 180',
        }),
    numBedrooms: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .refine((val) => (val !== undefined ? val >= 0 : true), {
            message: 'Количество спален должно быть неотрицательным числом',
        }),
    numBathrooms: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .refine((val) => (val !== undefined ? val >= 0 : true), {
            message: 'Количество ванных комнат должно быть неотрицательным числом',
        }),
    floorNumber: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined)),
    totalFloors: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined)),
    hasElevator: z.boolean().optional(),
});

export const step3ValidationSchema = z.object({
    furnished: z.boolean().optional(),
    airConditioning: z.boolean().optional(),
    balcony: z.boolean().optional(),
    moveInDate: z.string().optional(),
    leaseTerm: z
        .enum(['monthToMonth', 'sixMonths', 'oneYear', 'twoYears', 'other'])
        .optional(),
});

export const step4ValidationSchema = z.object({
    images: z
        .any().optional()
        // .refine((files) => files && files.length > 0, {
        //     message: 'Добавьте хотя бы одно изображение',
        // }),
});
