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
    FormLabel,
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

// Property Types and Room Counts
const propertyTypes = [
    { label: "Квартиру в новостройке и вторичке", value: "new_and_secondary" },
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

// Validation schema using Zod
const FormSchema = z.object({
    propertyType: z.string({
        required_error: "Please select a property type.",
    }),
    rooms: z.string({
        required_error: "Please select the number of rooms.",
    }),
    priceFrom: z.string().optional(),
    priceTo: z.string().optional(),
    location: z.string().min(2, {
        message: "Please enter a valid location.",
    }),
});

export function PropertySearchForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            propertyType: "",
            rooms: "",
            priceFrom: "",
            priceTo: "",
            location: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("Submitted data", data);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 flex flex-col md:flex-row md:space-y-0 items-center justify-between w-full"
            >
                {/* Property Type Combobox */}
                <FormField
                    control={form.control}
                    name="propertyType"
                    render={({field}) => (
                        <FormItem className="flex flex-col w-1/4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between rounded-r-none"
                                        >
                                            {field.value
                                                ? propertyTypes.find(
                                                    (type) => type.value === field.value
                                                )?.label
                                                : "Квартиру в новостройке и вторичке"}
                                            <CaretSortIcon className="ml-2 h-4 w-4 opacity-50"/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[250px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Поиск..." className="h-9"/>
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
                        </FormItem>
                    )}
                />

                {/* Rooms Combobox */}
                <FormField
                    control={form.control}
                    name="rooms"
                    render={({field}) => (
                        <FormItem className="flex flex-col w-1/4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between rounded-none"
                                        >
                                            {field.value
                                                ? roomCounts.find((room) => room.value === field.value)
                                                    ?.label
                                                : "1 - 5 комн."}
                                            <CaretSortIcon className="ml-2 h-4 w-4 opacity-50"/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Поиск..." className="h-9"/>
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
                        </FormItem>
                    )}
                />

                {/* Price Inputs (От and До) */}
                <div className="flex w-1/4">
                    <FormField
                        control={form.control}
                        name="priceFrom"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormControl>
                                    <Input
                                        placeholder="от"
                                        {...field}
                                        className="rounded-none bg-white text-gray-900 border border-gray-300"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priceTo"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormControl>
                                    <Input
                                        placeholder="до"
                                        {...field}
                                        className="rounded-none bg-white text-gray-900 border border-gray-300"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Location Input */}
                <FormField
                    control={form.control}
                    name="location"
                    render={({field}) => (
                        <FormItem className="flex w-1/4">
                            <FormControl>
                                <Input
                                    placeholder="Город, адрес, метро, район, ж/д, шоссе или ЖК"
                                    {...field}
                                    className="rounded-l-none bg-white text-gray-900 border border-gray-300"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Action buttons */}
            </form>
            <div className="flex items-center space-x-2 mt-4">
                <Button variant="outline">Показать на карте</Button>
                <Button type="submit">Найти</Button>
            </div>
        </Form>
    );
}

export default PropertySearchForm;
