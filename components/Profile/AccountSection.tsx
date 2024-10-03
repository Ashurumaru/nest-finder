'use client';

import { useState } from "react";

export default function AccountSection({ user }: { user: any }) {
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
