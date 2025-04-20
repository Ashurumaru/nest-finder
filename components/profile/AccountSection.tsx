'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchUserById, updateUser } from '@/services/propertyService';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User, Camera, Mail, Phone, Lock, User2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const profileSchema = z.object({
    name: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
    surname: z.string().min(2, { message: 'Фамилия должна содержать минимум 2 символа' }),
    email: z.string().email({ message: 'Введите корректный email адрес' }),
    phoneNumber: z.string().optional(),
    password: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountSection({ userId }: { userId: string }) {
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const { toast } = useToast();

    // Setup form with default values
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            phoneNumber: '',
            password: '',
        },
    });

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserDataFromService = async () => {
            if (!userId) {
                setError('User ID is missing');
                return;
            }

            try {
                setIsFetching(true);
                const userData = await fetchUserById(userId);

                // Set form values
                form.reset({
                    name: userData.name || '',
                    surname: userData.surname || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    password: '',
                });

                if (userData.image) {
                    setImage(userData.image);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
                setError(`Не удалось загрузить данные профиля: ${errorMessage}`);
            } finally {
                setIsFetching(false);
            }
        };

        fetchUserDataFromService();
    }, [userId, form]);

    // Handle form submission
    const onSubmit = async (values: ProfileFormValues) => {
        setLoading(true);
        setError('');
        setSaveSuccess(false);

        try {
            await updateUser(userId, {
                ...values,
                image
            });

            setSaveSuccess(true);
            toast({
                title: "Профиль обновлен",
                description: "Ваши данные были успешно сохранены",
                variant: "default",
            });

            // Reset success message after delay
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            setError('Не удалось обновить профиль');
            toast({
                title: "Ошибка",
                description: "Не удалось обновить профиль. Попробуйте позже.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Ошибка",
                    description: "Размер файла не должен превышать 5МБ",
                    variant: "destructive",
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    // Display loading indicator
    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="relative h-16 w-16">
                    <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-200 border-l-blue-200 animate-spin"></div>
                    <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-200 border-l-indigo-200 animate-spin animation-delay-150"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Card className="w-full border-none shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <motion.div variants={itemVariants}>
                            <CardTitle className="text-2xl font-bold text-slate-800">Обновить профиль</CardTitle>
                            <CardDescription>Измените личные данные и настройки аккаунта</CardDescription>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 px-3 py-1">
                                Профиль
                            </Badge>
                        </motion.div>
                    </div>
                </CardHeader>

                <CardContent>
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                <Alert variant="destructive" className="mb-6">
                                    <X className="h-4 w-4 mr-2" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        {saveSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                                    <Check className="h-4 w-4 mr-2 text-green-600" />
                                    <AlertDescription>Профиль успешно обновлен</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-slate-700">
                                                        <User className="h-4 w-4 mr-2 text-blue-500" />
                                                        Имя
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Введите имя"
                                                            {...field}
                                                            className="border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-500 text-xs font-medium" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="surname"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-slate-700">
                                                        <User2 className="h-4 w-4 mr-2 text-blue-500" />
                                                        Фамилия
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Введите фамилию"
                                                            {...field}
                                                            className="border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-500 text-xs font-medium" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center text-slate-700">
                                                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="example@domain.com"
                                                        {...field}
                                                        className="border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs font-medium" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center text-slate-700">
                                                    <Phone className="h-4 w-4 mr-2 text-blue-500" />
                                                    Телефон
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="+7 (999) 123-45-67"
                                                        {...field}
                                                        className="border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs font-medium" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center text-slate-700">
                                                    <Lock className="h-4 w-4 mr-2 text-blue-500" />
                                                    Пароль
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Оставьте пустым, чтобы не изменять"
                                                        {...field}
                                                        className="border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs font-medium" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 rounded-full border-2 border-t-blue-200 border-r-blue-200 border-b-blue-200 border-l-transparent animate-spin"></div>
                                                <span>Сохранение...</span>
                                            </div>
                                        ) : 'Сохранить изменения'}
                                    </Button>
                                </form>
                            </Form>
                        </motion.div>

                        <motion.div className="lg:col-span-1" variants={itemVariants}>
                            <Card className="border border-slate-100 shadow-sm overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 pb-4">
                                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                                        <Camera className="h-4 w-4 text-blue-500" />
                                        Изменить аватар
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center pt-6">
                                    <motion.div
                                        className="mb-6 relative group"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>

                                        <Avatar className="w-32 h-32 ring-4 ring-white ring-offset-2 ring-offset-slate-50 shadow-md">
                                            <AvatarImage src={image || undefined} alt="Profile avatar" />
                                            <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600">
                                                {form.watch('name')?.charAt(0) || '?'}{form.watch('surname')?.charAt(0) || ''}
                                            </AvatarFallback>
                                        </Avatar>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <label
                                                        htmlFor="avatar-upload"
                                                        className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                                                    >
                                                        <Camera className="h-4 w-4" />
                                                    </label>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-800 text-white">
                                                    <p>Загрузить новое фото</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </motion.div>

                                    <div className="text-sm text-slate-500 text-center p-4 bg-slate-50 rounded-lg">
                                        <p>Разрешены JPG, GIF или PNG. Макс. размер 5MB.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}