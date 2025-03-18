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

            signIn(undefined, { callbackUrl: "/" });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const input_style =
        "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="mb-6">
                <input
                    {...register("name")}
                    placeholder="Имя"
                    className={`${input_style}`}
                />
                {errors["name"] && (
                    <span className="text-red-500 text-xs pt-1 block">
                        {errors["name"]?.message as string}
                    </span>
                )}
            </div>
            <div className="mb-6">
                <input
                    type="email"
                    {...register("email")}
                    placeholder="Email"
                    className={`${input_style}`}
                />
                {errors["email"] && (
                    <span className="text-red-500 text-xs pt-1 block">
                        {errors["email"]?.message as string}
                    </span>
                )}
            </div>
            <div className="mb-6">
                <input
                    type="password"
                    {...register("password")}
                    placeholder="Пароль"
                    className={`${input_style}`}
                />
                {errors["password"] && (
                    <span className="text-red-500 text-xs pt-1 block">
                        {errors["password"]?.message as string}
                    </span>
                )}
            </div>
            <div className="mb-6">
                <input
                    type="password"
                    {...register("passwordConfirm")}
                    placeholder="Подтверждение пароля"
                    className={`${input_style}`}
                />
                {errors["passwordConfirm"] && (
                    <span className="text-red-500 text-xs pt-1 block">
                        {errors["passwordConfirm"]?.message as string}
                    </span>
                )}
            </div>

            <div className="mb-6 flex items-start">
                <div className="flex h-5 items-center">
                    <input
                        id="acceptTerms"
                        type="checkbox"
                        {...register("acceptTerms")}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="text-gray-700">
                        Я согласен с <Link href="/terms-of-use" className="text-blue-500 hover:underline">Условиями использования</Link> и <Link href="/privacy-policy" className="text-blue-500 hover:underline">Политикой конфиденциальности</Link>
                    </label>
                    {errors["acceptTerms"] && (
                        <p className="text-red-500 text-xs pt-1 block">
                            {errors["acceptTerms"]?.message as string}
                        </p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                style={{backgroundColor: `${submitting ? "#ccc" : "#3446eb"}`}}
                className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                disabled={submitting}
            >
                {submitting ? "loading..." : "Зарегистрироваться"}
            </button>
            <div className="flex justify-between items-center mt-6">
                <p className="text-sm mx-auto">
                    Уже есть аккаунт?{' '}
                    <Link href='/login' className="text-blue-500 hover:underline">
                        Войти
                    </Link>
                </p>
            </div>
        </form>
    );
}
