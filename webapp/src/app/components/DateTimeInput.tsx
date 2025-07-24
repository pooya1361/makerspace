import { format } from 'date-fns';
import React from 'react';

type DateTimeInputProps = {
    value: Date | undefined; // Expects a Date object (can be local or UTC, depends on your system)
    onChange: (newDate: Date) => void; // Emits a Date object (will be local time here)
};

export const DateTimeInput = (props: DateTimeInputProps) => {

    // Helper to format a Date object into 'YYYY-MM-DD' string for <input type="date">
    const formatDateForDateInput = (date: Date | undefined): string => {
        if (!date) return ''; // Return empty string for undefined date
        return format(date, 'yyyy-MM-dd'); // Use date-fns for consistent formatting
    };

    // Helper to format a Date object into 'HH:MM' string for <input type="time">
    const formatTimeForTimeInput = (date: Date | undefined): string => {
        if (!date) return ''; // Return empty string for undefined date
        return format(date, 'HH:mm'); // Use date-fns for consistent formatting
    };

    const formatTimeForInput = (date: Date) => {
        return date.toTimeString().split(' ')[0].substring(0, 5);
    };

    const formatDateForInput = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateString = e.target.value;
        if (!dateString) {
            props.onChange(new Date()); // Or handle setting to undefined if that's desired logic
            return;
        }

        // Get current time from props.value or default to 00:00 local time if no value
        const currentTime = props.value || new Date();
        const timeStr = formatTimeForInput(currentTime);
        const dateTimeStr = `${e.target.value}T${timeStr}`;
        const updatedDate = new Date(dateTimeStr);

        props.onChange(updatedDate); // Pass the new Date object back
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeString = e.target.value;
        if (!timeString) {
            props.onChange(new Date()); // Or handle setting to undefined
            return;
        }

        // Get current date from props.value or default to today's date
        const currentDate = props.value || new Date();
        const dateStr = formatDateForInput(currentDate);
        const dateTimeStr = `${dateStr}T${e.target.value}`;
        const updatedTime = new Date(dateTimeStr);

        props.onChange(updatedTime); // Pass the new Date object back
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
                <input
                    type="date"
                    value={formatDateForDateInput(props.value)}
                    onChange={handleDateChange}
                    className="px-3 py-2 border text-gray-700 rounded-md focus:outline-none focus:ring-2"
                />
                <input
                    type="time"
                    value={formatTimeForTimeInput(props.value)}
                    onChange={handleTimeChange}
                    className="px-3 py-2 border text-gray-700 rounded-md focus:outline-none focus:ring-2"
                />
            </div>
        </div>
    );
};