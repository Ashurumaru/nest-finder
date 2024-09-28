// components/NotFoundPage.tsx

import React from "react";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const NotFoundPage: React.FC = () => {
    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8">
                <FaExclamationTriangle className="text-yellow-500 text-6xl mb-4 mx-auto" />
                <h1 className="text-3xl font-bold mb-2">Страница не найдена</h1>
                <p className="text-gray-600 mb-6">
                    К сожалению, страница, которую вы ищете, не существует.
                </p>
                <Link href="/">
                    <Button variant="primary">Вернуться на главную</Button>
                </Link>
            </div>
        </section>
    );
};

export default NotFoundPage;
