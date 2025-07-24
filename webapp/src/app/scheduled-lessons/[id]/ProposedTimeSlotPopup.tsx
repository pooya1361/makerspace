// components/ProposedTimeSlotPopup.tsx
'use client'; // This component uses client-side interactivity

import { DateTimeInput } from '@/app/components/DateTimeInput';
import { useEffect, useRef, useState } from 'react';

interface ProposedTimeSlotPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedDateTime: Date) => void;
    initialDateTime?: Date; // Optional: for editing an existing slot
}

export default function ProposedTimeSlotPopup({
    isOpen,
    onClose,
    onSave,
    initialDateTime,
}: ProposedTimeSlotPopupProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDateTime);
    const modalRef = useRef<HTMLDivElement>(null);

    // Effect to handle initial date, e.g., when editing an existing slot
    useEffect(() => {
        setSelectedDate(initialDateTime);
    }, [initialDateTime, isOpen]); // Re-set when initialDateTime changes or popup opens

    // Close modal when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null; // Don't render anything if not open

    const handleSave = () => {
        if (selectedDate) {
            onSave(selectedDate);
            onClose(); // Close after saving
        } else {
            alert('Please select a date and time.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                ref={modalRef}
                className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {initialDateTime ? 'Edit Proposed Time Slot' : 'Create New Proposed Time Slot'}
                </h2>

                {/* DatePicker Component */}
                <div>
                    <label htmlFor="dateTime" className="block text-gray-700 text-sm font-semibold mb-2">
                        Select Date and Time:
                    </label>
                    <DateTimeInput
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
                    >
                        {initialDateTime ? 'Save Changes' : 'Add Time Slot'}
                    </button>
                </div>
            </div>
        </div>
    );
}