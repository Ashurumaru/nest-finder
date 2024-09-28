// components/Footer.tsx

import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                {/* Левая часть футера */}
                <div className="text-sm text-gray-600">
                    © {new Date().getFullYear()} Real Estate App. Все права защищены.
                </div>

                {/* Правая часть футера */}
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                        Политика конфиденциальности
                    </Link>
                    <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                        Условия использования
                    </Link>
                    <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                        Контакты
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
