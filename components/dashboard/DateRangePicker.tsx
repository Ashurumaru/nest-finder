'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

interface CalendarDateRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    date: DateRange | undefined;
    onChange: (range: DateRange | undefined) => void;
}

export const CalendarDateRangePicker = React.memo(
    ({
         className,
         date,
         onChange,
     }: CalendarDateRangePickerProps) => {
        const calendarRef = React.useRef<HTMLDivElement>(null);

        const handlePopoverOpen = React.useCallback(() => {
            setTimeout(() => {
                calendarRef.current?.focus();
            }, 0);
        }, []);

        const formattedDate = React.useMemo(() => {
            if (!date?.from) return <span>Выберите дату</span>;

            if (date.to) {
                return `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`;
            }

            return format(date.from, 'LLL dd, y');
        }, [date]);

        return (
            <div className={cn('grid gap-2', className)}>
                <Popover onOpenChange={(open) => open && handlePopoverOpen()}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={'outline'}
                            className={cn(
                                'w-[260px] justify-start text-left font-normal',
                                !date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formattedDate}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <div ref={calendarRef} tabIndex={-1}>
                            <Calendar
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={onChange}
                                numberOfMonths={2}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }
);

CalendarDateRangePicker.displayName = 'CalendarDateRangePicker';
