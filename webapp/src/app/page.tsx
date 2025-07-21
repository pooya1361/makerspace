import { apiSlice } from "./lib/features/api/apiSlice"
import { store } from "./lib/store"

type User = {
  id: number
  username: string
  email: string
  userType: string
}

async function getUsers() {
  // You can use a direct fetch call here
  const res = await fetch('http://localhost:8080/api/users'); // Disable cache for dev

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}

export default async function Home() {
    // Fetch summary data using RTK Query on the server
    const { data: summary, isError: summaryError, error: summaryErrorDetails } = await store.dispatch(
        apiSlice.endpoints.getOverallSummary.initiate(undefined)
    );

    if (summaryError) {
        console.error("Error fetching summary:", summaryErrorDetails);
        // You might want to display a partial error or just gracefully handle no summary data
    }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-[32px] row-start-2 sm:items-start">
        {/* Display Summary Section */}
        {summary && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mb-8 shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-3">Overall Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-4xl font-bold text-blue-700">{summary.totalWorkshops}</p>
                <p className="text-gray-600">Workshops</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-4xl font-bold text-blue-700">{summary.totalActivities}</p>
                <p className="text-gray-600">Activities</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-4xl font-bold text-blue-700">{summary.totalLessons}</p>
                <p className="text-gray-600">Lessons</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-4xl font-bold text-blue-700">{summary.totalScheduledLessons}</p>
                <p className="text-gray-600">Scheduled Lessons</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
