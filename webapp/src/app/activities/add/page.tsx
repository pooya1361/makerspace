// app/activities/add/page.tsx (new page for adding activities)
import ActivityForm from '@/app/components/ActivityForm'; // Assuming you moved it

export default function AddActivityPage() {
    return <ActivityForm />; // No initialActivity prop means "add" mode
}