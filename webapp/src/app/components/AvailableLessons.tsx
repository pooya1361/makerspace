"use client"

import { apiSlice } from "../lib/features/api/apiSlice";
import { ScheduledLessonItem } from "./ScheduledLessonItem";

export default function AvailableLessons() {
    const { data: availableLessons } = apiSlice.useGetAvailableLessonsQuery()



    return (
        <>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md shadow-md w-full">
                <h2 className="text-2xl font-semibold mb-3">Available lessons for you</h2>
                {availableLessons && availableLessons.length > 0 ?
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {availableLessons.map((availableLesson, key) => (
                            <ScheduledLessonItem key={key} scheduledLesson={availableLesson} availableLessonsMode={true} />
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