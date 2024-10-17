'use client';

import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8">
                <span className="bg-blue-400 bg-clip-text text-[10rem] font-extrabold leading-none text-transparent mb-4">
                    404
                </span>
                <h1 className="text-3xl font-bold mb-4">Страница не найдена</h1>
                <p className="text-gray-600 mb-6">
                    Извините, страница, которую вы ищете, не существует или была перемещена.
                </p>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => router.back()} variant="default" size="lg">
                        Вернуться назад
                    </Button>
                    <Link href="/">
                        <Button variant="outline" size="lg">
                            На главную
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
