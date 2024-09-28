"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

// Типы сделки, недвижимости и количества комнат
const transactionTypes = [
    { label: "Продажа", value: "sale" },
    { label: "Аренда", value: "rent" },
];

const propertyTypes = [
    { label: "Квартира", value: "apartment" },
    { label: "Дом", value: "house" },
    { label: "Коммерческая недвижимость", value: "commercial" },
    { label: "Участок", value: "land" },
];

const roomCounts = [
    { label: "1 комн.", value: "1" },
    { label: "2 комн.", value: "2" },
    { label: "3 комн.", value: "3" },
    { label: "4 комн.", value: "4" },
    { label: "5+ комн.", value: "5+" },
];

// Схема валидации с использованием Zod
const FormSchema = z.object({
    transactionType: z.string({
        required_error: "Пожалуйста, выберите тип сделки.",
    }),
    propertyType: z.string({
        required_error: "Пожалуйста, выберите тип недвижимости.",
    }),
    rooms: z.string({
        required_error: "Пожалуйста, выберите количество комнат.",
    }),
    priceFrom: z.string().optional(),
    priceTo: z.string().optional(),
    location: z.string().min(2, {
        message: "Пожалуйста, введите корректное местоположение.",
    }),
});

export function HomePropertySearchForm() {
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

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const {
            transactionType,
            propertyType,
            rooms,
            priceFrom,
            priceTo,
            location,
        } = data;

        const query: Record<string, string> = {};

        if (propertyType) {
            query["propertyType"] = propertyType;
        }
        if (rooms) {
            query["rooms"] = rooms;
        }
        if (priceFrom) {
            query["minPrice"] = priceFrom;
        }
        if (priceTo) {
            query["maxPrice"] = priceTo;
        }
        if (location) {
            query["searchQuery"] = location;
        }

        // Формируем строку запроса
        const queryString = new URLSearchParams(query).toString();

        // Перенаправляем на нужную страницу
        const path = transactionType === "sale" ? "/sale" : "/rent";
        router.push(`${path}?${queryString}`);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
            >
                {/* Поле выбора типа сделки */}
                <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {field.value
                                                ? transactionTypes.find(
                                                    (type) => type.value === field.value
                                                )?.label
                                                : "Тип сделки"}
                                            <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Поиск..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>Не найдено</CommandEmpty>
                                            <CommandGroup>
                                                {transactionTypes.map((type) => (
                                                    <CommandItem
                                                        key={type.value}
                                                        value={type.label}
                                                        onSelect={() => field.onChange(type.value)}
                                                    >
                                                        {type.label}
                                                        <CheckIcon
                                                            className={`ml-auto h-4 w-4 ${
                                                                field.value === type.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }`}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Поле выбора типа недвижимости */}
                <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {field.value
                                                ? propertyTypes.find(
                                                    (type) => type.value === field.value
                                                )?.label
                                                : "Тип недвижимости"}
                                            <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[250px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Поиск..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>Не найдено</CommandEmpty>
                                            <CommandGroup>
                                                {propertyTypes.map((type) => (
                                                    <CommandItem
                                                        key={type.value}
                                                        value={type.label}
                                                        onSelect={() => field.onChange(type.value)}
                                                    >
                                                        {type.label}
                                                        <CheckIcon
                                                            className={`ml-auto h-4 w-4 ${
                                                                field.value === type.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }`}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Поле выбора количества комнат */}
                <FormField
                    control={form.control}
                    name="rooms"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {field.value
                                                ? roomCounts.find((room) => room.value === field.value)
                                                    ?.label
                                                : "Количество комнат"}
                                            <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Поиск..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>Не найдено</CommandEmpty>
                                            <CommandGroup>
                                                {roomCounts.map((room) => (
                                                    <CommandItem
                                                        key={room.value}
                                                        value={room.label}
                                                        onSelect={() => field.onChange(room.value)}
                                                    >
                                                        {room.label}
                                                        <CheckIcon
                                                            className={`ml-auto h-4 w-4 ${
                                                                field.value === room.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }`}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Поля ввода цены от и до */}
                <FormField
                    control={form.control}
                    name="priceFrom"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                    placeholder="Цена от"
                                    {...field}
                                    className="rounded bg-white text-gray-900 border border-gray-300"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priceTo"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                    placeholder="Цена до"
                                    {...field}
                                    className="rounded bg-white text-gray-900 border border-gray-300"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Поле ввода местоположения */}
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                    placeholder="Город, адрес, район..."
                                    {...field}
                                    className="rounded bg-white text-gray-900 border border-gray-300"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Кнопки отправки */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center space-x-2 mt-4">
                    <Button variant="secondary">Показать на карте</Button>
                    <Button variant="primary">Найти</Button>
                </div>
            </form>
        </Form>
    );
}

export default HomePropertySearchForm;
