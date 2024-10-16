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

export function CalendarDateRangePicker({
                                            className,
                                            date,
                                            onChange,
                                        }: CalendarDateRangePickerProps) {
    const calendarRef = React.useRef<HTMLDivElement>(null);

    const handlePopoverOpen = () => {
        setTimeout(() => {
            calendarRef.current?.focus();
        }, 0);
    };

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
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Выберите дату</span>
                        )}
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
