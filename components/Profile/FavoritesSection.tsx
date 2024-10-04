'use client';

import { useEffect, useState } from 'react';
import { Property } from '@/types/propertyTypes';
import PropertyCardProfile from '@/components/PropertyCardProfile';

interface FavoritesSectionProps {
    userId: string;
}

export default function FavoritesSection({ userId }: FavoritesSectionProps) {
    const [favorites, setFavorites] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`/api/saved-properties?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке избранных постов');
                }
                const data = await response.json();
                setFavorites(data.map((savedPost: any) => savedPost.post)); // Извлекаем посты
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Неизвестная ошибка');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userId]);

    const handleRemoveFavorite = async (propertyId: string) => {
        console.log(`Удаление из избранного: ${propertyId}`);
    };

    if (loading) {
        return <p>Загрузка избранного...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (favorites.length === 0) {
        return <p>У вас нет избранных постов.</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Мое избранное</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((post) => (
                    <PropertyCardProfile  key={post.id} property={post}  isOwnProperty={false}  onDelete={handleRemoveFavorite}/>
                ))}
            </div>
        </div>
    );
}
