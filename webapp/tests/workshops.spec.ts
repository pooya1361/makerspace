// tests/workshops.spec.ts
import { expect, test } from '@playwright/test';
import { mockAPIs } from './utils/mock-apis';

test.describe('Workshops page with login', () => {
    test('non-admin user does NOT see Add Workshop', async ({ page }) => {
        await mockAPIs(page, { isAdmin: true, body: [] });

        await page.goto('/workshops');

        await expect(page.getByTestId('add-workshop-button')).toHaveCount(0);
    });

    test('admin user sees Add Workshop', async ({ page }) => {
        const mockWorkshops = [
            {
                id: 1,
                name: 'Test Workshop',
                description: 'A test workshop',
                size: 50,
                activities: [{ id: 1, name: 'Activity 1' }],
            }
        ];

        await mockAPIs(page, { isAdmin: true, body: mockWorkshops });

        await page.goto('/workshops');

        await expect(page.getByTestId('add-workshop-button')).toBeVisible();
    });
});
