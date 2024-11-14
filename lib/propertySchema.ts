import { z } from 'zod';
import { RenovationState } from "@prisma/client";

export const propertySchema = z.object({
    title: z.string().min(1, 'Заголовок обязателен'),
    price: z.string().transform(Number).refine((val) => val > 0, {
        message: 'Цена должна быть положительным числом',
    }),
    imageUrls: z.array(z.string().url('Неверный формат URL')).optional(),
    address: z.string().min(1, 'Адрес обязателен'),
    city: z.string().min(1, 'Город обязателен'),
    latitude: z
        .number()
        .refine((val) => val >= -90 && val <= 90, {
            message: 'Широта должна быть от -90 до 90',
        }),
    longitude: z
        .number()
        .refine((val) => val >= -180 && val <= 180, {
            message: 'Долгота должна быть от -180 до 180',
        }),
    type: z.enum(['SALE', 'RENT']),
    property: z.enum(['APARTMENT', 'HOUSE', 'LAND_PLOT']),
    description: z.string().nullable().optional(),
    views: z.number().int().min(0).optional(),
    updatedAt: z.date().optional(),
    createdAt: z.date().optional(),
    userId: z.string().optional(),
    // Данные для апартаментов
    apartment: z
        .object({
            numBedrooms: z.string().transform(Number).optional(),
            numBathrooms: z.string().transform(Number).optional(),
            floorNumber: z.string().transform(Number).optional(),
            totalFloors: z.string().transform(Number).optional(),
            apartmentArea: z.string().transform(Number).optional(),
            buildingType: z
                .enum(['PANEL', 'BRICK', 'MONOLITH', 'WOOD', 'OTHER'])
                .nullable()
                .optional(),
            yearBuilt: z.string().transform(Number).optional(),
            ceilingHeight: z.string().transform(Number).optional(),
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
            internetSpeed: z.string().transform(Number).optional(),
            flooring: z.string().optional(),
            soundproofing: z.boolean().optional(),
        })
        .optional(),

    // Данные для домов
    house: z
        .object({
            numberOfFloors: z.string().transform(Number).optional(),
            numberOfRooms: z.string().transform(Number).optional(),
            houseArea: z.string().transform(Number).optional(),
            landArea: z.string().transform(Number).optional(),
            wallMaterial: z.string().optional(),
            yearBuilt: z.string().transform(Number).optional(),
            hasGarage: z.boolean().optional(),
            garageArea: z.string().transform(Number).optional(),
            hasBasement: z.boolean().optional(),
            basementArea: z.string().transform(Number).optional(),
            heatingType: z
                .enum(['NONE', 'GAS', 'ELECTRIC', 'SOLAR', 'OTHER'])
                .nullable()
                .optional(),
            houseCondition: z.nativeEnum(RenovationState).nullable().optional(),
            fencing: z.boolean().optional(),
            furnished: z.boolean().nullable().optional(),
            internetSpeed: z.string().transform(Number).optional(),
            flooring: z.string().optional(),
            soundproofing: z.boolean().optional(),
        })
        .optional(),

    // Данные для земельных участков
    landPlot: z
        .object({
            landArea: z.string().transform(Number).optional(),
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
            securityDeposit: z.string().transform(Number).optional(),
            securityDepositConditions: z.string().optional(),
            utilitiesPayment: z
                .enum(['INCLUDED', 'EXCLUDED', 'PARTIALLY_INCLUDED'])
                .optional(),
            utilitiesCost: z.string().transform(Number).optional(),
            leaseAgreementUrl: z.string().url().optional(),
            petPolicy: z
                .enum(['NOT_ALLOWED', 'ALLOWED', 'ALLOWED_WITH_RESTRICTIONS'])
                .nullable()
                .optional(),
            availabilityDate: z.date().optional(),
            minimumLeaseTerm: z.string().transform(Number).optional(),
            maximumLeaseTerm: z.string().transform(Number).optional(),
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
