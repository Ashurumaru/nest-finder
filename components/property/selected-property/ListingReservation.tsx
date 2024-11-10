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

    // Создаем массив заблокированных дат на основе существующих бронирований
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
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="flex flex-row items-center gap-1 p-4">
                <div className="text-2xl font-semibold">{price.toLocaleString()} ₽</div>
                <div className="font-light text-neutral-600">за ночь</div>
            </div>
            <hr />
            <BookingCalendar
                value={dateRange}
                disabledDates={disabledDates}
                onChange={(value) => setDateRange(value.selection)}
            />
            <hr />
            <div className="p-4">
                <Button disabled={isLoading} onClick={onCreateReservation}>
                    {isLoading ? 'Бронирование...' : 'Забронировать'}
                </Button>
            </div>
            <hr />
            <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
                <div>Итого</div>
                <div>{totalPrice.toLocaleString()} ₽</div>
            </div>
        </div>
    );
};

export default ListingReservation;
