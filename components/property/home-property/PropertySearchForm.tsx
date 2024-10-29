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
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

// Данные для типа сделки, недвижимости и количества комнат
const transactionTypes = [
    { label: "Продажа", value: "SALE" },
    { label: "Аренда", value: "RENT" },
];

const propertyTypes = [
    { label: "Квартира", value: "APARTMENT" },
    { label: "Дом", value: "HOUSE" },
    { label: "Участок", value: "LAND_PLOT" },
];

const roomCounts = [
    { label: "1 комн.", value: "1" },
    { label: "2 комн.", value: "2" },
    { label: "3 комн.", value: "3" },
    { label: "4 комн.", value: "4" },
    { label: "5+ комн.", value: "5+" },
];

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
                <FormField control={form.control} name="rooms" render={({ field }) => (
                    <DropdownSelect field={field} options={roomCounts} placeholder="Количество комнат" />
                )} />

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

// Компонент для выпадающего списка
function DropdownSelect({ field, options, placeholder }: any) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button variant="outline" className="w-full justify-between">
                        {field.value ? options.find((opt: any) => opt.value === field.value)?.label : placeholder}
                        <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {options.map((option: any) => (
                                <CommandItem key={option.value} onSelect={() => field.onChange(option.value)}>
                                    {option.label}
                                    <CheckIcon className={`ml-auto h-4 w-4 ${field.value === option.value ? "opacity-100" : "opacity-0"}`} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
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
