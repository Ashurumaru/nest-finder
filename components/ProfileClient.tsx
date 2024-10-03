'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function ProfileClient({ user }: { user: any }) {
    const [selectedMenu, setSelectedMenu] = useState("account");
    const [currentUser, setCurrentUser] = useState(user); // Используем локальное состояние для хранения данных пользователя

    const handleSignOut = async () => {
        await signOut();
    };

    // Функция для обновления данных пользователя
    const updateUser = (updatedUser: any) => {
        setCurrentUser(updatedUser); // Обновляем локальное состояние с обновленными данными пользователя
    };

    const menuItems = [
        { key: "account", label: "Мой аккаунт", content: <AccountSection user={currentUser} updateUser={updateUser} /> },
        { key: "my-properties", label: "Моя недвижимость", content: currentUser?.id ? <MyPropertiesSection userId={currentUser.id} /> : <p>Пользователь не найден</p> },
        { key: "favorites", label: "Мое избранное", content: currentUser?.id ? <FavoritesSection userId={currentUser.id} /> : <p>Пользователь не найден</p> },
    ];

    return (
        <section className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto flex">
                <aside className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                    <div className="flex flex-col items-center mb-6">
                        <Image
                            src={currentUser?.image ? currentUser.image : "/images/default.png"}
                            alt={`profile photo of ${currentUser?.name}`}
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                        <p className="mt-4 text-gray-700 font-semibold">ID {currentUser?.id}</p>
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

                {/* Правая часть - контент */}
                <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-6">
                    {menuItems.find((item) => item.key === selectedMenu)?.content}
                </main>
            </div>
        </section>
    );
}

// Компонент для редактирования профиля пользователя
function AccountSection({ user, updateUser }: { user: any, updateUser: (updatedUser: any) => void }) {
    const [name, setName] = useState(user?.name || "");
    const [surname, setSurname] = useState(user?.surname || "");
    const [birthday, setBirthday] = useState(user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, surname, birthday }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const updatedUser = await response.json();
            updateUser(updatedUser); // Обновляем данные пользователя в локальном состоянии
            setMessage("Профиль успешно обновлен!");
        } catch (error) {
            setMessage("Ошибка при обновлении профиля.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Редактировать профиль</h2>
            {message && <p className={`mb-4 ${message.includes("успешно") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
            <form className="space-y-4" onSubmit={handleSave}>
                <div>
                    <label htmlFor="name" className="block text-gray-700">Имя</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="surname" className="block text-gray-700">Фамилия</label>
                    <input
                        type="text"
                        id="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="birthday" className="block text-gray-700">Дата рождения</label>
                    <input
                        type="date"
                        id="birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {loading ? "Сохранение..." : "Сохранить"}
                </button>
            </form>
        </div>
    );
}

// Компонент для вывода списка недвижимости пользователя
function MyPropertiesSection({ userId }: { userId: string }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Моя недвижимость</h2>
            {/* Здесь будет список недвижимости */}
            <p>Здесь будет список недвижимости, выложенной вами.</p>
        </div>
    );
}

// Компонент для вывода избранного
function FavoritesSection({ userId }: { userId: string }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Мое избранное</h2>
            {/* Здесь будет список избранных объектов */}
            <p>Здесь будет список недвижимости, добавленной в избранное.</p>
        </div>
    );
}
