// app/activities/add/page.tsx (new page for adding activities)
import LessonForm from '@/app/components/LessonForm'; // Assuming you moved it

export default function AddLessonPage() {
    return <LessonForm />; // No initialLesson prop means "add" mode
}