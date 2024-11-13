// LeasedPropertyCard.tsx

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PostData } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { updateReservationStatus } from '@/services/propertyService';
import {ReservationStatus} from "@prisma/client";

interface LeasedPropertyCardProps {
    property: PostData;
    onDelete: (id: string) => void;
}

type TimeFilter = 'ALL' | 'CURRENT' | 'PAST';

const LeasedPropertyCard: React.FC<LeasedPropertyCardProps> = ({ property, onDelete }) => {
    const [showReservations, setShowReservations] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'ALL'>('ALL');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
    const [error, setError] = useState<string | null>(null);

    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';
    const formattedPrice = property.price?.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) || 'Н/Д';

    const confirmDelete = () => {
        if (property.id) onDelete(property.id);
    };

    const handleStatusUpdate = async (reservationId: string, status: ReservationStatus) => {
        try {
            await updateReservationStatus(reservationId, status);
        } catch (err) {
            setError("Не удалось обновить статус бронирования.");
            console.error(err);
        }
    };

    const filteredReservations = property.reservations?.filter((reservation) => {
        const matchesStatus = filterStatus === 'ALL' || reservation.status === filterStatus;
        const now = new Date();

        let matchesTime = true;
        if (timeFilter === 'CURRENT') {
            matchesTime = new Date(reservation.endDate) >= now;
        } else if (timeFilter === 'PAST') {
            matchesTime = new Date(reservation.endDate) < now;
        }

        return matchesStatus && matchesTime;
    });

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row md:space-x-6">
            <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                <Image
                    src={imageSrc}
                    alt={property.title || 'Недвижимость'}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
                <div className="absolute top-4 left-4 bg-white text-blue-500 font-bold px-4 py-2 rounded-lg shadow-md">
                    {formattedPrice} / день
                </div>
            </div>

            <div className="w-full md:w-2/3 space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">{property.title}</h3>

                <div className="flex items-center text-gray-500 text-sm">
                    <FaMapMarkerAlt className="text-orange-600 mr-2" />
                    <span>{property.address}</span>
                </div>

                <div className="flex flex-wrap text-gray-600 space-x-6">
                    {property.apartment && (
                        <>
                            <p className="flex items-center"><FaBed className="text-green-500 mr-1" /> {property.apartment.numBedrooms} Спальни</p>
                            <p className="flex items-center"><FaBath className="text-blue-400 mr-1" /> {property.apartment.numBathrooms} Ванные</p>
                            <p className="flex items-center"><FaRulerCombined className="text-yellow-500 mr-1" /> {property.apartment.apartmentArea} кв.м</p>
                        </>
                    )}
                </div>

                <div className="bg-gray-50 rounded-md p-4 border text-sm text-gray-700 space-y-2">
                    {property.rentalFeatures?.availabilityDate && (
                        <p>Доступно с: <span className="font-medium">{new Date(property.rentalFeatures.availabilityDate).toLocaleDateString()}</span></p>
                    )}
                    {property.rentalFeatures?.securityDeposit && (
                        <p>Депозит: <span className="font-medium">{property.rentalFeatures.securityDeposit.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span></p>
                    )}
                </div>

                <div className="flex flex-wrap gap-4 items-center mt-4">
                    <Link href={`/properties/${property.id}`} passHref>
                        <Button variant="primary">Подробнее</Button>
                    </Link>

                    <Button asChild variant="secondary">
                        <Link href={`/properties/${property.id}/update`}><FaEdit className="mr-2" />Редактировать</Link>
                    </Button>

                    <Dialog open={showReservations} onOpenChange={setShowReservations}>
                        <DialogTrigger asChild>
                            <Button variant="info">Брони</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Список арендаторов</DialogTitle>
                            </DialogHeader>

                            {/* Filters for Status and Time */}
                            <div className="flex items-center mb-4 gap-4">
                                <div>
                                    <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-600">Фильтр по статусу:</label>
                                    <select
                                        id="status-filter"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value as ReservationStatus | 'ALL')}
                                        className="border border-gray-300 rounded-md p-2 text-sm"
                                    >
                                        <option value="ALL">Все</option>
                                        <option value="PENDING">В ожидании</option>
                                        <option value="CONFIRMED">Подтверждено</option>
                                        <option value="CANCELLED">Отменено</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="time-filter" className="mr-2 text-sm font-medium text-gray-600">Фильтр по дате:</label>
                                    <select
                                        id="time-filter"
                                        value={timeFilter}
                                        onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                                        className="border border-gray-300 rounded-md p-2 text-sm"
                                    >
                                        <option value="ALL">Все</option>
                                        <option value="CURRENT">Актуальные</option>
                                        <option value="PAST">Прошлые</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 overflow-y-auto max-h-80">
                                {filteredReservations?.length ? (
                                    filteredReservations.map((reservation) => (
                                        <div key={reservation.id} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                                            <p><strong>Клиент:</strong> {reservation.user?.name} ({reservation.user?.email})</p>
                                            <p><strong>Дата запроса:</strong> {new Date(reservation.createdAt || "").toLocaleDateString()}</p>
                                            <p><strong>Дата аренды:</strong> {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}</p>
                                            <p><strong>Сумма:</strong> {reservation.totalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</p>
                                            <p><strong>Статус:</strong> <span className={`font-semibold ${reservation.status === 'CONFIRMED' ? 'text-green-600' : reservation.status === 'CANCELLED' ? 'text-red-600' : 'text-yellow-600'}`}>{reservation.status}</span></p>
                                            <div className="flex space-x-2 mt-3">
                                                <Button variant="secondary">Связаться</Button>
                                                <Button variant="primary" onClick={() => handleStatusUpdate(reservation.id, 'CONFIRMED')}>Подтвердить</Button>
                                                <Button variant="destructive" onClick={() => handleStatusUpdate(reservation.id, 'CANCELLED')}>Отменить</Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Нет бронирований для отображения.</p>
                                )}
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <DialogFooter>
                                <Button onClick={() => setShowReservations(false)}>Закрыть</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><FaTrash className="mr-2" />Удалить</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
                                <AlertDialogDescription>Это действие нельзя отменить. Недвижимость будет удалена.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};

export default LeasedPropertyCard;
