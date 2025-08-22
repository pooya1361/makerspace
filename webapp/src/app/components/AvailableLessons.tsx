"use client"

import moment from "moment";
import Link from "next/link";
import { apiSlice } from "../lib/features/api/apiSlice";

export default function AvailableLessons() {
    const { data: availableLessons } = apiSlice.useGetAvailableLessonsQuery()



    return (
        <>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md shadow-md w-full">
                <h2 className="text-2xl font-semibold mb-3">Available lessons for you</h2>
                {availableLessons && availableLessons.length > 0 ?
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {availableLessons.map((availableLesson) => (
                            <div key={availableLesson.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300">
                                <div className="p-6 flex flex-col justify-between h-full">
                                    <div className="">
                                        <h2 className="text-2xl font-semibold mb-2 text-gray-900">{availableLesson.lesson.name}</h2>
                                        <h4 className="mb-2 text-gray-400">{availableLesson.lesson.activity.name} [{availableLesson.lesson.activity.workshop.name}]</h4>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">Instructor: {availableLesson.instructor.firstName} {availableLesson.instructor.lastName}</p>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{availableLesson.durationInMinutes} minutes</p>
                                    </div>
                                    <div className="flex flex-col mb-4 text-gray-600">
                                        {availableLesson.proposedTimeSlots.map((proposedTimeSlot) => (
                                            <span key={proposedTimeSlot.id}>
                                                {moment(proposedTimeSlot.proposedStartTime).format('YYYY-MM-DD HH:mm')}
                                            </span>
                                        ))}
                                    </div>
                                    <div className='flex gap-3 justify-end'>
                                        <Link
                                            href={`/scheduled-lessons/${availableLesson.id}`} // Link to a dynamic lesson detail page
                                            className="inline-block bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-ortext-orange-700 transition duration-300"
                                        >
                                            Vote here ...
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <div className="text-gray-600 p-3 md:p-8 text-center">
                        <p>
                            None of the lessons in your interested list has scheduled yet.
                        </p>
                        <p>
                            They&apos;ll show up here as soon as an instructor scheduled a new lesson.
                        </p>
                    </div>
                }
            </div>
        </>
    )

}