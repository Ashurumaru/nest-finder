// schemas/propertySchema.ts

import { z } from 'zod';
import {RenovationState} from "@prisma/client";

export const propertySchema = z.object({
    title: z.string().min(1, 'Заголовок обязателен'),
    price: z.string(),
    imageUrls: z.array(z.string().url('Неверный формат URL')).optional(),
    address: z.string().min(1, 'Адрес обязателен'),
    city: z.string().min(1, 'Город обязателен'),
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
    type: z.enum(['SALE', 'RENT']),
    property: z.enum(['APARTMENT', 'HOUSE', 'LAND_PLOT']),
    description: z.string().nullable().optional(),

    // Данные для апартаментов
    apartment: z
        .object({
            numBedrooms: z.string().optional(),
            numBathrooms: z.string().optional(),
            floorNumber: z.string().optional(),
            totalFloors: z.string().optional(),
            apartmentArea: z.string().optional(),
            buildingType: z
                .enum(['PANEL', 'BRICK', 'MONOLITH', 'WOOD', 'OTHER'])
                .nullable()
                .optional(),
            yearBuilt: z.string().optional(),
            ceilingHeight: z.string().optional(),
            hasBalcony: z.boolean().optional(),
            hasLoggia: z.boolean().optional(),
            hasWalkInCloset: z.boolean().optional(),
            hasPassengerElevator: z.boolean().optional(),
            hasFreightElevator: z.boolean().optional(),
            heatingType: z
                .enum(['NONE', 'GAS', 'ELECTRIC', 'SOLAR', 'OTHER'])
                .nullable()
                .optional(),
            renovationState: z.nativeEnum(RenovationState).nullable().optional(),
            parkingType: z
                .enum(['GARAGE', 'STREET', 'ASSIGNED', 'COVERED'])
                .nullable()
                .optional(),
            furnished: z.boolean().nullable().optional(),
            internetSpeed: z.string().optional(),
            flooring: z.string().optional(),
            soundproofing: z.boolean().optional(),
        })
        .optional(),

    // Данные для домов
    house: z
        .object({
            numberOfFloors: z.number().int().optional(),
            numberOfRooms: z.number().int().optional(),
            houseArea: z.number().optional(),
            landArea: z.number().optional(),
            wallMaterial: z.string().optional(),
            yearBuilt: z.string().optional(),
            hasGarage: z.boolean().optional(),
            garageArea: z.number().optional(),
            hasBasement: z.boolean().optional(),
            basementArea: z.number().optional(),
            heatingType: z
                .enum(['NONE', 'GAS', 'ELECTRIC', 'SOLAR', 'OTHER'])
                .nullable()
                .optional(),
            houseCondition: z.nativeEnum(RenovationState).nullable().optional(),
            fencing: z.boolean().optional(),
            furnished: z.boolean().nullable().optional(),
            internetSpeed: z.number().optional(),
            flooring: z.string().optional(),
            soundproofing: z.boolean().optional(),
        })
        .optional(),

    // Данные для земельных участков
    landPlot: z
        .object({
            landArea: z.number().optional(),
            landPurpose: z.string().optional(),
            waterSource: z.string().optional(),
            fencing: z.boolean().optional(),
        })
        .optional(),

    // Характеристики аренды
    rentalFeatures: z
        .object({
            rentalTerm: z
                .enum(['DAILY_PAYMENT', 'WEEKLY_PAYMENT', 'MONTHLY_PAYMENT'])
                .optional(),
            securityDeposit: z.number().optional(),
            securityDepositConditions: z.string().optional(),
            utilitiesPayment: z
                .enum(['INCLUDED', 'EXCLUDED', 'PARTIALLY_INCLUDED'])
                .optional(),
            utilitiesCost: z.number().optional(),
            leaseAgreementUrl: z.string().url().optional(),
            petPolicy: z
                .enum(['NOT_ALLOWED', 'ALLOWED', 'ALLOWED_WITH_RESTRICTIONS'])
                .nullable()
                .optional(),
            availabilityDate: z.date().optional(),
            minimumLeaseTerm: z.number().int().optional(),
            maximumLeaseTerm: z.number().int().optional(),
        })
        .optional(),

    // Характеристики продажи
    saleFeatures: z
        .object({
            mortgageAvailable: z.boolean().optional(),
            priceNegotiable: z.boolean().optional(),
            availabilityDate: z.date().optional(),
            titleDeedUrl: z.string().url().optional(),
        })
        .optional(),
});
