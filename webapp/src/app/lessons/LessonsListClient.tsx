//app/lessons/LessonsListClient.tsx
'use client';
import Link from "next/link";
import { useSelector } from "react-redux";
import AdminOnly from "../components/AdminOnly";
import { apiSlice, useCreateLessonUserMutation, useDeleteLessonUserMutation } from "../lib/features/api/apiSlice";
import { selectCurrentUser } from "../lib/features/auth/authSlice";

export default function LessonsListClient() {
    const loggedInUser = useSelector(selectCurrentUser)
    const { data: lessons, isLoading, isError, error } = apiSlice.useGetLessonsQuery();
    const { data: userLessons } = apiSlice.useGetLessonsByUserIdQuery(
        loggedInUser!.id.toString(),
        {
            skip: !loggedInUser
        }
    )
    const [createLessonUser] = useCreateLessonUserMutation();
    const [deleteLessonUser] = useDeleteLessonUserMutation();


    if (isLoading) {
        return <p className="text-center text-xl text-gray-600">Loading lessons...</p>;
    }

    if (isError) {
        return (
            <div className="text-center text-red-600 text-xl">
                <p>Error loading lessons. Please try again later.</p>
                {process.env.NODE_ENV === 'development' && <pre className="mt-4 text-sm text-gray-700">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    if (!lessons || lessons.length === 0) {
        return <p className="text-center text-xl text-gray-600">No lessons available yet. Check back soon!</p>;
    }

    const userInterested = (lessonId: number) => (userLessons && userLessons?.findIndex(ul => ul.lesson.id === lessonId) > -1) || false

    const userHasCertificate = (lessonId: number) => (userLessons && userLessons?.find(ul => ul.lesson.id === lessonId)?.acquired) || false

    const handleRegisterLesson4User = (lessonId: number, interested: boolean) => {
        if (interested) {
            const lessonUserId = userLessons?.find(ul => ul.lesson.id == lessonId)?.id
            if (lessonUserId) {
                deleteLessonUser(lessonUserId.toString())
            }
        } else {
            createLessonUser({
                userId: loggedInUser!.id,
                lessonId: lessonId,
                acquired: false
            })
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
                <div key={lesson.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <div className="flex flex-col h-full p-6">
                        <div className="flex flex-col flex-1">
                            <h2 className="text-2xl font-semibold mb-2 text-gray-900">{lesson.name}</h2>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lesson.description}</p>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lesson.activity?.name}</p>
                        </div>
                        <div className='flex gap-3 justify-end'>
                            {!userHasCertificate(lesson.id) ?
                                <span
                                    title={userInterested(lesson.id) ? "Remove this lesson from your list" : "Apply for this course"}
                                    className="inline-block bg-gray-100 border-green-600 border hover:border-2 text-white px-2 py-2 rounded-lg transition duration-300 cursor-pointer"
                                    onClick={() => handleRegisterLesson4User(lesson.id, userInterested(lesson.id))}
                                >
                                    {!userInterested(lesson.id) ? "➕" : "✔️"}
                                </span>
                                :
                                <span
                                    title="You have finished this lesson"
                                    className="inline-block border text-white px-1 py-1 rounded-lg transition duration-300 text-2xl"
                                >🎓</span>
                            }

                            <AdminOnly>
                                <Link
                                    href={`/lessons/${lesson.id}/edit`}
                                    className="inline-block bg-gray-100 border-green-600 border hover:border-2 text-white px-2 py-2 rounded-lg transition duration-300"
                                >
                                    📝
                                </Link>
                            </AdminOnly>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}