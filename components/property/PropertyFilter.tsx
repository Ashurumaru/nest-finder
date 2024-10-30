'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField } from '@/components/ui/form';
import { DropdownSelect } from '@/components/ui/DropdownSelect';
import { Type } from '@prisma/client';
import { useEffect } from "react";
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

    const form = useForm<z.infer<typeof FilterSchema>>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            location: '',
            minPrice: '',
            maxPrice: '',
            rooms: '',
            propertyType: '',
        },
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());

        form.reset({
            location: params.searchQuery || '',
            minPrice: params.minPrice || '',
            maxPrice: params.maxPrice || '',
            rooms: params.rooms === '5%2B' ? '5+' : params.rooms || '',
            propertyType: params.propertyType || '',
        });
    }, [searchParams, form]);

    const onSubmit = (data: z.infer<typeof FilterSchema>) => {
        const queryParams: Record<string, string> = {};

        if (data.location) queryParams.searchQuery = data.location;
        if (data.minPrice) queryParams.minPrice = data.minPrice;
        if (data.maxPrice) queryParams.maxPrice = data.maxPrice;
        if (data.rooms) queryParams.rooms = data.rooms;
        if (data.propertyType) queryParams.propertyType = data.propertyType;

        const queryString = new URLSearchParams(queryParams).toString();
        router.push(`/${propertyType.toLowerCase()}?${queryString}`);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <FormField control={form.control} name="location" render={({ field }) => (
                    <InputField field={field} placeholder="Город, адрес, район..." />
                )} />

                <FormField control={form.control} name="propertyType" render={({ field }) => (
                    <DropdownSelect field={field} options={propertyTypes} placeholder="Тип недвижимости" />
                )} />

                <FormField control={form.control} name="minPrice" render={({ field }) => (
                    <InputField field={field} placeholder="Минимальная цена" type="number" />
                )} />

                <FormField control={form.control} name="maxPrice" render={({ field }) => (
                    <InputField field={field} placeholder="Максимальная цена" type="number" />
                )} />

                {/*<FormField control={form.control} name="rooms" render={({ field }) => (*/}
                {/*    <DropdownSelect field={field} options={roomCounts} placeholder="Количество комнат" />*/}
                {/*)} />*/}



                <div className="col-span-1 md:col-span-2 flex items-center space-x-2 mt-4">
                    <Button variant="primary" type="submit">Применить фильтры</Button>
                </div>
            </form>
        </Form>
    );
}

// Компонент для текстового поля
function InputField({ field, placeholder, type = "text" }: any) {
    return (
        <FormControl>
            <Input {...field} placeholder={placeholder} type={type} className="rounded bg-white text-gray-900 border border-gray-300" />
        </FormControl>
    );
}
