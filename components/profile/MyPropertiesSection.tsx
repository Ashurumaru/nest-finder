'use client';

import { useEffect, useState } from 'react';
import { PostData } from '@/types/propertyTypes';
import PropertyCardProfile from "@/components/PropertyCardProfile";

interface MyPropertiesSectionProps {
    userId: string;
}

export default function MyPropertiesSection({ userId }: MyPropertiesSectionProps) {
    const [properties, setProperties] = useState<PostData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(`/api/properties?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке недвижимости');
                }
                const data = await response.json();
                setProperties(data);
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

        fetchProperties();
    }, [userId]);

    const handleDeleteProperty = async (propertyId: string) => {
        console.log(`Удаление недвижимости с ID: ${propertyId}`);
    };

    if (loading) {
        return <p>Загрузка недвижимости...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (properties.length === 0) {
        return <p>У вас нет выложенной недвижимости.</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Моя недвижимость</h2>
            <div className="space-y-4">
                {properties.map((property) => (
                    <PropertyCardProfile  key={property.id} property={property} isOwnProperty={true} onDelete={handleDeleteProperty}/>
                ))}
            </div>
        </div>
    );
}
