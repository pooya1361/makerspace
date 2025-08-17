// app/workshops/page.tsx

import Link from 'next/link';
import AdminOnly from '../components/AdminOnly';
import { apiSlice } from '../lib/features/api/apiSlice';
import { store } from '../lib/store';
import WorkshopsListClient from './WorkshopsListClient';

export default async function WorkshopsPage() {
    await store.dispatch(apiSlice.endpoints.getWorkshops.initiate(undefined));

    return (
        <div className="container mx-auto p-6 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-blue-800">Workshops</h1>
                <AdminOnly>
                    <Link data-testid="add-workshop-button" href="/workshops/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        + Add Workshop
                    </Link>
                </AdminOnly>
            </div>
            <WorkshopsListClient />
        </div>
    );
}