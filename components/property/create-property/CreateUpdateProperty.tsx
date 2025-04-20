'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema } from '@/lib/propertySchema';
import { useRouter } from 'next/navigation';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
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
import { extractCityFromAddress } from "@/utils/extractText";
import { createProperty, updateProperty } from "@/services/propertyService";
import { PropertyFormValues } from "@/types/propertyTypes";
import { z } from 'zod';
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    HomeIcon,
    BuildingIcon,
    MapPinIcon,
    ImageIcon,
    TagIcon,
    CheckCircleIcon
} from "lucide-react";

// Define the type for the Zod schema
type FormValues = z.infer<typeof propertySchema>;

interface CreateUpdatePropertyProps {
    initialData?: PropertyFormValues | null;
}

const CreateUpdateProperty: React.FC<CreateUpdatePropertyProps> = ({ initialData }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || []);


    const form = useForm<FormValues>({
        resolver: zodResolver(propertySchema),
        mode: 'onChange',
    });

    const steps = [
        {
            id: 'Шаг 1',
            name: 'Общая информация',
            icon: <HomeIcon className="h-5 w-5" />,
            fields: ['title', 'price', 'type', 'property', 'description'],
        },
        {
            id: 'Шаг 2',
            name: 'Местоположение',
            icon: <MapPinIcon className="h-5 w-5" />,
            fields: ['address', 'city', 'latitude', 'longitude'],
        },
        {
            id: 'Шаг 3',
            name: 'Детали недвижимости',
            icon: <BuildingIcon className="h-5 w-5" />,
            fields: [],
        },
        {
            id: 'Шаг 4',
            name: 'Фотографии',
            icon: <ImageIcon className="h-5 w-5" />,
            fields: ['imageUrls'],
        },
        {
            id: 'Шаг 5',
            name: 'Детали сделки',
            icon: <TagIcon className="h-5 w-5" />,
            fields: [],
        },
        {
            id: 'Шаг 6',
            name: 'Подтверждение',
            icon: <CheckCircleIcon className="h-5 w-5" />,
            fields: [],
        },
    ];

    const handleLocationSelect = (latitude: number, longitude: number, address: string | null) => {
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);

        if (address) {
            form.setValue("address", address);
            const city = extractCityFromAddress(address);
            form.setValue("city", city);
        }
    };

    const handleAddressSelect = (latitude: number, longitude: number, address: string) => {
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);
        form.setValue("address", address);

        const city = extractCityFromAddress(address);
        form.setValue("city", city);
    };

    const handleImageUpload = (urls: string[]) => {
        setImageUrls(urls);
        form.setValue("imageUrls", urls);
    };

    const nextStep = async () => {
        const fieldsToValidate = steps[currentStep].fields;

        if (fieldsToValidate.length > 0) {
            const isValid = await form.trigger(fieldsToValidate as any);
            if (!isValid) return;
        }

        // Add conditional validation for property type specific fields
        if (currentStep === 2) {
            const propertyType = form.getValues('property');
            let isValid = true;

            if (propertyType === 'APARTMENT') {
                isValid = await form.trigger([
                    'apartment.numBedrooms',
                    'apartment.numBathrooms',
                    'apartment.floorNumber',
                    'apartment.totalFloors',
                    'apartment.apartmentArea',
                ] as any);
            } else if (propertyType === 'HOUSE') {
                isValid = await form.trigger([
                    'house.numberOfFloors',
                    'house.numberOfRooms',
                    'house.houseArea',
                    'house.landArea',
                ] as any);
            } else if (propertyType === 'LAND_PLOT') {
                isValid = await form.trigger([
                    'landPlot.landArea',
                    'landPlot.landPurpose',
                ] as any);
            }

            if (!isValid) return;
        }

        if (currentStep === 4) {
            const dealType = form.getValues('type');
            let isValid = true;

            if (dealType === 'RENT') {
                isValid = await form.trigger([
                    'rentalFeatures.rentalTerm',
                    'rentalFeatures.securityDeposit',
                ] as any);
            } else if (dealType === 'SALE') {
                isValid = await form.trigger([
                    'saleFeatures.mortgageAvailable',
                ] as any);
            }

            if (!isValid) return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            await handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const values = form.getValues();

            // Make sure imageUrls is properly set
            values.imageUrls = imageUrls;

            if (initialData?.id) {
                await updateProperty(initialData.id, values as PropertyFormValues);
                toast.success('Объявление успешно обновлено');
            } else {
                await createProperty(values as PropertyFormValues);
                toast.success('Объявление успешно создано');
            }

            router.push('/profile#my-properties');
        } catch (error) {
            console.error('Ошибка при сохранении объявления:', error);
            toast.error('Ошибка при сохранении объявления');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    {initialData ? 'Редактировать объявление' : 'Создать новое объявление'}
                </h1>
            </div>

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2 md:gap-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex items-center cursor-pointer transition-all ${
                                    currentStep >= index
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                }`}
                                onClick={() => {
                                    if (index < currentStep) {
                                        setCurrentStep(index);
                                    }
                                }}
                            >
                                <div className={`
                  flex items-center justify-center rounded-full mr-2
                  ${currentStep >= index
                                    ? "text-white bg-primary"
                                    : "bg-muted text-muted-foreground"
                                } size-8`}
                                >
                                    {step.icon}
                                </div>
                                <span className="hidden md:inline text-sm font-medium">{step.name}</span>
                                {index < steps.length - 1 && (
                                    <span className="mx-2 text-muted-foreground">→</span>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Form {...form}>
                <form>
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                                            value={field.value || ''}
                                                            className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                            type="text"
                                                            placeholder="Введите цену"
                                                            {...field}
                                                            value={field.value || ''}
                                                            className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                            value={field.value as string || undefined}
                                                            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="SALE" />
                                                                </FormControl>
                                                                <FormLabel className="cursor-pointer font-normal">Продажа</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="RENT" />
                                                                </FormControl>
                                                                <FormLabel className="cursor-pointer font-normal">Аренда</FormLabel>
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
                                                            value={field.value as string || undefined}
                                                            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="APARTMENT" />
                                                                </FormControl>
                                                                <FormLabel className="cursor-pointer font-normal">Квартира</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="HOUSE" />
                                                                </FormControl>
                                                                <FormLabel className="cursor-pointer font-normal">Дом</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="LAND_PLOT" />
                                                                </FormControl>
                                                                <FormLabel className="cursor-pointer font-normal">Земельный участок</FormLabel>
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
                                                                placeholder="Введите описание объекта недвижимости"
                                                                {...field}
                                                                value={field.value || ''}
                                                                className="h-32 resize-none transition-all focus:ring-2 focus:ring-primary/20"
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
                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Адрес</FormLabel>
                                                        <FormControl>
                                                            <AddressInput
                                                                onAddressSelect={(latitude, longitude, address) => {
                                                                    handleAddressSelect(latitude, longitude, address);
                                                                }}
                                                                address={field.value || ''}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="md:col-span-2 mt-4">
                                            <MapWithMarker
                                                onLocationSelect={handleLocationSelect}
                                                initialCenter={
                                                    form.getValues('longitude') && form.getValues('latitude')
                                                        ? [form.getValues('longitude'), form.getValues('latitude')]
                                                        : undefined
                                                }
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Город</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Город автоматически определится из адреса"
                                                            {...field}
                                                            value={field.value || ''}
                                                            className="transition-all focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="latitude"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Широта</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Определится по карте"
                                                                {...field}
                                                                value={field.value || ''}
                                                                className="transition-all focus:ring-2 focus:ring-primary/20"
                                                                readOnly
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="longitude"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Долгота</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Определится по карте"
                                                                {...field}
                                                                value={field.value || ''}
                                                                className="transition-all focus:ring-2 focus:ring-primary/20"
                                                                readOnly
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </>
                                )}

                                {currentStep === 2 && (
                                    <>
                                        {form.watch('property') === 'APARTMENT' && (
                                            <>
                                                <div className="md:col-span-2">
                                                    <Badge className="mb-4">Информация о квартире</Badge>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="apartment.numBedrooms"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Количество спален</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Введите количество спален"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    type="text"
                                                                    placeholder="Введите количество ванных комнат"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    type="text"
                                                                    placeholder="Введите этаж"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    type="text"
                                                                    placeholder="Введите общее количество этажей"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    type="text"
                                                                    placeholder="Введите площадь квартиры"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    value={field.value || undefined}
                                                                >
                                                                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
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

                                                <div className="md:col-span-2">
                                                    <Separator className="my-4" />
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="apartment.hasBalcony"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value || false}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="cursor-pointer font-normal">Балкон</FormLabel>
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
                                                                            checked={field.value || false}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="cursor-pointer font-normal">Лоджия</FormLabel>
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
                                                                            checked={field.value || false}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="cursor-pointer font-normal">Гардеробная</FormLabel>
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
                                                                            checked={field.value || false}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="cursor-pointer font-normal">Мебель</FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {form.watch('property') === 'HOUSE' && (
                                            <>
                                                <div className="md:col-span-2">
                                                    <Badge className="mb-4">Информация о доме</Badge>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="house.numberOfFloors"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Количество этажей</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Введите количество этажей"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    type="text"
                                                                    placeholder="Введите количество комнат"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    type="text"
                                                                    placeholder="Введите площадь дома"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    type="text"
                                                                    placeholder="Введите площадь участка"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="md:col-span-2">
                                                    <Separator className="my-4" />
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="house.hasGarage"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value || false}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="cursor-pointer font-normal">Гараж</FormLabel>
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
                                                                            checked={field.value || false}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="cursor-pointer font-normal">Подвал</FormLabel>
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
                                                                            checked={field.value || false}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="cursor-pointer font-normal">Ограждение</FormLabel>
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
                                                                            checked={field.value || false}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="cursor-pointer font-normal">Мебель</FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {form.watch('property') === 'LAND_PLOT' && (
                                            <>
                                                <div className="md:col-span-2">
                                                    <Badge className="mb-4">Информация об участке</Badge>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="landPlot.landArea"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Площадь участка (сотки)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Введите площадь участка"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                    checked={field.value || false}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="cursor-pointer font-normal">Огороженная территория</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        )}
                                    </>
                                )}

                                {currentStep === 3 && (
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name="imageUrls"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Фотографии</FormLabel>
                                                    <FormDescription>
                                                        Загрузите до 5 фотографий объекта недвижимости
                                                    </FormDescription>
                                                    <FormControl>
                                                        <UploadImage
                                                            onUploadComplete={handleImageUpload}
                                                            initialImages={imageUrls}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <>
                                        {form.watch('type') === 'RENT' && (
                                            <>
                                                <div className="md:col-span-2">
                                                    <Badge className="mb-4">Детали аренды</Badge>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="rentalFeatures.rentalTerm"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Срок аренды</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value || undefined}
                                                                >
                                                                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
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
                                                                    type="text"
                                                                    placeholder="Введите сумму депозита"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value || undefined}
                                                                >
                                                                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
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
                                                    name="rentalFeatures.petPolicy"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Разрешение на животных</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value || undefined}
                                                                >
                                                                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
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
                                                                    value={
                                                                        field.value instanceof Date && !isNaN(field.value.getTime())
                                                                            ? field.value.toISOString().substring(0, 10)
                                                                            : ''
                                                                    }
                                                                    onChange={(e) => {
                                                                        const dateValue = new Date(e.target.value);
                                                                        if (!isNaN(dateValue.getTime())) {
                                                                            field.onChange(dateValue);
                                                                        }
                                                                    }}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                                <div className="md:col-span-2">
                                                    <Badge className="mb-4">Детали продажи</Badge>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="saleFeatures.mortgageAvailable"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value || false}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="cursor-pointer font-normal">Ипотека доступна</FormLabel>
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
                                                                    checked={field.value || false}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="cursor-pointer font-normal">Цена договорная</FormLabel>
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
                                                                    value={
                                                                        field.value instanceof Date && !isNaN(field.value.getTime())
                                                                            ? field.value.toISOString().substring(0, 10)
                                                                            : ''
                                                                    }
                                                                    onChange={(e) => {
                                                                        const dateValue = new Date(e.target.value);
                                                                        if (!isNaN(dateValue.getTime())) {
                                                                            field.onChange(dateValue);
                                                                        }
                                                                    }}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20"
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
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-semibold">Предпросмотр объявления</h2>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.scrollTo(0, 0)}
                                                    className="text-xs"
                                                >
                                                    Все выглядит отлично!
                                                </Button>
                                            </div>

                                            {/* Preview Header */}
                                            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                                                {/* Image Gallery */}
                                                <div className="relative">
                                                    {imageUrls.length > 0 ? (
                                                        <div className="aspect-video relative overflow-hidden bg-muted">
                                                            <img
                                                                src={imageUrls[0]}
                                                                alt={form.getValues('title')}
                                                                className="w-full h-full object-cover"
                                                            />

                                                            {/* Image count */}
                                                            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                                                                {imageUrls.length} фото
                                                            </div>

                                                            {/* Price tag */}
                                                            <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1.5 rounded-full font-bold flex items-center">
                                                                {Number(form.getValues('price')).toLocaleString('ru-RU')} ₽
                                                                {form.getValues('type') === 'RENT' && <span className="ml-1 text-xs">/мес</span>}
                                                            </div>

                                                            {/* Property tag */}
                                                            <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-medium shadow">
                                                                {form.getValues('type') === 'SALE' ? '🏷️ Продажа' : '🔄 Аренда'}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="aspect-video bg-muted flex flex-col items-center justify-center">
                                                            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                                                            <p className="text-muted-foreground">Нет загруженных фотографий</p>
                                                        </div>
                                                    )}

                                                    {/* Thumbnail row */}
                                                    {imageUrls.length > 1 && (
                                                        <div className="flex overflow-x-auto gap-2 p-2 bg-muted/20">
                                                            {imageUrls.map((url, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={url}
                                                                    alt={`Фото ${index + 1}`}
                                                                    className="w-16 h-16 object-cover rounded flex-shrink-0 border-2 border-transparent hover:border-primary cursor-pointer transition-all"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-4 space-y-4">
                                                    <div>
                                                        <h1 className="text-2xl font-bold">{form.getValues('title')}</h1>
                                                        <p className="text-muted-foreground">{form.getValues('address')}</p>
                                                    </div>

                                                    {/* Feature Badges */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {form.getValues('property') === 'APARTMENT' && (
                                                            <>
                                                                {form.getValues('apartment.numBedrooms') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg>
                                                                        {form.getValues('apartment.numBedrooms')} спален
                                                                    </Badge>
                                                                )}
                                                                {form.getValues('apartment.numBathrooms') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bath"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path><line x1="10" x2="8" y1="5" y2="7"></line><line x1="2" x2="22" y1="12" y2="12"></line><line x1="7" x2="7" y1="19" y2="21"></line><line x1="17" x2="17" y1="19" y2="21"></line></svg>
                                                                        {form.getValues('apartment.numBathrooms')} ванных
                                                                    </Badge>
                                                                )}
                                                                {form.getValues('apartment.apartmentArea') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>
                                                                        {form.getValues('apartment.apartmentArea')} м²
                                                                    </Badge>
                                                                )}
                                                                {form.getValues('apartment.floorNumber') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path><path d="m22 11.08-8.58 3.91a2 2 0 0 1-1.66 0L3.2 11.08"></path><path d="m22 16.08-8.58 3.91a2 2 0 0 1-1.66 0L3.2 16.08"></path></svg>
                                                                        Этаж {form.getValues('apartment.floorNumber')}/{form.getValues('apartment.totalFloors') || '?'}
                                                                    </Badge>
                                                                )}
                                                            </>
                                                        )}

                                                        {form.getValues('property') === 'HOUSE' && (
                                                            <>
                                                                {form.getValues('house.numberOfRooms') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 22V12h6v10"></path><path d="M2 13l10-9 10 9"></path><path d="M3 10v12h7"></path><path d="M21 22V10"></path></svg>
                                                                        {form.getValues('house.numberOfRooms')} комнат
                                                                    </Badge>
                                                                )}
                                                                {form.getValues('house.houseArea') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>
                                                                        {form.getValues('house.houseArea')} м²
                                                                    </Badge>
                                                                )}
                                                                {form.getValues('house.landArea') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"></path><circle cx="12" cy="8" r="2"></circle></svg>
                                                                        Участок: {form.getValues('house.landArea')} соток
                                                                    </Badge>
                                                                )}
                                                                {form.getValues('house.numberOfFloors') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path><path d="m22 11.08-8.58 3.91a2 2 0 0 1-1.66 0L3.2 11.08"></path><path d="m22 16.08-8.58 3.91a2 2 0 0 1-1.66 0L3.2 16.08"></path></svg>
                                                                        {form.getValues('house.numberOfFloors')} { 'этаж'}
                                                                    </Badge>
                                                                )}
                                                            </>
                                                        )}

                                                        {form.getValues('property') === 'LAND_PLOT' && (
                                                            <>
                                                                {form.getValues('landPlot.landArea') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"></path><circle cx="12" cy="8" r="2"></circle></svg>
                                                                        {form.getValues('landPlot.landArea')} соток
                                                                    </Badge>
                                                                )}
                                                                {form.getValues('landPlot.landPurpose') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22v-5l5-5 5 5-5 5z"></path><path d="M9.5 14.5 16 8"></path><path d="m17 2 5 5-5 5-5-5z"></path></svg>
                                                                        {form.getValues('landPlot.landPurpose')}
                                                                    </Badge>
                                                                )}
                                                                {form.getValues('landPlot.fencing') && (
                                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"></path><path d="M4 12h8"></path><path d="M4 18h4"></path></svg>
                                                                        Ограждение
                                                                    </Badge>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Description */}
                                                    <div>
                                                        <h3 className="font-medium mb-2">Описание</h3>
                                                        <p className="text-muted-foreground">
                                                            {form.getValues('description') || 'Описание отсутствует'}
                                                        </p>
                                                    </div>

                                                    {/* Additional Info */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                        {/* Deal Details */}
                                                        <Card className="bg-muted/30">
                                                            <CardContent className="p-4">
                                                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                                                    Условия сделки
                                                                </h3>
                                                                <ul className="space-y-2 text-sm">
                                                                    {form.getValues('type') === 'SALE' && (
                                                                        <>
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Ипотека:</span>
                                                                                <span>{form.getValues('saleFeatures.mortgageAvailable') ? 'Доступна' : 'Недоступна'}</span>
                                                                            </li>
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Торг:</span>
                                                                                <span>{form.getValues('saleFeatures.priceNegotiable') ? 'Возможен' : 'Невозможен'}</span>
                                                                            </li>
                                                                        </>
                                                                    )}

                                                                    {form.getValues('type') === 'RENT' && (
                                                                        <>
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Тип оплаты:</span>
                                                                                <span>
                                          {form.getValues('rentalFeatures.rentalTerm') === 'DAILY_PAYMENT' ? 'Ежедневно' :
                                              form.getValues('rentalFeatures.rentalTerm') === 'WEEKLY_PAYMENT' ? 'Еженедельно' : 'Ежемесячно'}
                                        </span>
                                                                            </li>
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Страховой депозит:</span>
                                                                                <span>{form.getValues('rentalFeatures.securityDeposit') ? `${form.getValues('rentalFeatures.securityDeposit')} ₽` : 'Не требуется'}</span>
                                                                            </li>
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Коммунальные услуги:</span>
                                                                                <span>
                                          {form.getValues('rentalFeatures.utilitiesPayment') === 'INCLUDED' ? 'Включены в стоимость' :
                                              form.getValues('rentalFeatures.utilitiesPayment') === 'EXCLUDED' ? 'Оплачиваются отдельно' : 'Частично включены'}
                                        </span>
                                                                            </li>
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Животные:</span>
                                                                                <span>
                                          {form.getValues('rentalFeatures.petPolicy') === 'ALLOWED' ? 'Разрешены' :
                                              form.getValues('rentalFeatures.petPolicy') === 'ALLOWED_WITH_RESTRICTIONS' ? 'С ограничениями' : 'Не разрешены'}
                                        </span>
                                                                            </li>
                                                                        </>
                                                                    )}
                                                                </ul>
                                                            </CardContent>
                                                        </Card>

                                                        {/* Property Details */}
                                                        <Card className="bg-muted/30">
                                                            <CardContent className="p-4">
                                                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                                                    Характеристики объекта
                                                                </h3>
                                                                <ul className="space-y-2 text-sm">
                                                                    {form.getValues('property') === 'APARTMENT' && (
                                                                        <>
                                                                            {form.getValues('apartment.buildingType') && (
                                                                                <li className="flex justify-between">
                                                                                    <span className="text-muted-foreground">Тип здания:</span>
                                                                                    <span>
                                            {form.getValues('apartment.buildingType') === 'PANEL' ? 'Панельный' :
                                                form.getValues('apartment.buildingType') === 'BRICK' ? 'Кирпичный' :
                                                    form.getValues('apartment.buildingType') === 'MONOLITH' ? 'Монолитный' :
                                                        form.getValues('apartment.buildingType') === 'WOOD' ? 'Деревянный' : 'Другой'}
                                          </span>
                                                                                </li>
                                                                            )}
                                                                            {form.getValues('apartment.yearBuilt') && (
                                                                                <li className="flex justify-between">
                                                                                    <span className="text-muted-foreground">Год постройки:</span>
                                                                                    <span>{form.getValues('apartment.yearBuilt')}</span>
                                                                                </li>
                                                                            )}
                                                                            {form.getValues('apartment.renovationState') && (
                                                                                <li className="flex justify-between">
                                                                                    <span className="text-muted-foreground">Ремонт:</span>
                                                                                    <span>
                                            {form.getValues('apartment.renovationState') === 'NO_RENOVATION' ? 'Без ремонта' :
                                                form.getValues('apartment.renovationState') === 'COSMETIC' ? 'Косметический' :
                                                    form.getValues('apartment.renovationState') === 'EURO' ? 'Евроремонт' :
                                                        form.getValues('apartment.renovationState') === 'DESIGNER' ? 'Дизайнерский' : 'Другое'}
                                          </span>
                                                                                </li>
                                                                            )}
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Мебель:</span>
                                                                                <span>{form.getValues('apartment.furnished') ? 'Есть' : 'Нет'}</span>
                                                                            </li>
                                                                        </>
                                                                    )}

                                                                    {form.getValues('property') === 'HOUSE' && (
                                                                        <>
                                                                            {form.getValues('house.wallMaterial') && (
                                                                                <li className="flex justify-between">
                                                                                    <span className="text-muted-foreground">Материал стен:</span>
                                                                                    <span>{form.getValues('house.wallMaterial')}</span>
                                                                                </li>
                                                                            )}
                                                                            {form.getValues('house.yearBuilt') && (
                                                                                <li className="flex justify-between">
                                                                                    <span className="text-muted-foreground">Год постройки:</span>
                                                                                    <span>{form.getValues('house.yearBuilt')}</span>
                                                                                </li>
                                                                            )}
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Гараж:</span>
                                                                                <span>{form.getValues('house.hasGarage') ? 'Есть' : 'Нет'}</span>
                                                                            </li>
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Мебель:</span>
                                                                                <span>{form.getValues('house.furnished') ? 'Есть' : 'Нет'}</span>
                                                                            </li>
                                                                        </>
                                                                    )}

                                                                    {form.getValues('property') === 'LAND_PLOT' && (
                                                                        <>
                                                                            {form.getValues('landPlot.waterSource') && (
                                                                                <li className="flex justify-between">
                                                                                    <span className="text-muted-foreground">Водоснабжение:</span>
                                                                                    <span>{form.getValues('landPlot.waterSource')}</span>
                                                                                </li>
                                                                            )}
                                                                            <li className="flex justify-between">
                                                                                <span className="text-muted-foreground">Ограждение:</span>
                                                                                <span>{form.getValues('landPlot.fencing') ? 'Есть' : 'Нет'}</span>
                                                                            </li>
                                                                        </>
                                                                    )}
                                                                </ul>
                                                            </CardContent>
                                                        </Card>
                                                    </div>

                                                    {/* Edit Buttons */}
                                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentStep(0)}
                                                            className="text-xs"
                                                        >
                                                            Общая информация
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentStep(1)}
                                                            className="text-xs"
                                                        >
                                                            Местоположение
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentStep(2)}
                                                            className="text-xs"
                                                        >
                                                            Детали
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentStep(3)}
                                                            className="text-xs"
                                                        >
                                                            Фотографии
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentStep(4)}
                                                            className="text-xs"
                                                        >
                                                            Сделка
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between mt-6">
                        {currentStep > 0 && (
                            <Button
                                type="button"
                                onClick={prevStep}
                                variant="outline"
                                className="transition-all"
                            >
                                Назад
                            </Button>
                        )}

                        <Button
                            type="button"
                            onClick={nextStep}
                            disabled={isSubmitting}
                            className="ml-auto transition-all"
                        >
                            {currentStep === steps.length - 1 ? 'Отправить объявление' : 'Далее'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateUpdateProperty;