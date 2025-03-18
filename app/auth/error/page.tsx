'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// Компонент, использующий useSearchParams
function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const description = searchParams.get('description');

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка авторизации</h1>

                <div className="mb-4">
                    <p className="text-gray-700 mb-2"><strong>Тип ошибки:</strong> {error || 'Неизвестная ошибка'}</p>
                    {description && (
                        <p className="text-gray-700"><strong>Описание:</strong> {description}</p>
                    )}
                </div>

                <p className="text-gray-600 mb-6">
                    Произошла ошибка при попытке авторизации. Пожалуйста, попробуйте еще раз или используйте другой способ входа.
                </p>

                <div className="flex justify-center">
                    <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
                        Вернуться на страницу входа
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Основной компонент страницы
export default function AuthError() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <ErrorContent />
        </Suspense>
    );
}
