'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { Prisma } from '@prisma/client';

// Схема валидации для формы недвижимости
const formSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    price: z.number().min(1, { message: 'Price must be greater than 0' }),
    address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
    city: z.string().min(2, { message: 'City is required' }),
    description: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
    initialData: {
        title: string;
        price: number | Prisma.Decimal;
        address: string;
        city: string;
        description?: string | null;
        id?: string;
    } | null;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ initialData }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const title = useMemo(() => (initialData ? 'Edit Property' : 'Create Property'), [initialData]);
    const description = useMemo(() => (initialData ? 'Edit property details.' : 'Add a new property'), [initialData]);
    const toastMessage = useMemo(() => (initialData ? 'Property updated.' : 'Property created.'), [initialData]);
    const action = useMemo(() => (initialData ? 'Save changes' : 'Create'), [initialData]);

    // Преобразуем цену из Decimal в number, если это необходимо
    const defaultValues: PropertyFormValues = initialData
        ? {
            title: initialData.title,
            price: typeof initialData.price === 'object' && 'toNumber' in initialData.price
                ? (initialData.price as Prisma.Decimal).toNumber()
                : initialData.price,
            address: initialData.address,
            city: initialData.city,
            description: initialData.description || '',
        }
        : {
            title: '',
            price: 0,
            address: '',
            city: '',
            description: '',
        };

    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const onSubmit = async (data: PropertyFormValues) => {
        setLoading(true);
        try {
            if (initialData && initialData.id) {
                await fetch(`/api/properties/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            } else {
                await fetch(`/api/properties`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            }
            toast({
                title: 'Success',
                description: toastMessage,
            });
            router.push('/dashboard/property');
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred while saving the property.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className="gap-8 md:grid md:grid-cols-2">
                        {/* Поле для заголовка */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Property title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Поле для цены */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            type="number"
                                            placeholder="Property price"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Поле для адреса */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Property address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Поле для города */}
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="City"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Поле для описания */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Description (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Кнопка отправки */}
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};
