'use client';

import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import AccountSection from './AccountSection';
import MyPropertiesSection from './MyPropertiesSection';
import FavoritesSection from './FavoritesSection';

export default function ProfileClient({ user }: { user: any }) {
    const [selectedMenu, setSelectedMenu] = useState("account");

    const handleSignOut = async () => {
        await signOut();
    };

    const menuItems = [
        { key: "account", label: "Мой аккаунт", content: <AccountSection user={user} /> },
        { key: "my-properties", label: "Моя недвижимость", content: user?.id ? <MyPropertiesSection userId={user.id} /> : <p>Пользователь не найден</p> },
        { key: "favorites", label: "Мое избранное", content: user?.id ? <FavoritesSection userId={user.id} /> : <p>Пользователь не найден</p> },
    ];

    return (
        <section className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto flex">
                <aside className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                    <div className="flex flex-col items-center mb-6">
                        <Image
                            src={user?.image ? user.image : "/images/default.png"}
                            alt={`profile photo of ${user?.name}`}
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                        <p className="mt-4 text-gray-700 font-semibold">ID {user?.id}</p>
                    </div>
                    <ul className="flex flex-col space-y-4">
                        {menuItems.map((item) => (
                            <li
                                key={item.key}
                                className={`cursor-pointer px-4 py-2 rounded-md ${selectedMenu === item.key ? "bg-blue-100" : "hover:bg-gray-100"}`}
                                onClick={() => setSelectedMenu(item.key)}
                            >
                                {item.label}
                            </li>
                        ))}
                        <li className="mt-8">
                            <button
                                onClick={handleSignOut}
                                className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                            >
                                Выйти
                            </button>
                        </li>
                    </ul>
                </aside>

                <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-6">
                    {menuItems.find((item) => item.key === selectedMenu)?.content}
                </main>
            </div>
        </section>
    );
}
