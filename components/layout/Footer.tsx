import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                <div className="text-sm text-gray-600">
                    © {new Date().getFullYear()} Nest Finder. Все права защищены.
                </div>

                <div className="flex space-x-4 mt-4 md:mt-0">
                    <Link
                        href="/privacy"
                        className="text-gray-600 hover:text-blue-600 transition-all ease-in-out duration-300"
                        aria-label="Privacy Policy"
                    >
                        Политика конфиденциальности
                    </Link>
                    <Link
                        href="/terms"
                        className="text-gray-600 hover:text-blue-600 transition-all ease-in-out duration-300"
                        aria-label="Terms of Use"
                    >
                        Условия использования
                    </Link>
                    <Link
                        href="/contact"
                        className="text-gray-600 hover:text-blue-600 transition-all ease-in-out duration-300"
                        aria-label="Contact Us"
                    >
                        Контакты
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
