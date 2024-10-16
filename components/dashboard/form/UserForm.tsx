'use client';
import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User } from '@/types/userTypes';
import { useToast } from '@/hooks/useToast';

// Схема валидации для пользователя
const formSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phoneNumber: z.string().optional(),
    role: z.enum(['user', 'admin'], { message: 'Please select a valid role' }),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
    initialData: User | null;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Мемоизация заголовков и текстов для формы
    const title = useMemo(
        () => (initialData ? 'Edit user' : 'Create user'),
        [initialData]
    );
    const description = useMemo(
        () => (initialData ? 'Edit user details.' : 'Add a new user'),
        [initialData]
    );
    const toastMessage = useMemo(
        () => (initialData ? 'User updated.' : 'User created.'),
        [initialData]
    );
    const action = useMemo(
        () => (initialData ? 'Save changes' : 'Create'),
        [initialData]
    );

    // Преобразуем null к undefined для корректной работы с react-hook-form
    const defaultValues: UserFormValues = initialData
        ? {
            name: initialData.name,
            email: initialData.email,
            phoneNumber: initialData.phoneNumber ?? undefined, // Преобразуем null в undefined
            role: initialData.role as 'user' | 'admin', // Преобразуем в нужный тип
        }
        : {
            name: '',
            email: '',
            phoneNumber: undefined,
            role: 'user',
        };

    const form = useForm<UserFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const onSubmit = async (data: UserFormValues) => {
        setLoading(true);
        try {
            if (initialData) {
                // Запрос на обновление данных пользователя
                // await axios.put(`/api/users/${initialData.id}`, data);
            } else {
                // Запрос на создание нового пользователя
                // await axios.post(`/api/users`, data);
            }
            router.refresh();
            router.push(`/dashboard/users`);
            toast({
                title: 'Success',
                description: toastMessage,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem with your request.',
            });
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        setLoading(true);
        try {
            // Запрос на удаление пользователя
            // await axios.delete(`/api/users/${params.userId}`);
            router.refresh();
            router.push(`/dashboard/users`);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'Could not delete user.',
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-8"
                >
                    <div className="gap-8 md:grid md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="User name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="User email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Phone number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a role"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};
