'use client';

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Type } from '@prisma/client';
import {
    Search,
    Home,
    Building2,
    Trees,
    DollarSign,
    Bed
} from "lucide-react";

// Валидация с Zod
const FilterSchema = z.object({
    searchQuery: z.string().optional(),
    propertyType: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minRooms: z.string().optional(),
    maxRooms: z.string().optional(),
    minArea: z.string().optional(),
    maxArea: z.string().optional(),
});

const propertyTypes = [
    { value: 'APARTMENT', label: 'Квартира' },
    { value: 'HOUSE', label: 'Дом' },
    { value: 'LAND_PLOT', label: 'Земельный участок' },
];

const roomOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5+' },
];

interface EnhancedPropertyFilterProps {
    propertyType: Type;
}

export default function EnhancedPropertyFilter({ propertyType }: EnhancedPropertyFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeFilters, setActiveFilters] = useState<number>(0);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

    const form = useForm<z.infer<typeof FilterSchema>>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            searchQuery: '',
            propertyType: '',
            minPrice: '',
            maxPrice: '',
            minRooms: '',
            maxRooms: '',
            minArea: '',
            maxArea: '',
        },
    });

    // Update form values from URL parameters
    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());

        // Set price range for slider
        const min = params.minPrice ? parseInt(params.minPrice) : 0;
        const max = params.maxPrice ? parseInt(params.maxPrice) : 10000000;
        setPriceRange([min, max]);

        form.reset({
            searchQuery: params.searchQuery || '',
            propertyType: params.propertyType || '',
            minPrice: params.minPrice || '',
            maxPrice: params.maxPrice || '',
            minRooms: params.minRooms || '',
            maxRooms: params.maxRooms || '',
            minArea: params.minArea || '',
            maxArea: params.maxArea || '',
        });

        // Count active filters
        let count = 0;
        if (params.searchQuery) count++;
        if (params.propertyType) count++;
        if (params.minPrice || params.maxPrice) count++;
        if (params.minRooms || params.maxRooms) count++;
        if (params.minArea || params.maxArea) count++;
        setActiveFilters(count);

    }, [searchParams, form]);

    const handlePriceChange = (values: number[]) => {
        setPriceRange([values[0], values[1]]);
        form.setValue('minPrice', values[0].toString());
        form.setValue('maxPrice', values[1].toString());
    };

    const onSubmit = (data: z.infer<typeof FilterSchema>) => {
        const queryParams: Record<string, string> = { type: propertyType };

        if (data.searchQuery) queryParams.searchQuery = data.searchQuery;
        if (data.propertyType) queryParams.propertyType = data.propertyType;
        if (data.minPrice) queryParams.minPrice = data.minPrice;
        if (data.maxPrice) queryParams.maxPrice = data.maxPrice;
        if (data.minRooms) queryParams.minRooms = data.minRooms;
        if (data.maxRooms) queryParams.maxRooms = data.maxRooms;
        if (data.minArea) queryParams.minArea = data.minArea;
        if (data.maxArea) queryParams.maxArea = data.maxArea;

        const queryString = new URLSearchParams(queryParams).toString();
        router.push(`/properties?${queryString}`);
    };

    const resetFilters = () => {
        form.reset({
            searchQuery: '',
            propertyType: '',
            minPrice: '',
            maxPrice: '',
            minRooms: '',
            maxRooms: '',
            minArea: '',
            maxArea: '',
        });
        setPriceRange([0, 10000000]);
        router.push(`/properties?type=${propertyType}`);
    };

    return (
        <Card className="mb-8 bg-white shadow-md">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-slate-800">
                        Фильтры поиска {activeFilters > 0 && <Badge className="ml-2 bg-blue-500">{activeFilters}</Badge>}
                    </CardTitle>
                    {activeFilters > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                            Сбросить все
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <FormField
                                control={form.control}
                                name="searchQuery"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Город, адрес, район..."
                                                className="pl-9 bg-white text-gray-900 border border-gray-200 rounded-md h-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="propertyType"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="h-10 bg-white border-gray-200">
                                                <div className="flex items-center">
                                                    <Building2 className="mr-2 h-4 w-4 text-gray-400" />
                                                    <SelectValue placeholder="Тип недвижимости" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {propertyTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="minRooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="h-10 bg-white border-gray-200">
                                                <div className="flex items-center">
                                                    <Bed className="mr-2 h-4 w-4 text-gray-400" />
                                                    <SelectValue placeholder="Мин. комнат" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roomOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxRooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="h-10 bg-white border-gray-200">
                                                <div className="flex items-center">
                                                    <Bed className="mr-2 h-4 w-4 text-gray-400" />
                                                    <SelectValue placeholder="Макс. комнат" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roomOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Accordion type="single" collapsible className="mb-4">
                            <AccordionItem value="price" className="border-b border-gray-200">
                                <AccordionTrigger className="text-md font-medium py-3">
                                    <div className="flex items-center">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Ценовой диапазон
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="py-2">
                                        <div className="mb-4">
                                            <Slider
                                                value={[priceRange[0], priceRange[1]]}
                                                onValueChange={handlePriceChange}
                                                min={0}
                                                max={10000000}
                                                step={10000}
                                                className="my-6"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="minPrice"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm text-gray-500">Минимальная цена</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                className="bg-white border-gray-200"
                                                                {...field}
                                                                value={priceRange[0]}
                                                                onChange={(e) => {
                                                                    const value = parseInt(e.target.value);
                                                                    if (!isNaN(value)) {
                                                                        setPriceRange([value, priceRange[1]]);
                                                                        field.onChange(e);
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="maxPrice"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm text-gray-500">Максимальная цена</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                className="bg-white border-gray-200"
                                                                {...field}
                                                                value={priceRange[1]}
                                                                onChange={(e) => {
                                                                    const value = parseInt(e.target.value);
                                                                    if (!isNaN(value)) {
                                                                        setPriceRange([priceRange[0], value]);
                                                                        field.onChange(e);
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="area" className="border-b border-gray-200">
                                <AccordionTrigger className="text-md font-medium py-3">
                                    <div className="flex items-center">
                                        <Home className="mr-2 h-4 w-4" />
                                        Площадь
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="py-2 grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="minArea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm text-gray-500">Мин. площадь (м²)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            className="bg-white border-gray-200"
                                                            {...field}
                                                            placeholder="От"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="maxArea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm text-gray-500">Макс. площадь (м²)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            className="bg-white border-gray-200"
                                                            {...field}
                                                            placeholder="До"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex justify-center mt-6">
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-md"
                            >
                                Применить фильтры
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}