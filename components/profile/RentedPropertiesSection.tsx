'use client';

import { useEffect, useState } from 'react';
import { ReservationData } from '@/types/propertyTypes';
import RentedPropertyCard from "@/components/property/RentedPropertyCard";
import { fetchReservations } from "@/services/propertyService";

interface BookedPropertiesSectionProps {
    userId: string;
}

export default function BookedPropertiesSection({ userId }: BookedPropertiesSectionProps) {
    const [bookedProperties, setBookedProperties] = useState<ReservationData[]>([]);
    const [loadingBooked, setLoadingBooked] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookedProperties = async () => {
            try {
                setLoadingBooked(true);
                const data = await fetchReservations({ userId });
                setBookedProperties(data);
            } catch (err) {
                setError('Ошибка при загрузке забронированной недвижимости');
            } finally {
                setLoadingBooked(false);
            }
        };

        fetchBookedProperties();
    }, [userId]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Забронированная недвижимость</h2>
            {loadingBooked ? (
                <p>Загрузка забронированной недвижимости...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : bookedProperties.length === 0 ? (
                <p>У вас нет забронированной недвижимости.</p>
            ) : (
                <div className="space-y-4">
                    {bookedProperties.map((reservation) => (
                        <RentedPropertyCard
                            key={reservation.id}
                            reservation={reservation}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
