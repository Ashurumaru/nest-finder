"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {DropdownSelect} from "@/components/ui/DropdownSelect";
import {propertyTypes, roomCounts, transactionTypes} from "@/constants/data";

// Валидация с Zod
const FormSchema = z.object({
    transactionType: z.string().nonempty("Пожалуйста, выберите тип сделки."),
    propertyType: z.string().optional(),
    rooms: z.string().optional(),
    priceFrom: z.string().optional(),
    priceTo: z.string().optional(),
    location: z.string().optional(),
});

export default function PropertySearchForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            transactionType: "",
            propertyType: "",
            rooms: "",
            priceFrom: "",
            priceTo: "",
            location: "",
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const { transactionType, propertyType, rooms, priceFrom, priceTo, location } = data;

        const queryParams: Record<string, string> = {};

        if (propertyType) queryParams.propertyType = propertyType;
        if (rooms) queryParams.rooms = rooms;
        if (priceFrom) queryParams.minPrice = priceFrom;
        if (priceTo) queryParams.maxPrice = priceTo;
        if (location) queryParams.searchQuery = location;

        const queryString = new URLSearchParams(queryParams).toString();
        const path = transactionType === "SALE" ? "/sale" : "/rent";

        router.push(`${path}?${queryString}`);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
            >
                {/** Поле для типа сделки */}
                <FormField control={form.control} name="transactionType" render={({ field }) => (
                    <DropdownSelect field={field} options={transactionTypes} placeholder="Тип сделки" />
                )} />

                {/** Поле для типа недвижимости */}
                <FormField control={form.control} name="propertyType" render={({ field }) => (
                    <DropdownSelect field={field} options={propertyTypes} placeholder="Тип недвижимости" />
                )} />

                {/** Поле для количества комнат */}
                {/*<FormField control={form.control} name="rooms" render={({ field }) => (*/}
                {/*    <DropdownSelect field={field} options={roomCounts} placeholder="Количество комнат" />*/}
                {/*)} />*/}

                {/** Поля для ввода цен */}
                <FormField control={form.control} name="priceFrom" render={({ field }) => (
                    <InputField field={field} placeholder="Цена от" />
                )} />
                <FormField control={form.control} name="priceTo" render={({ field }) => (
                    <InputField field={field} placeholder="Цена до" />
                )} />

                {/** Поле для местоположения */}
                <FormField control={form.control} name="location" render={({ field }) => (
                    <InputField field={field} placeholder="Город, адрес, район..." />
                )} />

                {/** Кнопки */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center space-x-2 mt-4">
                    <Button variant="secondary">Показать на карте</Button>
                    <Button variant="primary" type="submit">Найти</Button>
                </div>
            </form>
        </Form>
    );
}


// Компонент для текстового поля
function InputField({ field, placeholder }: any) {
    return (
        <FormControl>
            <Input {...field} placeholder={placeholder} className="rounded bg-white text-gray-900 border border-gray-300" />
        </FormControl>
    );
}
