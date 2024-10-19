'use client';

import { useEffect, useState } from 'react';
import { PostData } from '@/types/propertyTypes';
import ProfilePropertyCard from '@/components/property/ProfilePropertyCard';

interface FavoritesSectionProps {
    userId: string;
}

export default function FavoritesSection({ userId }: FavoritesSectionProps) {
    const [favorites, setFavorites] = useState<PostData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Запрос избранных постов при загрузке компонента
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`/api/saved-properties?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке избранных постов');
                }
                const data = await response.json();
                setFavorites(data.map((savedPost: any) => savedPost.post));
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

    // Логика для удаления поста из избранного
    const handleRemoveFavorite = async (propertyId: string) => {
        try {
            const response = await fetch(`/api/saved-properties/${propertyId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении из избранного');
            }

            // Обновляем список избранных постов после удаления
            setFavorites((prevFavorites) =>
                prevFavorites.filter((post) => post.id !== propertyId)
            );
        } catch (error) {
            console.error(`Ошибка при удалении поста ${propertyId} из избранного:`, error);
            setError('Не удалось удалить пост из избранного');
        }
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
            <div className="space-y-4">
                {favorites.map((post) => (
                    <ProfilePropertyCard
                        key={post.id}
                        property={post}
                        isOwnProperty={false}
                        onDelete={() => handleRemoveFavorite(post.id)}
                    />
                ))}
            </div>
        </div>
    );
}
