import moment from "moment"
import Link from "next/link"
import { ScheduledLessonResponseDTO } from "../interfaces/api"
import AdminOnly from "./AdminOnly"

type ScheduledLessonItemProps = {
    scheduledLesson: ScheduledLessonResponseDTO,
    availableLessonsMode?: boolean
}

export function ScheduledLessonItem({ scheduledLesson, availableLessonsMode }: ScheduledLessonItemProps) {
    return (
        <article
            key={scheduledLesson.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
        >
            <div className="p-6 flex flex-col justify-between h-full">
                <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                        {scheduledLesson.lesson.name}
                    </h2>
                    <p className="mb-2 text-gray-600 font-medium">
                        {scheduledLesson.lesson.activity.name} [{scheduledLesson.lesson.activity.workshop.name}]
                    </p>
                    <div className="space-y-2 mb-4">
                        <p className="text-gray-700 text-sm">
                            <span className="font-medium">Instructor:</span> {scheduledLesson.instructor.firstName} {scheduledLesson.instructor.lastName}
                        </p>
                        <p className="text-gray-700 text-sm">
                            <span className="font-medium">Duration:</span> {scheduledLesson.durationInMinutes} minutes
                        </p>
                        {scheduledLesson.startTime && (
                            <p className="text-gray-700 text-sm">
                                <span className="font-medium">Start time:</span>
                                <time dateTime={scheduledLesson.startTime instanceof Date ? scheduledLesson.startTime.toISOString() : scheduledLesson.startTime}>
                                    {moment(scheduledLesson.startTime).format('YYYY-MM-DD HH:mm')}
                                </time>
                            </p>
                        )}
                    </div>
                </div>
                <div className={'flex gap-3  items-center ' + (availableLessonsMode ? 'justify-end' : 'justify-between')}>
                    <Link
                        href={`/scheduled-lessons/${scheduledLesson.id}`}
                        className="inline-block bg-orange-700 text-white px-5 py-2 rounded-lg hover:bg-orange-800 transition duration-300 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        aria-describedby={`lesson-${scheduledLesson.id}-description`}
                    >
                        {availableLessonsMode ? "Vote here ..." : "View Details"}
                    </Link>
                    {!availableLessonsMode ?
                        <AdminOnly>
                            <Link
                                href={`/scheduled-lessons/${scheduledLesson.id}/edit`}
                                className="inline-flex items-center justify-center bg-gray-100 border-orange-600 border text-orange-700 px-3 py-2 rounded-lg hover:border-orange-700 transition duration-300 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                aria-label={`Edit lesson: ${scheduledLesson.lesson.name}`}
                            >
                                <span aria-hidden="true">📝</span>
                                <span className="sr-only">Edit</span>
                            </Link>
                        </AdminOnly>
                        : undefined
                    }
                </div>
                {/* Hidden description for screen readers */}
                <p id={`lesson-${scheduledLesson.id}-description`} className="sr-only">
                    {scheduledLesson.lesson.name} - {scheduledLesson.lesson.activity.name} lesson
                    with {scheduledLesson.instructor.firstName} {scheduledLesson.instructor.lastName}
                    {scheduledLesson.startTime && `, scheduled for ${moment(scheduledLesson.startTime).format('MMMM Do YYYY, h:mm A')}`}
                </p>
            </div>
        </article>
    )
}