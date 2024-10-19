'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image  from 'next/image';
export default function AccountSection({ userId }: { userId: string }) {
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    useEffect(() => {
        // Загружаем данные пользователя при монтировании компонента
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных пользователя');
                }
                const userData = await response.json();
                setName(userData.name);
                setSurname(userData.surname);
                setEmail(userData.email);
                setPhone(userData.phoneNumber); // Устанавливаем текущий номер телефона
                if (userData.image) {
                    setImage(userData.image); // Устанавливаем текущий аватар
                }
            } catch (err) {
                setError('Не удалось загрузить данные профиля');
            } finally {
                setIsFetching(false); // Отключаем состояние загрузки
            }
        };

        fetchUserData();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, surname, email, phoneNumber, password, image, userId }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении профиля');
            }

            setSuccess('Профиль успешно обновлён!');
        } catch (error) {
            setError('Не удалось обновить профиль');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string); // Конвертируем файл в base64
            };
            reader.readAsDataURL(file);
        }
    };

    if (isFetching) {
        return <p>Загрузка данных...</p>;
    }

    return (
        <div className="flex flex-col md:flex-row p-6">
            <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Обновить профиль</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <div>
                        <label htmlFor="name" className="block text-gray-700">Имя</label>
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="surname" className="block text-gray-700">Фамилия</label>
                        <Input
                            type="text"
                            id="surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-gray-700">Телефон</label>
                        <Input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+7 (999) 123-45-67"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700">Пароль (необязательно)</label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Оставьте пустым, чтобы не изменять"
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                    >
                        Сохранить
                    </Button>
                </form>
            </div>
            <div className="flex-1 mt-6 md:mt-0 md:ml-6">
                <h3 className="text-xl font-bold mb-4">Изменить аватар</h3>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-4"
                />
                {image && (
                    <Image
                        width={100}
                        height={100}
                        src={image}
                        alt="Avatar preview"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                )}
            </div>
        </div>
    );
}
