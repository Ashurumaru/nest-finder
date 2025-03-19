// components/auth/LoginForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { LoginUserInput, loginUserSchema } from '@/lib/user-schema';
import Link from "next/link";
import VkIdAuthButton from './VKIDWidget';

export const LoginForm = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/profile';

    const methods = useForm<LoginUserInput>({
        resolver: zodResolver(loginUserSchema),
    });

    const {
        reset,
        handleSubmit,
        register,
        formState: { errors },
    } = methods;

    const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
        try {
            setSubmitting(true);

            const res = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
                redirectTo: callbackUrl,
            });

            setSubmitting(false);

            if (!res?.error) {
                toast.success('Вход выполнен успешно');
                router.push(callbackUrl);
            } else {
                reset({ password: '' });
                const message = 'Неверный email или пароль';
                toast.error(message);
                setError(message);
            }
        } catch (error: any) {
            toast.error(error.message);
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle =
        'block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
            {error && (
                <div className='p-4 mb-4 text-sm text-white bg-red-500 rounded-lg' role="alert">
                    {error}
                </div>
            )}
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="email"
                    type='email'
                    {...register('email')}
                    placeholder='Введите ваш email'
                    className={inputStyle}
                />
                {errors['email'] && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors['email']?.message as string}
                    </p>
                )}
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                    Пароль
                </label>
                <input
                    id="password"
                    type='password'
                    {...register('password')}
                    placeholder='Введите ваш пароль'
                    className={inputStyle}
                />
                {errors['password'] && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors['password']?.message as string}
                    </p>
                )}
            </div>
            <button
                type='submit'
                className={`w-full px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors duration-300 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'}`}
                disabled={submitting}
            >
                {submitting ? 'Выполняется вход...' : 'Войти'}
            </button>

            <div className='relative flex items-center py-4'>
                <div className='flex-grow border-t border-gray-300'></div>
                <span className='flex-shrink mx-4 text-sm text-gray-500'>или</span>
                <div className='flex-grow border-t border-gray-300'></div>
            </div>

            <a
                className='flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-white bg-black rounded-lg transition-colors duration-300 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300'
                onClick={() => signIn('yandex', {callbackUrl})}
                role='button'
            >
                <Image
                    className='mr-2'
                    src='/images/yandex.svg'
                    alt='Яндекс'
                    width={24}
                    height={24}
                />
                Войти через Яндекс
            </a>
            <div className="mt-3">
                <VkIdAuthButton callbackUrl={callbackUrl} />
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
                Используя сервис, вы соглашаетесь с
                <Link href="/terms-of-use" className="ml-1 text-blue-600 hover:underline">
                    Условиями использования
                </Link> и
                <Link href="/privacy-policy" className="ml-1 text-blue-600 hover:underline">
                    Политикой конфиденциальности
                </Link>
            </div>

            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Нет аккаунта?{' '}
                    <Link href='/register' className="text-blue-600 font-medium hover:underline">
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </form>
    );
};