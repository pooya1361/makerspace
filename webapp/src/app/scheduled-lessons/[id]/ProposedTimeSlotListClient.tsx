//app/scheduled-lessons/ProposedTimeSlotListClient.tsx
'use client';

import AdminOnly from "@/app/components/AdminOnly";
import { ConfirmationPopup } from "@/app/components/ConfirmationPopup";
import { ProposedTimeSlotSummaryDTO } from "@/app/interfaces/api";
import { useAddProposedTimeSlotMutation, useAddVoteMutation, useDeleteProposedTimeSlotMutation, useDeleteVoteMutation, useGetScheduledLessonByIdQuery, useUpdateProposedTimeSlotMutation, useUpdateScheduledLessonMutation } from "@/app/lib/features/api/apiSlice";
import { selectCurrentUser, selectIsAdmin } from "@/app/lib/features/auth/authSlice";
import { isEqual } from "date-fns";
import moment from "moment";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ProposedTimeSlotPopup from "./ProposedTimeSlotPopup";

interface ProposedTimeSlotListClientProps {
    scheduledLessonId: string; // The ID passed from the Server Component
}

export default function ProposedTimeSlotListClient({ scheduledLessonId }: ProposedTimeSlotListClientProps) {
    const { data: scheduledLesson, isLoading, isError, error } = useGetScheduledLessonByIdQuery(scheduledLessonId);
    const isAdmin = useSelector(selectIsAdmin);
    const loggedInUser = useSelector(selectCurrentUser);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isEditDialogPopupOpen, setIsEditDialogPopupOpen] = useState(false);
    const [isChoosePopupOpen, setIsChoosePopupOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<ProposedTimeSlotSummaryDTO>();
    const [action, setAction] = useState<"ADD" | "UPDATE" | "DELETE" | "CHOOSE" | undefined>();

    const [addProposedTimeSlot] = useAddProposedTimeSlotMutation();
    const [updateProposedTimeSlot] = useUpdateProposedTimeSlotMutation();
    const [deleteProposedTimeSlot] = useDeleteProposedTimeSlotMutation();
    const [updateScheduledLesson] = useUpdateScheduledLessonMutation()
    const [addVote] = useAddVoteMutation();
    const [deleteVote] = useDeleteVoteMutation();

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

    const handleChooseAsStartTime = async () => {
        await updateScheduledLesson({
            id: scheduledLesson!.id,
            startTime: selectedSlot!.proposedStartTime,
            durationInMinutes: scheduledLesson!.durationInMinutes,
            lessonId: scheduledLesson!.lesson.id,
            instructorUserId: scheduledLesson!.instructor.id
        })
        resetDialogs()
    }

    const handleDeleteProposedSlot = (selectedSlot: ProposedTimeSlotSummaryDTO) => {
        setSelectedSlot(selectedSlot);
        setAction("DELETE")
    }

    const handleChooseProposedSlot = (selectedSlot: ProposedTimeSlotSummaryDTO) => {
        setSelectedSlot(selectedSlot);
        setAction("CHOOSE")
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
        setIsChoosePopupOpen(false)
    }

    useEffect(() => {
        if (action) {
            if (selectedSlot) {
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

                    case "CHOOSE":
                        setIsChoosePopupOpen(true)
                        break

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
                    scheduledLessonId: Number(scheduledLessonId),
                    proposedStartTime: selectedDateTime
                }).unwrap();

                console.log('Proposed time slot added successfully!');
            } else {
                await updateProposedTimeSlot({
                    id: selectedSlot!.id,
                    scheduledLessonId: Number(scheduledLessonId),
                    proposedStartTime: selectedDateTime
                }).unwrap();
            }
            resetDialogs()

        } catch (err) {
            console.error('Failed to add proposed time slot:', err);
            alert('Failed to add time slot. Please try again.');
        }

    };


    const sortedProposedTimeSlots = useMemo(() => {
        if (!scheduledLesson?.proposedTimeSlots) {
            return [];
        }

        // Sort by Proposed start time in voting mode (when lesson doesn't have a start time and user is not admin)
        if (!scheduledLesson.startTime && !isAdmin) {
            return [...scheduledLesson.proposedTimeSlots].sort((a, b) => {
                const timeA = new Date(a.proposedStartTime).getTime();
                const timeB = new Date(b.proposedStartTime).getTime();
                return timeA - timeB;
            });
        }

        // Create a shallow copy before sorting to avoid mutating the original array
        return [...scheduledLesson.proposedTimeSlots].sort((a, b) => {
            const votesA = a.votes?.length ?? 0;
            const votesB = b.votes?.length ?? 0;
            return votesB - votesA; // Descending order (b - a)
        });
    }, [isAdmin, scheduledLesson?.proposedTimeSlots, scheduledLesson?.startTime]);

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


    const handleToggleVote = (slotId: number, checked: boolean): void => {
        if (checked) {
            const voteId = sortedProposedTimeSlots.find(pts => pts.id === slotId)?.votes.find(v => v.user.id === loggedInUser?.id)?.id
            deleteVote(voteId!)
        } else {
            addVote({
                userId: loggedInUser!.id,
                proposedTimeSlotId: slotId,
            })
        }
    }

    return (
        <div className="">
            <div className="flex justify-between">
                <h2 className="text-2xl text-gray-700 font-semibold mb-3">Proposed Time Slots</h2>
                <AdminOnly>
                    <button
                        onClick={handleAddProposedSlot}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 mb-3"
                    >
                        ✚ Propose a Time Slot
                    </button>
                </AdminOnly>
            </div>
            {sortedProposedTimeSlots.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                {scheduledLesson.startTime ?
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600 w-30">Selected time</th>
                                    : !isAdmin ?
                                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600 w-16">Select</th>
                                        : undefined

                                }
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">Start Time</th>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">End Time</th>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">Votes</th>
                                <AdminOnly>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600"></th>
                                </AdminOnly>
                                {/* Add other ProposedTimeSlot headers */}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProposedTimeSlots.map((slot: ProposedTimeSlotSummaryDTO) => {
                                // Create a new Date object for proposedStartTime to avoid modifying it
                                const startTime = slot.proposedStartTime ? new Date(slot.proposedStartTime) : null;
                                // Calculate endTime by adding durationInMinutes to a NEW Date object based on startTime
                                const endTime = startTime ? new Date(startTime.getTime() + scheduledLesson.durationInMinutes * 60 * 1000) : null;

                                return (
                                    <tr key={slot.id} className="hover:bg-gray-50">
                                        {scheduledLesson.startTime ?
                                            <td className="py-2 px-4 border-b text-sm text-gray-800 text-center">{
                                                isEqual(scheduledLesson.startTime, slot.proposedStartTime) ?
                                                    <span title="Chosen proposed start time">✅</span>
                                                    : undefined}
                                            </td>
                                            : !isAdmin ?
                                                <td className="py-2 px-4 border-b text-sm text-gray-800 text-center">
                                                    <input
                                                        className="cursor-pointer"
                                                        type="checkbox"
                                                        checked={slot.votes.findIndex(v => v.user.id === loggedInUser?.id) > -1}
                                                        onClick={() => handleToggleVote(slot.id, slot.votes.findIndex(v => v.user.id === loggedInUser?.id) > -1)} />
                                                </td>
                                                : undefined
                                        }
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                                            {startTime ? moment(startTime).format('YYYY-MM-DD HH:mm') : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                                            {endTime ? moment(endTime).format('HH:mm') : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                                            <span className='flex align-middle'>{slot.votes?.length ?? 0}</span>
                                        </td>
                                        <AdminOnly>
                                            <td className="py-2 px-4 border-b text-sm text-gray-800 text-end">
                                                <Link
                                                    href={`/proposed-time-slots/${slot.id}/votes?scheduledLessonId=${scheduledLesson.id}`} // Link to the new votes page
                                                    className="ml-2 text-blue-500 hover:underline mr-1"
                                                >
                                                    <button
                                                        className="rounded-md cursor-pointer p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        type="button"
                                                        title="See the votes"
                                                    >
                                                        🗳️
                                                    </button>
                                                </Link>
                                                {!scheduledLesson.startTime ?
                                                    <>
                                                        <button
                                                            onClick={() => handleEditProposedSlot(slot)} // Pass the Date object
                                                            className="rounded-md cursor-pointer p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-1"
                                                            disabled={!startTime} // Disable if startTime is null
                                                            title="Update"
                                                        >
                                                            📝
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProposedSlot(slot)} // Pass the Date object
                                                            className="rounded-md cursor-pointer p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-1"
                                                            disabled={!startTime}
                                                            title="Delete"
                                                        >
                                                            ❌
                                                        </button>
                                                        <button
                                                            onClick={() => handleChooseProposedSlot(slot)} // Pass the Date object
                                                            className="rounded-md cursor-pointer p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                            title="Choose as start time for this scheduled lesson"
                                                        >
                                                            ✅
                                                        </button>
                                                    </> : undefined
                                                }
                                            </td>
                                        </AdminOnly>
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

            <ConfirmationPopup
                isOpen={isChoosePopupOpen}
                message="Are you sure you want to choose this time slot as start time for the lesson?"
                onConfirm={handleChooseAsStartTime}
                onCancel={resetDialogs}
            />
        </div>
    );
}