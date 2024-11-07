
'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema } from '@/lib/propertySchema';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import UploadImage from "@/components/property/create-property/UploadImage";
import AddressInput from "@/components/property/create-property/AddressInput";
import MapWithMarker from "@/components/property/create-property/MapWithMarker";
import {extractCityFromAddress} from "@/utils/extractText";

export type PropertyFormValues = z.infer<typeof propertySchema> & { id?: string };
type FieldName = Path<PropertyFormValues>;

interface CreateOrUpdatePropertyFormProps {
    initialData?: PropertyFormValues | null;
}

const CreateOrUpdatePropertyForm: React.FC<CreateOrUpdatePropertyFormProps> = ({
                                                                                   initialData,
                                                                               }) => {
    const form = useForm<PropertyFormValues>({
        defaultValues: initialData || {},
        mode: 'onChange',
    });

    const {
        control,
        formState: { errors },
        setValue,
    } = form;

    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0);

    const handleLocationSelect = (latitude: number, longitude: number, address: string | null) => {
        // Обновление координат и адреса в форме
        setValue("latitude", latitude);
        setValue("longitude", longitude);
        setValue("address", address || "");
        setValue("city", extractCityFromAddress(address || ""));
    };

    const handleAddressSelect = (latitude: number, longitude: number, address: string) => {
        // Обновление координат и адреса при выборе в поле ввода
        setValue("latitude", latitude);
        setValue("longitude", longitude);
        setValue("address", address);
        setValue("city", extractCityFromAddress(address));
    };


    const steps = [
        {
            id: 'Шаг 1',
            name: 'Общая информация',
            fields: ['title', 'price', 'type', 'property', 'description'],
        },
        {
            id: 'Шаг 2',
            name: 'Местоположение',
            fields: ['address', 'city', 'latitude', 'longitude'],
        },
        {
            id: 'Шаг 3',
            name: 'Детали недвижимости',
            fields: [],
        },
        {
            id: 'Шаг 4',
            name: 'Фотографии',
            fields: ['imageUrls'],
        },
        {
            id: 'Шаг 5',
            name: 'Детали сделки',
            fields: [],
        },
        {
            id: 'Шаг 6',
            name: 'Подтверждение и отправка',
            fields: [],
        },
    ];

    const nextStep = async () => {
        console.log("Проверка валидности полей...");

        let fieldsToValidate: FieldName[] = steps[currentStep].fields as FieldName[];

        if (currentStep === 2) {
            const propertyType = form.getValues('property');
            if (propertyType === 'APARTMENT') {
                fieldsToValidate = [
                    'apartment.numBedrooms',
                    'apartment.numBathrooms',
                    'apartment.floorNumber',
                    'apartment.totalFloors',
                    'apartment.apartmentArea',
                    'apartment.buildingType',
                    'apartment.yearBuilt',
                    'apartment.ceilingHeight',
                    'apartment.hasBalcony',
                    'apartment.hasLoggia',
                    'apartment.hasWalkInCloset',
                    'apartment.hasPassengerElevator',
                    'apartment.hasFreightElevator',
                    'apartment.heatingType',
                    'apartment.renovationState',
                    'apartment.parkingType',
                    'apartment.furnished',
                    'apartment.internetSpeed',
                    'apartment.flooring',
                    'apartment.soundproofing',
                ];
            } else if (propertyType === 'HOUSE') {
                fieldsToValidate = [
                    'house.numberOfFloors',
                    'house.numberOfRooms',
                    'house.houseArea',
                    'house.landArea',
                    'house.wallMaterial',
                    'house.yearBuilt',
                    'house.hasGarage',
                    'house.garageArea',
                    'house.hasBasement',
                    'house.basementArea',
                    'house.heatingType',
                    'house.houseCondition',
                    'house.fencing',
                    'house.furnished',
                    'house.internetSpeed',
                    'house.flooring',
                    'house.soundproofing',
                ];
            } else if (propertyType === 'LAND_PLOT') {
                fieldsToValidate = [
                    'landPlot.landArea',
                    'landPlot.landPurpose',
                    'landPlot.waterSource',
                    'landPlot.fencing',
                ];
            }
        } else if (currentStep === 4) {
            const dealType = form.getValues('type');
            if (dealType === 'RENT') {
                fieldsToValidate = [
                    'rentalFeatures.rentalTerm',
                    'rentalFeatures.securityDeposit',
                    'rentalFeatures.securityDepositConditions',
                    'rentalFeatures.utilitiesPayment',
                    'rentalFeatures.utilitiesCost',
                    'rentalFeatures.leaseAgreementUrl',
                    'rentalFeatures.petPolicy',
                    'rentalFeatures.availabilityDate',
                    'rentalFeatures.minimumLeaseTerm',
                    'rentalFeatures.maximumLeaseTerm',
                ];
            } else if (dealType === 'SALE') {
                fieldsToValidate = [
                    'saleFeatures.mortgageAvailable',
                    'saleFeatures.priceNegotiable',
                    'saleFeatures.availabilityDate',
                    'saleFeatures.titleDeedUrl',
                ];
            }
        }

        const isValid = await form.trigger(fieldsToValidate, { shouldFocus: true });
        console.log("Результат валидации:", isValid);

        if (!isValid) return;

        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            console.log("Попытка отправки формы...");
            await form.handleSubmit(onSubmit)();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const onSubmit: SubmitHandler<PropertyFormValues> = async (data) => {
        console.log("Отправка формы началась:", data);
        try {
            if (initialData && initialData.id) {
                await fetch(`/api/properties/${initialData.id}/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            } else {
                console.log("отправка...")
                await fetch('/api/properties/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            }
            router.push('/');
        } catch (error) {
            console.error('Ошибка при сохранении объявления:', error);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    {initialData ? 'Редактировать объявление' : 'Создать новое объявление'}
                </h1>
            </div>
            <Separator />
            <div>
                <ul className="flex gap-4">
                    {steps.map((step, index) => (
                        <li key={step.name} className="md:flex-1">
                            {currentStep > index ? (
                                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </div>
                            ) : currentStep === index ? (
                                <div
                                    className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                                    aria-current="step"
                                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </div>
                            ) : (
                                <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {currentStep === 0 && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Заголовок объявления</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Введите заголовок"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Цена</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Введите цену"
                                                    {...field}
                                                    value={
                                                        field.value !== undefined && field.value !== null
                                                            ? field.value
                                                            : ''
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Тип сделки</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    value={field.value ?? ''}
                                                    className="flex space-x-4"
                                                >
                                                    <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="SALE" />
                                                        </FormControl>
                                                        <FormLabel>Продажа</FormLabel>
                                                    </FormItem>
                                                    <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="RENT" />
                                                        </FormControl>
                                                        <FormLabel>Аренда</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="property"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Тип недвижимости</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    value={field.value ?? ''}
                                                    className="flex space-x-4"
                                                >
                                                    <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="APARTMENT" />
                                                        </FormControl>
                                                        <FormLabel>Квартира</FormLabel>
                                                    </FormItem>
                                                    <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="HOUSE" />
                                                        </FormControl>
                                                        <FormLabel>Дом</FormLabel>
                                                    </FormItem>
                                                    <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="LAND_PLOT" />
                                                        </FormControl>
                                                        <FormLabel>Земельный участок</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Описание</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Введите описание"
                                                        {...field}
                                                        value={field.value ?? ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {currentStep === 1 && (
                            <>
                                <FormField
                                    control={control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Адрес</FormLabel>
                                            <FormControl>
                                                <AddressInput
                                                    onAddressSelect={(latitude, longitude, address) => {
                                                        handleAddressSelect(latitude, longitude, address);
                                                        field.onChange(address); // Update the form state
                                                    }}
                                                    address={field.value} // Pass the current address value
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                <MapWithMarker onLocationSelect={handleLocationSelect} />

                                <FormField
                                    control={control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                {form.watch('property') === 'APARTMENT' && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="apartment.numBedrooms"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Количество спален</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите количество спален"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.numBathrooms"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Количество ванных комнат</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите количество ванных комнат"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.floorNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Этаж</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите этаж"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.totalFloors"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Всего этажей в доме</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите общее количество этажей"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.apartmentArea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Площадь квартиры (кв.м)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите площадь квартиры"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.buildingType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Тип здания</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value ?? ''}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите тип здания" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="PANEL">Панельный</SelectItem>
                                                                <SelectItem value="BRICK">Кирпичный</SelectItem>
                                                                <SelectItem value="MONOLITH">Монолитный</SelectItem>
                                                                <SelectItem value="WOOD">Деревянный</SelectItem>
                                                                <SelectItem value="OTHER">Другой</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.yearBuilt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Год постройки</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите год постройки"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.ceilingHeight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Высота потолков (м)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите высоту потолков"
                                                            step="0.01"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.hasBalcony"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Есть балкон</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.hasLoggia"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Есть лоджия</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.hasWalkInCloset"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Есть гардеробная</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.hasPassengerElevator"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Пассажирский лифт</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.hasFreightElevator"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Грузовой лифт</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.heatingType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Тип отопления</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value ?? ''}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите тип отопления" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="NONE">Нет</SelectItem>
                                                                <SelectItem value="GAS">Газовое</SelectItem>
                                                                <SelectItem value="ELECTRIC">Электрическое</SelectItem>
                                                                <SelectItem value="SOLAR">Солнечное</SelectItem>
                                                                <SelectItem value="OTHER">Другое</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.renovationState"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Состояние ремонта</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value ?? ''}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите состояние ремонта" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="NO_RENOVATION">Без ремонта</SelectItem>
                                                                <SelectItem value="COSMETIC">Косметический</SelectItem>
                                                                <SelectItem value="EURO">Евроремонт</SelectItem>
                                                                <SelectItem value="DESIGNER">Дизайнерский</SelectItem>
                                                                <SelectItem value="OTHER">Другое</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.parkingType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Тип парковки</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value ?? ''}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите тип парковки" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="GARAGE">Гараж</SelectItem>
                                                                <SelectItem value="STREET">Уличная</SelectItem>
                                                                <SelectItem value="ASSIGNED">Закрепленное место</SelectItem>
                                                                <SelectItem value="COVERED">Крытая</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.furnished"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Меблированная</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.internetSpeed"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Скорость интернета (Мбит/с)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите скорость интернета"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.flooring"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Тип напольного покрытия</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Введите тип напольного покрытия"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="apartment.soundproofing"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Звукоизоляция</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {form.watch('property') === 'HOUSE' && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="house.numberOfFloors"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Количество этажей</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите количество этажей"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.numberOfRooms"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Количество комнат</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите количество комнат"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.houseArea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Площадь дома (кв.м)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите площадь дома"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.landArea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Площадь участка (сотки)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите площадь участка"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.wallMaterial"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Материал стен</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Введите материал стен"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.yearBuilt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Год постройки</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите год постройки"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.hasGarage"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Есть гараж</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.garageArea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Площадь гаража (кв.м)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите площадь гаража"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.hasBasement"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Есть подвал</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.basementArea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Площадь подвала (кв.м)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите площадь подвала"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.heatingType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Тип отопления</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите тип отопления" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="NONE">Нет</SelectItem>
                                                                <SelectItem value="GAS">Газовое</SelectItem>
                                                                <SelectItem value="ELECTRIC">Электрическое</SelectItem>
                                                                <SelectItem value="SOLAR">Солнечное</SelectItem>
                                                                <SelectItem value="OTHER">Другое</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.houseCondition"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Состояние дома</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите состояние дома" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="NO_RENOVATION">Без ремонта</SelectItem>
                                                                <SelectItem value="COSMETIC">Косметический</SelectItem>
                                                                <SelectItem value="EURO">Евроремонт</SelectItem>
                                                                <SelectItem value="DESIGNER">Дизайнерский</SelectItem>
                                                                <SelectItem value="OTHER">Другое</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.fencing"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Огороженная территория</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.furnished"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Меблированный</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.internetSpeed"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Скорость интернета (Мбит/с)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите скорость интернета"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.flooring"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Тип напольного покрытия</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Введите тип напольного покрытия"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="house.soundproofing"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Звукоизоляция</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {form.watch('property') === 'LAND_PLOT' && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="landPlot.landArea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Площадь участка (сотки)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите площадь участка"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="landPlot.landPurpose"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Назначение земли</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Введите назначение земли"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="landPlot.waterSource"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Источник воды</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Введите источник воды"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="landPlot.fencing"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Огороженная территория</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                            </>
                        )}

                        {currentStep === 3 && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="imageUrls"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Фотографии</FormLabel>
                                            <FormControl>
                                                <UploadImage
                                                    onUploadComplete={(urls) => field.onChange(urls)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {currentStep === 4 && (
                            <>
                                {form.watch('type') === 'RENT' && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.rentalTerm"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Срок аренды</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите срок аренды" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="DAILY_PAYMENT">Ежедневно</SelectItem>
                                                                <SelectItem value="WEEKLY_PAYMENT">Еженедельно</SelectItem>
                                                                <SelectItem value="MONTHLY_PAYMENT">Ежемесячно</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.securityDeposit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Страховой депозит</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите сумму депозита"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.securityDepositConditions"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Условия депозита</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Введите условия депозита"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.utilitiesPayment"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Оплата коммунальных услуг</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите вариант оплаты" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="INCLUDED">Включено в стоимость</SelectItem>
                                                                <SelectItem value="EXCLUDED">Оплачивается отдельно</SelectItem>
                                                                <SelectItem value="PARTIALLY_INCLUDED">Частично включено</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.utilitiesCost"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Стоимость коммунальных услуг</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите стоимость коммунальных услуг"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.leaseAgreementUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>URL договора аренды</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Введите URL договора аренды"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.petPolicy"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Разрешение на животных</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите политику" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="NOT_ALLOWED">Не разрешено</SelectItem>
                                                                <SelectItem value="ALLOWED">Разрешено</SelectItem>
                                                                <SelectItem value="ALLOWED_WITH_RESTRICTIONS">
                                                                    Разрешено с ограничениями
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.availabilityDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Дата доступности</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            placeholder="Введите дату доступности"
                                                            {...field}
                                                            value={field.value ? field.value.toISOString().substring(0, 10) : ''}
                                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.minimumLeaseTerm"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Минимальный срок аренды (мес.)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите минимальный срок аренды"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="rentalFeatures.maximumLeaseTerm"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Максимальный срок аренды (мес.)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Введите максимальный срок аренды"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {form.watch('type') === 'SALE' && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="saleFeatures.mortgageAvailable"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Ипотека доступна</FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="saleFeatures.priceNegotiable"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value ?? false}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Цена договорная</FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="saleFeatures.availabilityDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Дата доступности</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            placeholder="Введите дату доступности"
                                                            {...field}
                                                            value={field.value ? field.value.toISOString().substring(0, 10) : ''}
                                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="saleFeatures.titleDeedUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>URL свидетельства о праве собственности</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Введите URL свидетельства о праве собственности"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {currentStep === 5 && (
                            <div className="md:col-span-2">
                                <h2 className="mb-4 text-xl font-bold">Подтверждение данных</h2>
                                <pre className="bg-gray-100 p-4">
                  {JSON.stringify(form.getValues(), null, 2)}
                </pre>
                                <Button type="submit" className="mt-4">
                                    Отправить объявление
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-between">
                        {currentStep > 0 && (
                            <Button type="button" onClick={prevStep}>
                                Назад
                            </Button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <Button type="button" onClick={nextStep}>
                                Далее
                            </Button>
                        ) : null}
                    </div>
                </form>
            </Form>
        </>
    );
};

export default CreateOrUpdatePropertyForm;