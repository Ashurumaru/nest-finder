'use client';

import { Range } from 'react-date-range';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInCalendarDays, startOfDay, endOfDay } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import BookingCalendar from "@/components/ui/booking-calendar";
import { createReservation } from '@/services/propertyService';

interface ListingReservationProps {
    price: number;
    postId: string;
    reservations: Array<{ startDate: string; endDate: string }>;
}

const initialDateRange: Range = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
};

const ListingReservation: React.FC<ListingReservationProps> = ({ price, postId, reservations = [] }) => {
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const [totalPrice, setTotalPrice] = useState(price);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const disabledDates = reservations.flatMap((reservation) => {
        const start = startOfDay(new Date(reservation.startDate));
        const end = endOfDay(new Date(reservation.endDate));
        const dates = [];
        for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date));
        }
        return dates;
    });

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);
            setTotalPrice(price * (dayCount > 0 ? dayCount : 1));
        }
    }, [dateRange, price]);

    const onCreateReservation = async () => {
        setIsLoading(true);
        try {
            const isDateOverlap = disabledDates.some(date =>
                date >= dateRange.startDate! && date <= dateRange.endDate!
            );

            if (isDateOverlap) {
                toast.error('Выбранные даты заняты.');
                return;
            }

            await createReservation({
                startDate: dateRange.startDate!,
                endDate: dateRange.endDate!,
                totalPrice,
                postId,
            });
            toast.success('Бронирование успешно!');
            router.refresh();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка при бронировании.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg border border-neutral-300 overflow-hidden">
            <div className="flex flex-row items-center gap-2 p-6 bg-gray-50">
                <div className="text-3xl font-bold text-primary-600">{price.toLocaleString()} ₽</div>
                <span className="text-sm font-medium text-gray-600 ml-1">за ночь</span>
            </div>
            <hr />
            <div className="p-6">
                <BookingCalendar
                    value={dateRange}
                    disabledDates={disabledDates}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
            <hr />
            <div className="p-6 flex flex-col gap-4">
                <Button
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out font-semibold shadow-md"
                    disabled={isLoading}
                    onClick={onCreateReservation}
                >
                    {isLoading ? 'Бронирование...' : 'Забронировать'}
                </Button>
                <hr />
                <div className="flex flex-row items-center justify-between text-lg font-semibold">
                    <span>Итого</span>
                    <span className="text-primary-600">{totalPrice.toLocaleString()} ₽</span>
                </div>
            </div>
        </div>
    );
};

export default ListingReservation;
