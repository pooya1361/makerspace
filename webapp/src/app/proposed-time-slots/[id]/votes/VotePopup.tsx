// components/ProposedTimeSlotPopup.tsx
'use client'; // This component uses client-side interactivity

import { UserSummaryDTO } from '@/app/interfaces/api';
import { useEffect, useRef, useState } from 'react';

interface ProposedTimeSlotPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userId: number) => void;
    users: UserSummaryDTO[] | undefined
}

export default function ProposedTimeSlotPopup({
    isOpen,
    onClose,
    onSave,
    users
}: ProposedTimeSlotPopupProps) {
    const [userId, setUserId] = useState<number>();
    const modalRef = useRef<HTMLDivElement>(null);

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
        if (userId) {
            onSave(userId);
            onClose(); // Close after saving
        } else {
            alert('Please select a user.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                ref={modalRef}
                className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Register a vote
                </h2>

                {/* DatePicker Component */}
                <div>
                    {users && users.length > 0 ? ( // Check for users existence and length
                        <>
                            <label htmlFor="dateTime" className="block text-gray-700 text-sm font-semibold mb-2">
                                Select a user:
                            </label>

                            <select
                                id="users"
                                onChange={(e) => setUserId(Number(e.target.value))}
                                className="border text-gray-700 text-sm rounded-lg block w-full p-2.5"
                                value={userId ?? ''} // Use empty string for null/undefined to select default option
                            >
                                <option value={-1}>-- Select an user --</option> {/* Added a placeholder option */}
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                        </>
                    ) : (
                        <span className="ml-2 text-gray-700">No user found or all users are already registered.</span>
                    )}
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
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}