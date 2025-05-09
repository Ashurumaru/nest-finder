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
    DollarSign,
    Bed
} from "lucide-react";
import { propertyTypes, roomCounts } from "@/constants/data";

// Валидация с Zod
const FilterSchema = z.object({
    location: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    rooms: z.string().optional(),
    propertyType: z.string().optional(),
});

interface PropertyFilterProps {
    propertyType: Type;
}

export default function PropertyFilter({ propertyType }: PropertyFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeFilters, setActiveFilters] = useState<number>(0);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

    const form = useForm<z.infer<typeof FilterSchema>>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            location: '',
            propertyType: '',
            minPrice: '',
            maxPrice: '',
            rooms: '',
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
            location: params.searchQuery || '',
            propertyType: params.propertyType || '',
            minPrice: params.minPrice || '',
            maxPrice: params.maxPrice || '',
            rooms: params.rooms === '5%2B' ? '5+' : params.rooms || '',
        });

        // Count active filters
        let count = 0;
        if (params.searchQuery) count++;
        if (params.propertyType) count++;
        if (params.minPrice || params.maxPrice) count++;
        if (params.rooms) count++;
        setActiveFilters(count);

    }, [searchParams, form]);

    const handlePriceChange = (values: number[]) => {
        setPriceRange([values[0], values[1]]);
        form.setValue('minPrice', values[0].toString());
        form.setValue('maxPrice', values[1].toString());
    };

    const onSubmit = (data: z.infer<typeof FilterSchema>) => {
        const queryParams: Record<string, string> = { type: propertyType };

        if (data.location) queryParams.searchQuery = data.location;
        if (data.propertyType) queryParams.propertyType = data.propertyType;
        if (data.minPrice) queryParams.minPrice = data.minPrice;
        if (data.maxPrice) queryParams.maxPrice = data.maxPrice;
        if (data.rooms) queryParams.rooms = data.rooms;

        const queryString = new URLSearchParams(queryParams).toString();
        router.push(`/properties?${queryString}`);
    };

    const resetFilters = () => {
        form.reset({
            location: '',
            propertyType: '',
            minPrice: '',
            maxPrice: '',
            rooms: '',
        });
        setPriceRange([0, 10000000]);
        router.push(`/properties?type=${propertyType}`);
    };

    return (
        <Card className="mb-8 bg-background shadow-sm border border-border/50 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">
                        Фильтры поиска {activeFilters > 0 && <Badge className="ml-2">{activeFilters}</Badge>}
                    </CardTitle>
                    {activeFilters > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Сбросить все
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Город, адрес, район..."
                                                className="pl-9 bg-background border-border/60 rounded-lg h-11"
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
                                            <SelectTrigger className="h-11 bg-background border-border/60 rounded-lg">
                                                <div className="flex items-center">
                                                    <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
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
                                name="rooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="h-11 bg-background border-border/60 rounded-lg">
                                                <div className="flex items-center">
                                                    <Bed className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Количество комнат" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roomCounts.map((option) => (
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

                        <Accordion type="single" collapsible className="mb-5">
                            <AccordionItem value="price" className="border-border/40">
                                <AccordionTrigger className="text-base font-medium py-3 hover:no-underline">
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
                                                        <FormLabel className="text-sm text-muted-foreground">Минимальная цена</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                className="bg-background border-border/60 rounded-lg"
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
                                                        <FormLabel className="text-sm text-muted-foreground">Максимальная цена</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                className="bg-background border-border/60 rounded-lg"
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
                        </Accordion>

                        <div className="flex justify-center mt-6">
                            <Button
                                type="submit"
                                size="lg"
                                className="rounded-lg font-medium px-8 transition-all duration-200"
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