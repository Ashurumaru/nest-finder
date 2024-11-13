// ReservationsSection.tsx

import React, { useState, useEffect } from 'react';
import { ReservationStatus } from "@prisma/client";
import { fetchReservations, updateReservationStatus } from '@/services/propertyService';
import { ReservationData } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ReservationsSectionProps {
    propertyId: string;
}

const ReservationsSection: React.FC<ReservationsSectionProps> = ({ propertyId }) => {
    const [reservations, setReservations] = useState<ReservationData[]>([]);
    const [filter, setFilter] = useState<ReservationStatus | 'ALL'>('ALL');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReservations = async () => {
            try {
                const data = await fetchReservations({ postId: propertyId, status: filter === 'ALL' ? undefined : filter });
                setReservations(data);
            } catch (err) {
                setError("Ошибка при загрузке бронирований");
            }
        };
        loadReservations();
    }, [propertyId, filter]);

    const handleStatusUpdate = async (reservationId: string, status: ReservationStatus) => {
        try {
            await updateReservationStatus(reservationId, status);
            setReservations((prev) =>
                prev.map((reservation) =>
                    reservation.id === reservationId ? { ...reservation, status } : reservation
                )
            );
        } catch {
            setError("Ошибка при обновлении статуса");
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Бронирования для недвижимости</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                        <Label className="font-medium">Фильтр по статусу:</Label>
                        <Select
                            value={filter}
                            onValueChange={(value) => setFilter(value as ReservationStatus | 'ALL')}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Все" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Все</SelectItem>
                                <SelectItem value="PENDING">В ожидании</SelectItem>
                                <SelectItem value="CONFIRMED">Подтверждено</SelectItem>
                                <SelectItem value="CANCELLED">Отменено</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <Separator />

                    {reservations.length === 0 && !error && (
                        <p className="text-center text-gray-500 mt-4">Нет бронирований для отображения</p>
                    )}

                    {reservations.map((reservation) => (
                        <div key={reservation.id} className="py-4 border-b last:border-none">
                            <p className="mb-1">
                                <strong>Клиент:</strong> {reservation.user?.name} ({reservation.user?.email})
                            </p>
                            <p className="mb-1">
                                <strong>Дата:</strong> {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                            </p>
                            <p className="mb-1">
                                <strong>Сумма:</strong> {reservation.totalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                            </p>
                            <Badge variant={reservation.status === 'CONFIRMED' ? 'success' : reservation.status === 'CANCELLED' ? 'destructive' : 'default'}>
                                {reservation.status}
                            </Badge>

                            {reservation.status === 'PENDING' && (
                                <div className="flex space-x-2 mt-4">
                                    <Button variant="success" onClick={() => handleStatusUpdate(reservation.id, 'CONFIRMED')}>
                                        Подтвердить
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleStatusUpdate(reservation.id, 'CANCELLED')}>
                                        Отклонить
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default ReservationsSection;
