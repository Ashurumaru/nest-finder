'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import AccountSection from './AccountSection';
import MyPropertiesSection from './MyPropertiesSection';
import FavoritesSection from './FavoritesSection';

export default function ProfileClient({ user }: { user: any }) {
    const [selectedMenu, setSelectedMenu] = useState<string>("account");

    // Функция для переключения вкладок и обновления фрагмента URL
    const handleMenuSelect = (key: string) => {
        setSelectedMenu(key);
        window.location.hash = key;
    };

    // При загрузке компонента проверяем фрагмент URL
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && ["account", "my-properties", "favorites"].includes(hash)) {
            setSelectedMenu(hash);
        }
    }, []);

    const handleSignOut = async () => {
        await signOut();
    };

    const menuItems = [
        { key: "account", label: "Мой аккаунт", content: user?.id ? <AccountSection userId={user.id} /> : <p>Пользователь не найден</p> },
        { key: "my-properties", label: "Моя недвижимость", content: user?.id ? <MyPropertiesSection userId={user.id} /> : <p>Пользователь не найден</p> },
        { key: "favorites", label: "Мое избранное", content: user?.id ? <FavoritesSection userId={user.id} /> : <p>Пользователь не найден</p> },
    ];

    return (
        <section className="min-h-screen bg-gray-100 p-4 md:p-6">
            <div
                className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-start"> {/* Добавлено items-start для выравнивания */}
                {/* Сайдбар */}
                <aside className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
                    <div className="flex flex-col items-center mb-6">
                        <Image
                            src={user?.image ? user.image : "/images/default.png"}
                            alt={`profile photo of ${user?.name}`}
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                        <p className="mt-4 text-gray-700 font-semibold">ID {user?.id}</p>
                    </div>
                    <ul className="flex flex-col space-y-4">
                        {menuItems.map((item) => (
                            <li
                                key={item.key}
                                className={`cursor-pointer px-4 py-2 rounded-md text-center ${selectedMenu === item.key ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-gray-100 text-gray-600"}`}
                                onClick={() => handleMenuSelect(item.key)}
                            >
                                {item.label}
                            </li>
                        ))}
                        <li className="mt-8">
                            <button
                                onClick={handleSignOut}
                                className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-150 ease-in-out"
                            >
                                Выйти
                            </button>
                        </li>
                    </ul>
                </aside>

                {/* Основной контент */}
                <main className="w-full md:w-3/4 bg-white p-4 md:p-6 rounded-lg shadow-md flex-grow">
                    {menuItems.find((item) => item.key === selectedMenu)?.content}
                </main>
            </div>
        </section>
    );
}
