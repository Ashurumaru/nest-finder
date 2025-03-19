"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { CreateUserInput, createUserSchema } from "@/lib/user-schema";
import Link from "next/link";

export const RegisterForm = () => {
    const [submitting, setSubmitting] = useState(false);

    const methods = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema),
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = methods;

    const onSubmitHandler: SubmitHandler<CreateUserInput> = async (values) => {
        try {
            setSubmitting(true);
            const res = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorData = await res.json();

                if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                    errorData.errors.forEach((error: any) => {
                        toast.error(error.message);
                    });

                    return;
                }

                toast.error(errorData.message);
                return;
            }

            toast.success('Регистрация успешна');
            signIn(undefined, { callbackUrl: "/" });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle =
        'block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                    Имя
                </label>
                <input
                    id="name"
                    {...register("name")}
                    placeholder="Введите ваше имя"
                    className={inputStyle}
                />
                {errors["name"] && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors["name"]?.message as string}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Введите ваш email"
                    className={inputStyle}
                />
                {errors["email"] && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors["email"]?.message as string}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                    Пароль
                </label>
                <input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Создайте пароль"
                    className={inputStyle}
                />
                {errors["password"] && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors["password"]?.message as string}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="passwordConfirm" className="block mb-2 text-sm font-medium text-gray-700">
                    Подтверждение пароля
                </label>
                <input
                    id="passwordConfirm"
                    type="password"
                    {...register("passwordConfirm")}
                    placeholder="Повторите пароль"
                    className={inputStyle}
                />
                {errors["passwordConfirm"] && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors["passwordConfirm"]?.message as string}
                    </p>
                )}
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="acceptTerms"
                        type="checkbox"
                        {...register("acceptTerms")}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="text-gray-700">
                        Я согласен с <Link href="/terms-of-use" className="text-blue-600 hover:underline">Условиями использования</Link> и <Link href="/privacy-policy" className="text-blue-600 hover:underline">Политикой конфиденциальности</Link>
                    </label>
                    {errors["acceptTerms"] && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors["acceptTerms"]?.message as string}
                        </p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className={`w-full px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors duration-300 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'}`}
                disabled={submitting}
            >
                {submitting ? "Выполняется регистрация..." : "Зарегистрироваться"}
            </button>

            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Уже есть аккаунт?{' '}
                    <Link href='/login' className="text-blue-600 font-medium hover:underline">
                        Войти
                    </Link>
                </p>
            </div>
        </form>
    );
}