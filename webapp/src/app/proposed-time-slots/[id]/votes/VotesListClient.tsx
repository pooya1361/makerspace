//app/proposed-time-slots/[id]/votes/VotesListClient.tsx
'use client';

import { useAddVoteMutation, useGetProposedTimeSlotByIdQuery, useGetUsersQuery } from "@/app/lib/features/api/apiSlice";
import { useMemo, useState } from "react";
import VotePopup from "./VotePopup";

interface VotesListClientProps {
    proposedTimeSlotId: string
}
export default function VotesListClient({ proposedTimeSlotId }: VotesListClientProps) {
    const { data: proposedTimeSlot, isLoading, isError, error } = useGetProposedTimeSlotByIdQuery(proposedTimeSlotId);
    const { data: users } = useGetUsersQuery();

        const [addVote] = useAddVoteMutation();
    
    const votes = proposedTimeSlot?.votes

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleRegisterVote = async (userId: number) => {
        setIsPopupOpen(false)
        await addVote({
            proposedTimeSlotId: Number(proposedTimeSlotId),
            userId: userId
        })
    }
    
        const unvotedUsers = useMemo(() => {
            if (!votes) return
            const votedUser = votes?.map(v => v.user.id)
            return users?.filter(u => !votedUser.includes(u.id))
        }, [votes, users])

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 md:p-10 text-center text-gray-600">
                <p>Loading votes...</p>
            </div>
        );
    }

    if (isError) {
        console.error("Error fetching votes:", error);
        // You might want to render a specific error page or message
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold text-blue-800 mb-4">Votes for Proposed Time Slot ID: {proposedTimeSlotId}</h1>
                <p className="text-gray-600">No votes found for this time slot or an error occurred.</p>
            </div>
        );
    }

    if (!votes) {
        return (
            <div className="container mx-auto p-6 md:p-10 text-center text-gray-600">
                <p>No vote data found.</p>
            </div>
        );
    }

    return (
        <div className="">

            <div className="flex justify-between">
                <h2 className="text-2xl font-semiboldmb-3 text-gray-600">All Votes</h2>
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-3"
                >
                    ✚ Register a vote
                </button>
            </div>
            {
                votes && votes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">User</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">Email</th>
                                    {/* Add other vote-specific headers like 'Vote Date' if available */}
                                </tr>
                            </thead>
                            <tbody>
                                {votes.map(vote => (
                                    <tr key={vote.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{`${vote.user.firstName} ${vote.user.lastName}` || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{vote.user?.email}</td>
                                        {/* Add other vote data */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No votes recorded for this time slot yet.</p>
                )
            }

            <VotePopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSave={handleRegisterVote}
                users={unvotedUsers}
            />
        </div>

    )
}
