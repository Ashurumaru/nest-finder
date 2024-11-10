'use client';

import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main CSS file
import 'react-date-range/dist/theme/default.css'; // theme CSS file

interface BookingCalendarProps {
    value: Range;
    onChange: (value: RangeKeyDict) => void;
    disabledDates?: Date[];
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
                                               value,
                                               onChange,
                                               disabledDates,
                                           }) => {
    return (
        <DateRange
            ranges={[value]}
            onChange={onChange}
            minDate={new Date()}
            disabledDates={disabledDates}
            rangeColors={['#262626']}
            direction="vertical"
            showDateDisplay={false}
        />
    );
};

export default BookingCalendar;
