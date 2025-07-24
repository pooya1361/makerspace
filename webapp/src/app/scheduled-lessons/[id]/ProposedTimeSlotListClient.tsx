//app/scheduled-lessons/ProposedTimeSlotListClient.tsx
'use client';

import { ConfirmationPopup } from "@/app/components/ConfirmationPopup";
import { ProposedTimeSlotSummaryDTO } from "@/app/interfaces/api";
import { useAddProposedTimeSlotMutation, useDeleteProposedTimeSlotMutation, useGetScheduledLessonByIdQuery, useUpdateProposedTimeSlotMutation } from "@/app/lib/features/api/apiSlice";
import moment from "moment";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ProposedTimeSlotPopup from "./ProposedTimeSlotPopup";

interface ProposedTimeSlotListClientProps {
    scheduledLessonId: number; // The ID passed from the Server Component
}

export default function ProposedTimeSlotListClient({ scheduledLessonId }: ProposedTimeSlotListClientProps) {
    const { data: scheduledLesson, isLoading, isError, error } = useGetScheduledLessonByIdQuery(scheduledLessonId);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isEditDialogPopupOpen, setIsEditDialogPopupOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<ProposedTimeSlotSummaryDTO>();
    const [action, setAction] = useState<"ADD" | "UPDATE" | "DELETE" | undefined>();

    const [addProposedTimeSlot] = useAddProposedTimeSlotMutation();
    const [updateProposedTimeSlot] = useUpdateProposedTimeSlotMutation();
    const [deleteProposedTimeSlot] = useDeleteProposedTimeSlotMutation();

    const handleAddProposedSlot = () => {
        setSelectedSlot(undefined); // Clear any editing state
        setAction("ADD")
    };

    const handleEditProposedSlot = (selectedSlot: ProposedTimeSlotSummaryDTO) => {
        setSelectedSlot(selectedSlot);
        setAction("UPDATE")
    };

    const handleEditDialogPopupOpen = () => {
        setIsEditDialogPopupOpen(false)
        setIsPopupOpen(true)
    }

    const handleDeleteProposedSlot = (selectedSlot: ProposedTimeSlotSummaryDTO) => {
        setSelectedSlot(selectedSlot);
        setAction("DELETE")
    }

    const handleConfirmDeleteProposedSlot = useCallback(async () => {
        resetDialogs()
        await deleteProposedTimeSlot(selectedSlot!.id).unwrap()
    }, [selectedSlot, deleteProposedTimeSlot])

    const resetDialogs = () => {
        setSelectedSlot(undefined)
        setAction(undefined)
        setIsDeletePopupOpen(false)
        setIsPopupOpen(false)
        setIsEditDialogPopupOpen(false)
    }

    useEffect(() => {
        if (!!action) {
            if (!!selectedSlot) {
                console.log("🚀 ~ ProposedTimeSlotListClient ~ selectedSlot.votes:", selectedSlot.votes.length ?? 0)
                // action = UPDATE | DELETE
                switch (action) {
                    case "UPDATE":
                        if (selectedSlot.votes?.length ?? 0 > 0) {
                            setIsEditDialogPopupOpen(true);
                        } else {
                            setIsPopupOpen(true)
                        }
                        break;

                    case "DELETE":
                        if (selectedSlot.votes?.length ?? 0 > 0) {
                            setIsDeletePopupOpen(true);
                        } else {
                            handleConfirmDeleteProposedSlot();
                        }
                        break;

                    default:
                        break;
                }
            } else {
                // action = ADD
                setIsPopupOpen(true);
            }
        }
    }, [selectedSlot, action, handleConfirmDeleteProposedSlot]); // Crucial dependencies


    const handleSaveProposedTimeSlot = async (selectedDateTime: Date) => {
        if (!scheduledLessonId) {
            console.error("Scheduled Lesson ID is missing for saving proposed time slot.");
            alert("Error: Missing lesson ID.");
            return;
        }

        try {
            if (!selectedSlot?.id) {
                await addProposedTimeSlot({
                    scheduledLessonId: scheduledLessonId,
                    proposedStartTime: selectedDateTime
                }).unwrap();

                console.log('Proposed time slot added successfully!');
            } else {
                await updateProposedTimeSlot({
                    id: selectedSlot!.id,
                    scheduledLessonId: scheduledLessonId,
                    proposedStartTime: selectedDateTime
                }).unwrap();
            }
            resetDialogs()

        } catch (err) {
            console.error('Failed to add proposed time slot:', err);
            alert('Failed to add time slot. Please try again.');
        }

    };

    // --- Loading and Error States for Data Fetching ---
    if (isLoading) {
        return (
            <div className="container mx-auto p-6 md:p-10 text-center text-gray-600">
                <p>Loading proposed time slots...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-6 md:p-10 text-center text-red-600">
                <p>Error loading proposed time slots.</p>
                {/* Optionally display error details in development */}
                {process.env.NODE_ENV === 'development' && <pre className="mt-4 text-sm text-gray-700">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    // Ensure scheduledLesson data is available before rendering its properties
    if (!scheduledLesson) {
        return (
            <div className="container mx-auto p-6 md:p-10 text-center text-gray-600">
                <p>No scheduled lesson data found.</p>
            </div>
        );
    }

    return (
        <div className="">
            <div className="flex justify-between">
                <h2 className="text-2xl text-gray-700 font-semibold mb-3">Proposed Time Slots</h2>
                <button
                    onClick={handleAddProposedSlot}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 mb-3"
                >
                    ✚ Propose a Time Slot
                </button>
            </div>
            {scheduledLesson.proposedTimeSlots && scheduledLesson.proposedTimeSlots.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">Start Time</th>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">End Time</th>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">Votes</th>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600"></th>
                                {/* Add other ProposedTimeSlot headers */}
                            </tr>
                        </thead>
                        <tbody>
                            {scheduledLesson.proposedTimeSlots.map((slot: ProposedTimeSlotSummaryDTO) => {
                                // Create a new Date object for proposedStartTime to avoid modifying it
                                const startTime = slot.proposedStartTime ? new Date(slot.proposedStartTime) : null;
                                // Calculate endTime by adding durationInMinutes to a NEW Date object based on startTime
                                const endTime = startTime ? new Date(startTime.getTime() + scheduledLesson.durationInMinutes * 60 * 1000) : null;

                                return (
                                    <tr key={slot.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                                            {startTime ? moment(startTime).format('YYYY-MM-DD HH:mm') : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                                            {endTime ? moment(endTime).format('HH:mm') : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                                            <span className='flex align-middle'>{slot.votes?.length ?? 0}</span>
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800 text-end">
                                            <Link
                                                href={`/proposed-time-slots/${slot.id}/votes?scheduledLessonId=${scheduledLesson.id}`} // Link to the new votes page
                                                className="ml-2 text-blue-500 hover:underline"
                                            >
                                                <button className="rounded-md cursor-pointer p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                                                    🗳️
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleEditProposedSlot(slot)} // Pass the Date object
                                                className="rounded-md cursor-pointer p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                disabled={!startTime} // Disable if startTime is null
                                            >
                                                📝
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProposedSlot(slot)} // Pass the Date object
                                                className="rounded-md cursor-pointer p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                disabled={!startTime} // Disable if startTime is null
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No proposed time slots for this lesson.</p>
            )}

            <ProposedTimeSlotPopup
                isOpen={isPopupOpen}
                onClose={resetDialogs}
                onSave={handleSaveProposedTimeSlot}
                initialDateTime={selectedSlot?.proposedStartTime}
            />

            <ConfirmationPopup
                isOpen={isDeletePopupOpen}
                message="This time slot has already some votes. Are you sure you want to delete it?"
                onConfirm={handleConfirmDeleteProposedSlot}
                onCancel={resetDialogs}
            />

            <ConfirmationPopup
                isOpen={isEditDialogPopupOpen}
                message="This time slot has already some votes. Are you sure you want to edit it?"
                onConfirm={handleEditDialogPopupOpen}
                onCancel={resetDialogs}
            />
        </div>
    );
}