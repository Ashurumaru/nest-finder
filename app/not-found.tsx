import React from 'react';
import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';
import {Button} from "@/components/ui/button";

const NotFoundPage: React.FC = () => {
    return (
        <section className="bg-blue-50 min-h-screen flex-grow">
            <div className="container m-auto max-w-2xl py-24">
                <div className="bg-white px-6 py-24 mb-4 shadow-md rounded-md border m-4 md:m-0">
                    <div className="flex justify-center">
                        <FaExclamationTriangle className="fa-5x text-8xl text-yellow-400" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mt-4 mb-2">Страница не найдена</h1>
                        <p className="text-gray-500 text-xl mb-10">
                            Страница, которую вы ищете, не существует.
                        </p>
                        <Link href='/'>
                            <Button variant='primary'>
                                Вернуться на главную
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex-grow" />
        </section>
    );
};

export default NotFoundPage;
