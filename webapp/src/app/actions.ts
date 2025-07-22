// webapp/src/app/actions.ts
'use server'; // This makes the entire file a Server Action

import { revalidatePath } from 'next/cache';

export async function revalidateWorkshopsPath() {
    revalidatePath('/workshops');
}

export async function revalidateActivitiesPath() {
    revalidatePath('/activities');
}