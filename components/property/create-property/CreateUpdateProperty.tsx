'use client';

import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {propertySchema} from '@/lib/propertySchema';
import {useRouter} from 'next/navigation';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Separator} from '@/components/ui/separator';
import UploadImage from "@/components/property/create-property/UploadImage";
import AddressInput from "@/components/property/create-property/AddressInput";
import MapWithMarker from "@/components/property/create-property/MapWithMarker";
import {extractCityFromAddress} from "@/utils/extractText";
import {createProperty, updateProperty} from "@/services/propertyService";
import {PropertyFormValues} from "@/types/propertyTypes";
import {z} from 'zod';
import {toast} from "react-hot-toast";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
    HomeIcon,
    BuildingIcon,
    MapPinIcon,
    ImageIcon,
    TagIcon,
    CheckCircleIcon,
    BedIcon,
    BathIcon,
    SquareIcon,
    LayersIcon,
    TreesIcon,
    DollarSignIcon,
    CalendarIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";

// Define the type for the Zod schema
type FormValues = z.infer<typeof propertySchema>;

interface CreateUpdatePropertyProps {
    initialData?: PropertyFormValues | null;
}

const CreateUpdateProperty: React.FC<CreateUpdatePropertyProps> = ({initialData}) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || []);
    const [formProgress, setFormProgress] = useState(0);

    const form = useForm<FormValues>({
        resolver: zodResolver(propertySchema),
        mode: 'onChange',

    });

    // Calculate form progress
    useEffect(() => {
        const calculateProgress = () => {
            const values = form.getValues();
            let filledFields = 0;
            let totalFields = 0;

            // Count required fields based on property type
            const requiredFields = [
                'title', 'price', 'type', 'property', 'description',
                'address', 'city', 'latitude', 'longitude',
                'imageUrls'
            ];

            totalFields = requiredFields.length;

            // Count filled fields
            requiredFields.forEach(field => {
                if (values[field as keyof FormValues]) {
                    filledFields++;
                }
            });

            // Add property-specific fields
            if (values.property === 'APARTMENT') {
                const apartmentFields = [
                    'apartment.numBedrooms', 'apartment.numBathrooms',
                    'apartment.floorNumber', 'apartment.totalFloors',
                    'apartment.apartmentArea'
                ];
                totalFields += apartmentFields.length;

                apartmentFields.forEach(field => {
                    const nestedValue = field.split('.').reduce((obj, key) =>
                        obj && obj[key as keyof typeof obj], values as any);
                    if (nestedValue) {
                        filledFields++;
                    }
                });
            } else if (values.property === 'HOUSE') {
                const houseFields = [
                    'house.numberOfFloors', 'house.numberOfRooms',
                    'house.houseArea', 'house.landArea'
                ];
                totalFields += houseFields.length;

                houseFields.forEach(field => {
                    const nestedValue = field.split('.').reduce((obj, key) =>
                        obj && obj[key as keyof typeof obj], values as any);
                    if (nestedValue) {
                        filledFields++;
                    }
                });
            } else if (values.property === 'LAND_PLOT') {
                const landFields = ['landPlot.landArea', 'landPlot.landPurpose'];
                totalFields += landFields.length;

                landFields.forEach(field => {
                    const nestedValue = field.split('.').reduce((obj, key) =>
                        obj && obj[key as keyof typeof obj], values as any);
                    if (nestedValue) {
                        filledFields++;
                    }
                });
            }

            // Add deal type specific fields
            if (values.type === 'RENT') {
                const rentFields = [
                    'rentalFeatures.rentalTerm', 'rentalFeatures.securityDeposit'
                ];
                totalFields += rentFields.length;

                rentFields.forEach(field => {
                    const nestedValue = field.split('.').reduce((obj, key) =>
                        obj && obj[key as keyof typeof obj], values as any);
                    if (nestedValue) {
                        filledFields++;
                    }
                });
            } else if (values.type === 'SALE') {
                const saleFields = ['saleFeatures.mortgageAvailable'];
                totalFields += saleFields.length;

                saleFields.forEach(field => {
                    const nestedValue = field.split('.').reduce((obj, key) =>
                        obj && obj[key as keyof typeof obj], values as any);
                    if (nestedValue) {
                        filledFields++;
                    }
                });
            }

            return Math.round((filledFields / totalFields) * 100);
        };

        const progress = calculateProgress();
        setFormProgress(progress);
    }, [form.watch()]);

    const steps = [
        {
            id: 'step-1',
            name: 'Общая информация',
            icon: <HomeIcon className="h-5 w-5"/>,
            fields: ['title', 'price', 'type', 'property', 'description'],
        },
        {
            id: 'step-2',
            name: 'Местоположение',
            icon: <MapPinIcon className="h-5 w-5"/>,
            fields: ['address', 'city', 'latitude', 'longitude'],
        },
        {
            id: 'step-3',
            name: 'Детали недвижимости',
            icon: <BuildingIcon className="h-5 w-5"/>,
            fields: [],
        },
        {
            id: 'step-4',
            name: 'Фотографии',
            icon: <ImageIcon className="h-5 w-5"/>,
            fields: ['imageUrls'],
        },
        {
            id: 'step-5',
            name: 'Детали сделки',
            icon: <TagIcon className="h-5 w-5"/>,
            fields: [],
        },
        {
            id: 'step-6',
            name: 'Подтверждение',
            icon: <CheckCircleIcon className="h-5 w-5"/>,
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
            toast.success('Местоположение успешно выбрано');
        }
    };

    const handleAddressSelect = (latitude: number, longitude: number, address: string) => {
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);
        form.setValue("address", address);

        const city = extractCityFromAddress(address);
        form.setValue("city", city);
        toast.success('Адрес успешно выбран');
    };

    const handleImageUpload = (urls: string[]) => {
        setImageUrls(urls);
        form.setValue("imageUrls", urls);
        if (urls.length > 0) {
            toast.success(`Загружено ${urls.length} фотографий`);
        }
    };

    const nextStep = async () => {
        const fieldsToValidate = steps[currentStep].fields;

        if (fieldsToValidate.length > 0) {
            const isValid = await form.trigger(fieldsToValidate as any);
            if (!isValid) {
                toast.error('Пожалуйста, заполните все обязательные поля');
                return;
            }
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

            if (!isValid) {
                toast.error('Пожалуйста, заполните все обязательные поля');
                return;
            }
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

            if (!isValid) {
                toast.error('Пожалуйста, заполните все обязательные поля');
                return;
            }
        }

        if (currentStep < steps.length - 1) {
            toast.success(`Шаг ${currentStep + 1} завершен`);
            setCurrentStep(prev => prev + 1);
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            await handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({top: 0, behavior: 'smooth'});
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
        <div className="space-y-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-md">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">
                            {initialData ? 'Редактировать объявление' : 'Создать новое объявление'}
                        </CardTitle>
                        <Badge variant="outline" className="px-3 py-1 font-medium">
                            Прогресс: {formProgress}%
                        </Badge>
                    </div>
                    <CardDescription>
                        Заполните информацию о вашем объекте недвижимости для создания привлекательного объявления
                    </CardDescription>

                    <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                            style={{width: `${formProgress}%`}}
                        />
                    </div>
                </CardHeader>
            </Card>

            <Card className="shadow-md border-none overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex overflow-x-auto p-2 md:p-4 bg-muted/30 border-b scrollbar-hide">
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                disabled={index > currentStep}
                                className={`
                                    flex items-center whitespace-nowrap mx-1 px-3 py-2 rounded-lg
                                    transition-all duration-200 ease-in-out
                                    ${index === currentStep
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : index < currentStep
                                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                                        : "bg-muted text-muted-foreground"
                                }
                                    ${index > currentStep ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                `}
                                onClick={() => {
                                    if (index < currentStep) {
                                        setCurrentStep(index);
                                        window.scrollTo({top: 0, behavior: 'smooth'});
                                    }
                                }}
                            >
                                <div className={`
                                    flex items-center justify-center rounded-full mr-2 size-7
                                    ${index === currentStep
                                    ? "bg-primary-foreground text-primary"
                                    : index < currentStep
                                        ? "bg-primary/20 text-primary"
                                        : "bg-muted-foreground/20 text-muted-foreground"
                                }
                                `}>
                                    {index < currentStep ? (
                                        <CheckCircleIcon className="h-4 w-4"/>
                                    ) : (
                                        step.icon
                                    )}
                                </div>
                                <span className="text-sm font-medium">{step.name}</span>
                                {index < steps.length - 1 && (
                                    <ArrowRightIcon className="ml-2 size-4 text-muted-foreground"/>
                                )}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Form {...form}>
                <form>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`step-${currentStep}`}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}
                        >
                            <Card className="shadow-md border-none">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {steps[currentStep].icon}
                                        {steps[currentStep].name}
                                    </CardTitle>
                                    <CardDescription>
                                        {currentStep === 0 && "Укажите основную информацию о вашем объявлении"}
                                        {currentStep === 1 && "Укажите местоположение вашего объекта недвижимости"}
                                        {currentStep === 2 && "Опишите детали вашего объекта недвижимости"}
                                        {currentStep === 3 && "Загрузите фотографии вашего объекта недвижимости"}
                                        {currentStep === 4 && "Укажите детали сделки"}
                                        {currentStep === 5 && "Проверьте введенную информацию перед публикацией"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {currentStep === 0 && (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name="title"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base">Заголовок
                                                                объявления</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Введите заголовок"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="price"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base">Цена</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <DollarSignIcon
                                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Введите цену"
                                                                        {...field}
                                                                        value={field.value || ''}
                                                                        className="transition-all focus:ring-2 focus:ring-primary/20 pl-10 h-12"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="type"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base">Тип сделки</FormLabel>
                                                            <FormControl>
                                                                <RadioGroup
                                                                    onValueChange={field.onChange}
                                                                    value={field.value as string || undefined}
                                                                    className="grid grid-cols-2 gap-4"
                                                                >
                                                                    <FormItem
                                                                        className="flex items-center space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <div className="relative w-full">
                                                                                <RadioGroupItem
                                                                                    value="SALE"
                                                                                    id="sale-option"
                                                                                    className="peer sr-only"
                                                                                />
                                                                                <label
                                                                                    htmlFor="sale-option"
                                                                                    className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer
                                                                                    border-muted-foreground/20 bg-background
                                                                                    peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                                                                                    hover:bg-muted/50 transition-all duration-200"
                                                                                >
                                                                                    <DollarSignIcon
                                                                                        className="h-6 w-6 mb-1 text-muted-foreground peer-data-[state=checked]:text-primary"/>
                                                                                    <span
                                                                                        className="font-medium">Продажа</span>
                                                                                </label>
                                                                            </div>
                                                                        </FormControl>
                                                                    </FormItem>
                                                                    <FormItem
                                                                        className="flex items-center space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <div className="relative w-full">
                                                                                <RadioGroupItem
                                                                                    value="RENT"
                                                                                    id="rent-option"
                                                                                    className="peer sr-only"
                                                                                />
                                                                                <label
                                                                                    htmlFor="rent-option"
                                                                                    className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer
                                                                                    border-muted-foreground/20 bg-background
                                                                                    peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                                                                                    hover:bg-muted/50 transition-all duration-200"
                                                                                >
                                                                                    <CalendarIcon
                                                                                        className="h-6 w-6 mb-1 text-muted-foreground peer-data-[state=checked]:text-primary"/>
                                                                                    <span
                                                                                        className="font-medium">Аренда</span>
                                                                                </label>
                                                                            </div>
                                                                        </FormControl>
                                                                    </FormItem>
                                                                </RadioGroup>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="property"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base">Тип
                                                                недвижимости</FormLabel>
                                                            <FormControl>
                                                                <RadioGroup
                                                                    onValueChange={field.onChange}
                                                                    value={field.value as string || undefined}
                                                                    className="grid grid-cols-3 gap-4"
                                                                >
                                                                    <FormItem
                                                                        className="flex items-center space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <div className="relative w-full">
                                                                                <RadioGroupItem
                                                                                    value="APARTMENT"
                                                                                    id="apartment-option"
                                                                                    className="peer sr-only"
                                                                                />
                                                                                <label
                                                                                    htmlFor="apartment-option"
                                                                                    className="flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer
                                                                                    border-muted-foreground/20 bg-background
                                                                                    peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                                                                                    hover:bg-muted/50 transition-all duration-200"
                                                                                >
                                                                                    <BuildingIcon
                                                                                        className="h-6 w-6 mb-1 text-muted-foreground peer-data-[state=checked]:text-primary"/>
                                                                                    <span
                                                                                        className="font-medium text-center">Квартира</span>
                                                                                </label>
                                                                            </div>
                                                                        </FormControl>
                                                                    </FormItem>
                                                                    <FormItem
                                                                        className="flex items-center space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <div className="relative w-full">
                                                                                <RadioGroupItem
                                                                                    value="HOUSE"
                                                                                    id="house-option"
                                                                                    className="peer sr-only"
                                                                                />
                                                                                <label
                                                                                    htmlFor="house-option"
                                                                                    className="flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer
                                                                                    border-muted-foreground/20 bg-background
                                                                                    peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                                                                                    hover:bg-muted/50 transition-all duration-200"
                                                                                >
                                                                                    <HomeIcon
                                                                                        className="h-6 w-6 mb-1 text-muted-foreground peer-data-[state=checked]:text-primary"/>
                                                                                    <span
                                                                                        className="font-medium">Дом</span>
                                                                                </label>
                                                                            </div>
                                                                        </FormControl>
                                                                    </FormItem>
                                                                    <FormItem
                                                                        className="flex items-center space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <div className="relative w-full">
                                                                                <RadioGroupItem
                                                                                    value="LAND_PLOT"
                                                                                    id="land-option"
                                                                                    className="peer sr-only"
                                                                                />
                                                                                <label
                                                                                    htmlFor="land-option"
                                                                                    className="flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer
                                                                                    border-muted-foreground/20 bg-background
                                                                                    peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                                                                                    hover:bg-muted/50 transition-all duration-200"
                                                                                >
                                                                                    <TreesIcon
                                                                                        className="h-6 w-6 mb-1 text-muted-foreground peer-data-[state=checked]:text-primary"/>
                                                                                    <span
                                                                                        className="font-medium text-center">Земельный участок</span>
                                                                                </label>
                                                                            </div>
                                                                        </FormControl>
                                                                    </FormItem>
                                                                </RadioGroup>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="md:col-span-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="description"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel className="text-base">Описание</FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder="Введите описание объекта недвижимости"
                                                                        {...field}
                                                                        value={field.value || ''}
                                                                        className="h-40 resize-none transition-all focus:ring-2 focus:ring-primary/20"
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Подробное описание поможет привлечь больше
                                                                    покупателей. Укажите особенности, преимущества и
                                                                    состояние объекта.
                                                                </FormDescription>
                                                                <FormMessage/>
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
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel className="text-base">Адрес</FormLabel>
                                                                <FormControl>
                                                                    <AddressInput
                                                                        onAddressSelect={(latitude, longitude, address) => {
                                                                            handleAddressSelect(latitude, longitude, address);
                                                                        }}
                                                                        address={field.value || ''}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Введите точный адрес для правильного отображения на
                                                                    карте
                                                                </FormDescription>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div
                                                    className="md:col-span-2 mt-4 rounded-xl overflow-hidden border border-muted">
                                                    <div className="h-96">
                                                        <MapWithMarker
                                                            onLocationSelect={handleLocationSelect}
                                                            initialCenter={
                                                                form.getValues('longitude') && form.getValues('latitude')
                                                                    ? [form.getValues('longitude'), form.getValues('latitude')]
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="city"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base">Город</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Город автоматически определится из адреса"
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="latitude"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel className="text-base">Широта</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Определится по карте"
                                                                        {...field}
                                                                        value={field.value || ''}
                                                                        className="transition-all bg-muted/30 focus:ring-2 focus:ring-primary/20 h-12"
                                                                        readOnly
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="longitude"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel className="text-base">Долгота</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Определится по карте"
                                                                        {...field}
                                                                        value={field.value || ''}
                                                                        className="transition-all bg-muted/30 focus:ring-2 focus:ring-primary/20 h-12"
                                                                        readOnly
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
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


                                                        <FormField
                                                            control={form.control}
                                                            name="apartment.numBedrooms"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <BedIcon className="h-4 w-4"/>
                                                                        Количество спален
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите количество спален"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="apartment.numBathrooms"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <BathIcon className="h-4 w-4"/>
                                                                        Количество ванных комнат
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите количество ванных комнат"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="apartment.floorNumber"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <LayersIcon className="h-4 w-4"/>
                                                                        Этаж
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите этаж"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="apartment.totalFloors"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <BuildingIcon className="h-4 w-4"/>
                                                                        Всего этажей в доме
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите общее количество этажей"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="apartment.apartmentArea"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <SquareIcon className="h-4 w-4"/>
                                                                        Площадь квартиры (кв.м)
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите площадь квартиры"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="apartment.buildingType"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-base">Тип
                                                                        здания</FormLabel>
                                                                    <FormControl>
                                                                        <Select
                                                                            onValueChange={field.onChange}
                                                                            value={field.value || undefined}
                                                                        >
                                                                            <SelectTrigger
                                                                                className="transition-all focus:ring-2 focus:ring-primary/20 h-12">
                                                                                <SelectValue
                                                                                    placeholder="Выберите тип здания"/>
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem
                                                                                    value="PANEL">Панельный</SelectItem>
                                                                                <SelectItem
                                                                                    value="BRICK">Кирпичный</SelectItem>
                                                                                <SelectItem
                                                                                    value="MONOLITH">Монолитный</SelectItem>
                                                                                <SelectItem
                                                                                    value="WOOD">Деревянный</SelectItem>
                                                                                <SelectItem
                                                                                    value="OTHER">Другой</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <div className="md:col-span-2 mt-4">
                                                            <Separator className="my-4"/>
                                                            <h3 className="text-base font-medium mb-4">Дополнительные
                                                                характеристики</h3>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="apartment.hasBalcony"
                                                                    render={({field}) => (
                                                                        <FormItem
                                                                            className="flex flex-col space-y-2 space-x-0">
                                                                            <div
                                                                                className="flex items-center space-x-2">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value || false}
                                                                                        onCheckedChange={field.onChange}
                                                                                        id="has-balcony"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                    className="cursor-pointer font-normal"
                                                                                    htmlFor="has-balcony">
                                                                                    Балкон
                                                                                </FormLabel>
                                                                            </div>
                                                                            <div className={`
                                                                                relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                                transition-opacity duration-300
                                                                                ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                            `}>
                                                                                <div
                                                                                    className="absolute inset-0 bg-primary"></div>
                                                                            </div>
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={form.control}
                                                                    name="apartment.hasLoggia"
                                                                    render={({field}) => (
                                                                        <FormItem
                                                                            className="flex flex-col space-y-2 space-x-0">
                                                                            <div
                                                                                className="flex items-center space-x-2">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value || false}
                                                                                        onCheckedChange={field.onChange}
                                                                                        id="has-loggia"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                    className="cursor-pointer font-normal"
                                                                                    htmlFor="has-loggia">
                                                                                    Лоджия
                                                                                </FormLabel>
                                                                            </div>
                                                                            <div className={`
                                                                                relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                                transition-opacity duration-300
                                                                                ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                            `}>
                                                                                <div
                                                                                    className="absolute inset-0 bg-primary"></div>
                                                                            </div>
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={form.control}
                                                                    name="apartment.hasWalkInCloset"
                                                                    render={({field}) => (
                                                                        <FormItem
                                                                            className="flex flex-col space-y-2 space-x-0">
                                                                            <div
                                                                                className="flex items-center space-x-2">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value || false}
                                                                                        onCheckedChange={field.onChange}
                                                                                        id="has-walkin"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                    className="cursor-pointer font-normal"
                                                                                    htmlFor="has-walkin">
                                                                                    Гардеробная
                                                                                </FormLabel>
                                                                            </div>
                                                                            <div className={`
                                                                                relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                                transition-opacity duration-300
                                                                                ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                            `}>
                                                                                <div
                                                                                    className="absolute inset-0 bg-primary"></div>
                                                                            </div>
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={form.control}
                                                                    name="apartment.furnished"
                                                                    render={({field}) => (
                                                                        <FormItem
                                                                            className="flex flex-col space-y-2 space-x-0">
                                                                            <div
                                                                                className="flex items-center space-x-2">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value || false}
                                                                                        onCheckedChange={field.onChange}
                                                                                        id="furnished"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                    className="cursor-pointer font-normal"
                                                                                    htmlFor="furnished">
                                                                                    Мебель
                                                                                </FormLabel>
                                                                            </div>
                                                                            <div className={`
                                                                                relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                                transition-opacity duration-300
                                                                                ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                            `}>
                                                                                <div
                                                                                    className="absolute inset-0 bg-primary"></div>
                                                                            </div>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Similar enhancements for house and land plot sections... */}
                                                {/* House Section */}
                                                {form.watch('property') === 'HOUSE' && (
                                                    <>


                                                        <FormField
                                                            control={form.control}
                                                            name="house.numberOfFloors"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <LayersIcon className="h-4 w-4"/>
                                                                        Количество этажей
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите количество этажей"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="house.numberOfRooms"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <HomeIcon className="h-4 w-4"/>
                                                                        Количество комнат
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите количество комнат"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="house.houseArea"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <SquareIcon className="h-4 w-4"/>
                                                                        Площадь дома (кв.м)
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите площадь дома"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="house.landArea"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <TreesIcon className="h-4 w-4"/>
                                                                        Площадь участка (сотки)
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите площадь участка"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <div className="md:col-span-2 mt-4">
                                                            <Separator className="my-4"/>
                                                            <h3 className="text-base font-medium mb-4">Дополнительные
                                                                характеристики</h3>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="house.hasGarage"
                                                                    render={({field}) => (
                                                                        <FormItem
                                                                            className="flex flex-col space-y-2 space-x-0">
                                                                            <div
                                                                                className="flex items-center space-x-2">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value || false}
                                                                                        onCheckedChange={field.onChange}
                                                                                        id="has-garage"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                    className="cursor-pointer font-normal"
                                                                                    htmlFor="has-garage">
                                                                                    Гараж
                                                                                </FormLabel>
                                                                            </div>
                                                                            <div className={`
                                                                                relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                                transition-opacity duration-300
                                                                                ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                            `}>
                                                                                <div
                                                                                    className="absolute inset-0 bg-primary"></div>
                                                                            </div>
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={form.control}
                                                                    name="house.hasBasement"
                                                                    render={({field}) => (
                                                                        <FormItem
                                                                            className="flex flex-col space-y-2 space-x-0">
                                                                            <div
                                                                                className="flex items-center space-x-2">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value || false}
                                                                                        onCheckedChange={field.onChange}
                                                                                        id="has-basement"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                    className="cursor-pointer font-normal"
                                                                                    htmlFor="has-basement">
                                                                                    Подвал
                                                                                </FormLabel>
                                                                            </div>
                                                                            <div className={`
                                                                                relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                                transition-opacity duration-300
                                                                                ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                            `}>
                                                                                <div
                                                                                    className="absolute inset-0 bg-primary"></div>
                                                                            </div>
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={form.control}
                                                                    name="house.fencing"
                                                                    render={({field}) => (
                                                                        <FormItem
                                                                            className="flex flex-col space-y-2 space-x-0">
                                                                            <div
                                                                                className="flex items-center space-x-2">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value || false}
                                                                                        onCheckedChange={field.onChange}
                                                                                        id="fencing"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                    className="cursor-pointer font-normal"
                                                                                    htmlFor="fencing">
                                                                                    Ограждение
                                                                                </FormLabel>
                                                                            </div>
                                                                            <div className={`
                                                                                relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                                transition-opacity duration-300
                                                                                ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                            `}>
                                                                                <div
                                                                                    className="absolute inset-0 bg-primary"></div>
                                                                            </div>
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={form.control}
                                                                    name="house.furnished"
                                                                    render={({field}) => (
                                                                        <FormItem
                                                                            className="flex flex-col space-y-2 space-x-0">
                                                                            <div
                                                                                className="flex items-center space-x-2">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value || false}
                                                                                        onCheckedChange={field.onChange}
                                                                                        id="house-furnished"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel
                                                                                    className="cursor-pointer font-normal"
                                                                                    htmlFor="house-furnished">
                                                                                    Мебель
                                                                                </FormLabel>
                                                                            </div>
                                                                            <div className={`
                                                                                relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                                transition-opacity duration-300
                                                                                ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                            `}>
                                                                                <div
                                                                                    className="absolute inset-0 bg-primary"></div>
                                                                            </div>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Land Plot Section */}
                                                {form.watch('property') === 'LAND_PLOT' && (
                                                    <>

                                                        <FormField
                                                            control={form.control}
                                                            name="landPlot.landArea"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel
                                                                        className="text-base flex items-center gap-2">
                                                                        <TreesIcon className="h-4 w-4"/>
                                                                        Площадь участка (сотки)
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="Введите площадь участка"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="landPlot.landPurpose"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-base">Назначение
                                                                        земли</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Введите назначение земли"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="landPlot.waterSource"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-base">Источник
                                                                        воды</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Введите источник воды"
                                                                            {...field}
                                                                            value={field.value || ''}
                                                                            className="transition-all focus:ring-2 focus:ring-primary/20 h-12"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="landPlot.fencing"
                                                            render={({field}) => (
                                                                <FormItem className="flex flex-col space-y-2 space-x-0">
                                                                    <div className="flex items-center space-x-2">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value || false}
                                                                                onCheckedChange={field.onChange}
                                                                                id="land-fencing"
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel
                                                                            className="cursor-pointer font-normal"
                                                                            htmlFor="land-fencing">
                                                                            Огороженная территория
                                                                        </FormLabel>
                                                                    </div>
                                                                    <div className={`
                                                                        relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                        transition-opacity duration-300
                                                                        ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                    `}>
                                                                        <div
                                                                            className="absolute inset-0 bg-primary"></div>
                                                                    </div>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {/* Photos Section */}
                                        {currentStep === 3 && (
                                            <div className="md:col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name="imageUrls"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base flex items-center gap-2">
                                                                <ImageIcon className="h-4 w-4"/>
                                                                Фотографии
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Загрузите до 5 качественных фотографий объекта
                                                                недвижимости. Хорошие фотографии привлекают больше
                                                                внимания.
                                                            </FormDescription>
                                                            <FormControl>
                                                                <div className="mt-2">
                                                                    <UploadImage
                                                                        onUploadComplete={handleImageUpload}
                                                                        initialImages={imageUrls}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />

                                                {imageUrls.length > 0 && (
                                                    <div className="mt-6">
                                                        <h3 className="text-base font-medium mb-3">Предпросмотр
                                                            загруженных фотографий</h3>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                            {imageUrls.map((url, index) => (
                                                                <div key={index}
                                                                     className="relative aspect-square rounded-lg overflow-hidden border border-muted group">
                                                                    <img
                                                                        src={url}
                                                                        alt={`Фото ${index + 1}`}
                                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                                    />
                                                                    <div
                                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <Badge
                                                                            className="bg-primary/90 text-white border-none">
                                                                            Фото {index + 1}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Deal Details Section */}
                                        {currentStep === 4 && (
                                            <>
                                                {form.watch('type') === 'RENT' && (
                                                    <>



                                                        <FormField
                                                            control={form.control}
                                                            name="rentalFeatures.rentalTerm"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-base">Срок
                                                                        аренды</FormLabel>
                                                                    <FormControl>
                                                                        <Select
                                                                            onValueChange={field.onChange}
                                                                            value={field.value || undefined}
                                                                        >
                                                                            <SelectTrigger
                                                                                className="transition-all focus:ring-2 focus:ring-primary/20 h-12">
                                                                                <SelectValue
                                                                                    placeholder="Выберите срок аренды"/>
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem
                                                                                    value="DAILY_PAYMENT">Ежедневно</SelectItem>
                                                                                <SelectItem
                                                                                    value="WEEKLY_PAYMENT">Еженедельно</SelectItem>
                                                                                <SelectItem
                                                                                    value="MONTHLY_PAYMENT">Ежемесячно</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="rentalFeatures.securityDeposit"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-base">Страховой
                                                                        депозит</FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <DollarSignIcon
                                                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
                                                                            <Input
                                                                                type="text"
                                                                                placeholder="Введите сумму депозита"
                                                                                {...field}
                                                                                value={field.value || ''}
                                                                                className="transition-all focus:ring-2 focus:ring-primary/20 pl-10 h-12"
                                                                            />
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="rentalFeatures.utilitiesPayment"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-base">Оплата коммунальных
                                                                        услуг</FormLabel>
                                                                    <FormControl>
                                                                        <Select
                                                                            onValueChange={field.onChange}
                                                                            value={field.value || undefined}
                                                                        >
                                                                            <SelectTrigger
                                                                                className="transition-all focus:ring-2 focus:ring-primary/20 h-12">
                                                                                <SelectValue
                                                                                    placeholder="Выберите вариант оплаты"/>
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="INCLUDED">Включено в
                                                                                    стоимость</SelectItem>
                                                                                <SelectItem value="EXCLUDED">Оплачивается
                                                                                    отдельно</SelectItem>
                                                                                <SelectItem value="PARTIALLY_INCLUDED">Частично
                                                                                    включено</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="rentalFeatures.petPolicy"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-base">Разрешение на
                                                                        животных</FormLabel>
                                                                    <FormControl>
                                                                        <Select
                                                                            onValueChange={field.onChange}
                                                                            value={field.value || undefined}
                                                                        >
                                                                            <SelectTrigger
                                                                                className="transition-all focus:ring-2 focus:ring-primary/20 h-12">
                                                                                <SelectValue
                                                                                    placeholder="Выберите политику"/>
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="NOT_ALLOWED">Не
                                                                                    разрешено</SelectItem>
                                                                                <SelectItem
                                                                                    value="ALLOWED">Разрешено</SelectItem>
                                                                                <SelectItem
                                                                                    value="ALLOWED_WITH_RESTRICTIONS">
                                                                                    Разрешено с ограничениями
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="rentalFeatures.availabilityDate"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-base">Дата
                                                                        доступности</FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <CalendarIcon
                                                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
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
                                                                                className="transition-all focus:ring-2 focus:ring-primary/20 pl-10 h-12"
                                                                            />
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage/>
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
                                                            render={({field}) => (
                                                                <FormItem className="flex flex-col space-y-2 space-x-0">
                                                                    <div className="flex items-center space-x-2">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value || false}
                                                                                onCheckedChange={field.onChange}
                                                                                id="mortgage-available"
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel
                                                                            className="cursor-pointer font-normal"
                                                                            htmlFor="mortgage-available">
                                                                            Ипотека доступна
                                                                        </FormLabel>
                                                                    </div>
                                                                    <div className={`
                                                                        relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                        transition-opacity duration-300
                                                                        ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                    `}>
                                                                        <div
                                                                            className="absolute inset-0 bg-primary"></div>
                                                                    </div>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="saleFeatures.priceNegotiable"
                                                            render={({field}) => (
                                                                <FormItem className="flex flex-col space-y-2 space-x-0">
                                                                    <div className="flex items-center space-x-2">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value || false}
                                                                                onCheckedChange={field.onChange}
                                                                                id="price-negotiable"
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel
                                                                            className="cursor-pointer font-normal"
                                                                            htmlFor="price-negotiable">
                                                                            Цена договорная
                                                                        </FormLabel>
                                                                    </div>
                                                                    <div className={`
                                                                        relative h-1 w-full bg-muted rounded-full overflow-hidden
                                                                        transition-opacity duration-300
                                                                        ${field.value ? 'opacity-100' : 'opacity-0'}
                                                                    `}>
                                                                        <div
                                                                            className="absolute inset-0 bg-primary"></div>
                                                                    </div>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="saleFeatures.availabilityDate"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-base">Дата
                                                                        доступности</FormLabel>
                                                                    <FormControl>
                                                                        <div className="relative">
                                                                            <CalendarIcon
                                                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
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
                                                                                className="transition-all focus:ring-2 focus:ring-primary/20 pl-10 h-12"
                                                                            />
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {/* Preview Section */}
                                        {currentStep === 5 && (
                                            <div className="md:col-span-2">
                                                <div className="space-y-6">
                                                    <div
                                                        className="flex items-center justify-between bg-muted/20 p-4 rounded-lg">
                                                        <h2 className="text-xl font-semibold">Предпросмотр
                                                            объявления</h2>
                                                        <Badge variant="outline"
                                                               className="px-3 py-1.5 flex items-center gap-1">
                                                            <CheckCircleIcon className="h-4 w-4"/>
                                                            Готово к публикации
                                                        </Badge>
                                                    </div>

                                                    {/* Preview Card */}
                                                    <Card className="overflow-hidden border-none shadow-lg">
                                                        {/* Image Gallery */}
                                                        <div className="relative">
                                                            {imageUrls.length > 0 ? (
                                                                <div
                                                                    className="aspect-video relative overflow-hidden bg-muted">
                                                                    <img
                                                                        src={imageUrls[0]}
                                                                        alt={form.getValues('title')}
                                                                        className="w-full h-full object-cover"
                                                                    />

                                                                    {/* Image count */}
                                                                    <div
                                                                        className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                                                        {imageUrls.length} фото
                                                                    </div>

                                                                    {/* Price tag */}
                                                                    <div
                                                                        className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full font-bold flex items-center text-lg shadow-md">
                                                                        {Number(form.getValues('price')).toLocaleString('ru-RU')} ₽
                                                                        {form.getValues('type') === 'RENT' &&
                                                                            <span className="ml-1 text-sm">/мес</span>}
                                                                    </div>

                                                                    {/* Property tag */}
                                                                    <div
                                                                        className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full text-sm font-medium shadow-md">
                                                                        {form.getValues('type') === 'SALE' ? '🏷️ Продажа' : '🔄 Аренда'}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="aspect-video bg-muted flex flex-col items-center justify-center">
                                                                    <ImageIcon
                                                                        className="h-12 w-12 text-muted-foreground mb-2"/>
                                                                    <p className="text-muted-foreground">Нет загруженных
                                                                        фотографий</p>
                                                                </div>
                                                            )}

                                                            {/* Thumbnail row */}
                                                            {imageUrls.length > 1 && (
                                                                <div
                                                                    className="flex overflow-x-auto gap-3 p-3 bg-muted/10 border-t scrollbar-hide">
                                                                    {imageUrls.map((url, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="w-20 h-20 rounded-md overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer transition-all flex-shrink-0"
                                                                        >
                                                                            <img
                                                                                src={url}
                                                                                alt={`Фото ${index + 1}`}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <CardContent className="p-6 space-y-6">
                                                            <div>
                                                                <h1 className="text-2xl font-bold">{form.getValues('title')}</h1>
                                                                <div
                                                                    className="flex items-center text-muted-foreground mt-1">
                                                                    <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0"/>
                                                                    <p className="truncate">{form.getValues('address')}</p>
                                                                </div>
                                                            </div>

                                                            {/* Feature Badges */}
                                                            <div className="flex flex-wrap gap-2">
                                                                {form.getValues('property') === 'APARTMENT' && (
                                                                    <>
                                                                        {form.getValues('apartment.numBedrooms') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <BedIcon className="h-4 w-4"/>
                                                                                {form.getValues('apartment.numBedrooms')} спален
                                                                            </Badge>
                                                                        )}
                                                                        {form.getValues('apartment.numBathrooms') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <BathIcon className="h-4 w-4"/>
                                                                                {form.getValues('apartment.numBathrooms')} ванных
                                                                            </Badge>
                                                                        )}
                                                                        {form.getValues('apartment.apartmentArea') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <SquareIcon className="h-4 w-4"/>
                                                                                {form.getValues('apartment.apartmentArea')} м²
                                                                            </Badge>
                                                                        )}
                                                                        {form.getValues('apartment.floorNumber') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <LayersIcon className="h-4 w-4"/>
                                                                                Этаж {form.getValues('apartment.floorNumber')}/{form.getValues('apartment.totalFloors') || '?'}
                                                                            </Badge>
                                                                        )}
                                                                    </>
                                                                )}

                                                                {form.getValues('property') === 'HOUSE' && (
                                                                    <>
                                                                        {form.getValues('house.numberOfRooms') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <HomeIcon className="h-4 w-4"/>
                                                                                {form.getValues('house.numberOfRooms')} комнат
                                                                            </Badge>
                                                                        )}
                                                                        {form.getValues('house.houseArea') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <SquareIcon className="h-4 w-4"/>
                                                                                {form.getValues('house.houseArea')} м²
                                                                            </Badge>
                                                                        )}
                                                                        {form.getValues('house.landArea') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <TreesIcon className="h-4 w-4"/>
                                                                                Участок: {form.getValues('house.landArea')} соток
                                                                            </Badge>
                                                                        )}
                                                                        {form.getValues('house.numberOfFloors') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <LayersIcon className="h-4 w-4"/>
                                                                                {form.getValues('house.numberOfFloors')} этажей
                                                                            </Badge>
                                                                        )}
                                                                    </>
                                                                )}

                                                                {form.getValues('property') === 'LAND_PLOT' && (
                                                                    <>
                                                                        {form.getValues('landPlot.landArea') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <TreesIcon className="h-4 w-4"/>
                                                                                {form.getValues('landPlot.landArea')} соток
                                                                            </Badge>
                                                                        )}
                                                                        {form.getValues('landPlot.landPurpose') && (
                                                                            <Badge variant="outline"
                                                                                   className="flex items-center gap-1 px-3 py-1.5">
                                                                                <TagIcon className="h-4 w-4"/>
                                                                                {form.getValues('landPlot.landPurpose')}
                                                                            </Badge>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>

                                                            {/* Description */}
                                                            <div className="bg-muted/10 p-4 rounded-lg">
                                                                <h3 className="font-medium mb-2 flex items-center gap-2">
                                                                    <span className="text-primary">Описание</span>
                                                                </h3>
                                                                <p className="text-muted-foreground">
                                                                    {form.getValues('description') || 'Описание отсутствует'}
                                                                </p>
                                                            </div>

                                                            {/* Additional Info */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                                {/* Deal Details */}
                                                                <Card className="bg-muted/10 border-none shadow-sm">
                                                                    <CardHeader className="pb-2">
                                                                        <CardTitle
                                                                            className="text-base flex items-center gap-2">
                                                                            <DollarSignIcon
                                                                                className="h-4 w-4 text-primary"/>
                                                                            Условия сделки
                                                                        </CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="pt-0">
                                                                        <ul className="space-y-2 text-sm">
                                                                            {form.getValues('type') === 'SALE' && (
                                                                                <>
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Ипотека:</span>
                                                                                        <span
                                                                                            className="font-medium">{form.getValues('saleFeatures.mortgageAvailable') ? 'Доступна' : 'Недоступна'}</span>
                                                                                    </li>
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Торг:</span>
                                                                                        <span
                                                                                            className="font-medium">{form.getValues('saleFeatures.priceNegotiable') ? 'Возможен' : 'Невозможен'}</span>
                                                                                    </li>
                                                                                </>
                                                                            )}

                                                                            {form.getValues('type') === 'RENT' && (
                                                                                <>
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Тип оплаты:</span>
                                                                                        <span className="font-medium">
                                                                                            {form.getValues('rentalFeatures.rentalTerm') === 'DAILY_PAYMENT' ? 'Ежедневно' :
                                                                                                form.getValues('rentalFeatures.rentalTerm') === 'WEEKLY_PAYMENT' ? 'Еженедельно' : 'Ежемесячно'}
                                                                                        </span>
                                                                                    </li>
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Страховой депозит:</span>
                                                                                        <span
                                                                                            className="font-medium">{form.getValues('rentalFeatures.securityDeposit') ? `${form.getValues('rentalFeatures.securityDeposit')} ₽` : 'Не требуется'}</span>
                                                                                    </li>
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Коммунальные услуги:</span>
                                                                                        <span className="font-medium">
                                                                                            {form.getValues('rentalFeatures.utilitiesPayment') === 'INCLUDED' ? 'Включены в стоимость' :
                                                                                                form.getValues('rentalFeatures.utilitiesPayment') === 'EXCLUDED' ? 'Оплачиваются отдельно' : 'Частично включены'}
                                                                                        </span>
                                                                                    </li>
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Животные:</span>
                                                                                        <span className="font-medium">
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
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 width="18" height="18"
                                                                                 viewBox="0 0 24 24" fill="none"
                                                                                 stroke="currentColor" strokeWidth="2"
                                                                                 strokeLinecap="round"
                                                                                 strokeLinejoin="round">
                                                                                <path
                                                                                    d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                                                <polyline
                                                                                    points="9 22 9 12 15 12 15 22"></polyline>
                                                                            </svg>
                                                                            Характеристики объекта
                                                                        </h3>
                                                                        <ul className="space-y-2 text-sm">
                                                                            {form.getValues('property') === 'APARTMENT' && (
                                                                                <>
                                                                                    {form.getValues('apartment.buildingType') && (
                                                                                        <li className="flex justify-between">
                                                                                            <span
                                                                                                className="text-muted-foreground">Тип здания:</span>
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
                                                                                            <span
                                                                                                className="text-muted-foreground">Год постройки:</span>
                                                                                            <span>{form.getValues('apartment.yearBuilt')}</span>
                                                                                        </li>
                                                                                    )}
                                                                                    {form.getValues('apartment.renovationState') && (
                                                                                        <li className="flex justify-between">
                                                                                            <span
                                                                                                className="text-muted-foreground">Ремонт:</span>
                                                                                            <span>
                                                                                            {form.getValues('apartment.renovationState') === 'NO_RENOVATION' ? 'Без ремонта' :
                                                                                                form.getValues('apartment.renovationState') === 'COSMETIC' ? 'Косметический' :
                                                                                                    form.getValues('apartment.renovationState') === 'EURO' ? 'Евроремонт' :
                                                                                                        form.getValues('apartment.renovationState') === 'DESIGNER' ? 'Дизайнерский' : 'Другое'}
                                                                                            </span>
                                                                                        </li>
                                                                                    )}
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Мебель:</span>
                                                                                        <span>{form.getValues('apartment.furnished') ? 'Есть' : 'Нет'}</span>
                                                                                    </li>
                                                                                </>
                                                                            )}

                                                                            {form.getValues('property') === 'HOUSE' && (
                                                                                <>
                                                                                    {form.getValues('house.wallMaterial') && (
                                                                                        <li className="flex justify-between">
                                                                                            <span
                                                                                                className="text-muted-foreground">Материал стен:</span>
                                                                                            <span>{form.getValues('house.wallMaterial')}</span>
                                                                                        </li>
                                                                                    )}
                                                                                    {form.getValues('house.yearBuilt') && (
                                                                                        <li className="flex justify-between">
                                                                                            <span
                                                                                                className="text-muted-foreground">Год постройки:</span>
                                                                                            <span>{form.getValues('house.yearBuilt')}</span>
                                                                                        </li>
                                                                                    )}
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Гараж:</span>
                                                                                        <span>{form.getValues('house.hasGarage') ? 'Есть' : 'Нет'}</span>
                                                                                    </li>
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Мебель:</span>
                                                                                        <span>{form.getValues('house.furnished') ? 'Есть' : 'Нет'}</span>
                                                                                    </li>
                                                                                </>
                                                                            )}

                                                                            {form.getValues('property') === 'LAND_PLOT' && (
                                                                                <>
                                                                                    {form.getValues('landPlot.waterSource') && (
                                                                                        <li className="flex justify-between">
                                                                                            <span
                                                                                                className="text-muted-foreground">Водоснабжение:</span>
                                                                                            <span>{form.getValues('landPlot.waterSource')}</span>
                                                                                        </li>
                                                                                    )}
                                                                                    <li className="flex justify-between">
                                                                                        <span
                                                                                            className="text-muted-foreground">Ограждение:</span>
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
                                                        </CardContent>
                                                    </Card>
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
                        </motion.div>
                    </AnimatePresence>
                </form>
            </Form>
        </div>
    );
};

export default CreateUpdateProperty;