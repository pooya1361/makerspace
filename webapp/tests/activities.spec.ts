import { expect, test } from '@playwright/test';
import { mockAPIs } from './utils/mock-apis';

test.describe('Activities Management', () => {
    test('should display activities page with correct title', async ({ page }) => {
        await page.goto('/activities');

        // Check page title
        await expect(page.locator('h1')).toContainText('Activities');
        await expect(page.locator('h1')).toHaveClass(/text-green-700/);
    });

    test('should show add activity button for @admin users', async ({ page }) => {
        await page.goto('/activities');

        await mockAPIs(page, { isAdmin: true, body: [] });

        // Admin should see the add button
        const addButton = page.locator('a[href="/activities/add"]');
        await expect(addButton).toBeVisible();
        await expect(addButton).toContainText('Add Activity');
        await expect(addButton).toHaveClass(/bg-green-600/);

        // Test navigation to add page
        await addButton.click();
        await expect(page).toHaveURL('/activities/add');
    });

    test('should hide add activity button for regular users', async ({ page }) => {
        await page.goto('/activities');

        // Regular user should not see the add button
        const addButton = page.locator('a[href="/activities/add"]');
        await expect(addButton).not.toBeVisible();
    });

    test('should display loading state', async ({ page }) => {
        // Mock delayed response to catch loading state
        await page.route('**/api/activities', async route => {
            await new Promise(resolve => setTimeout(resolve, 100));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        });

        await page.goto('/activities');

        // Should show loading message
        await expect(page.locator('text=Loading activities...')).toBeVisible();
    });

    test('should display error state', async ({ page }) => {
        // Mock API error
        await page.route('**/api/activities', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal server error' })
            });
        });

        await page.goto('/activities');

        // Should show error message
        await expect(page.locator('text=Error loading activities')).toBeVisible();
    });

    test('should display empty state when no activities exist', async ({ page }) => {
        // Mock empty activities response
        await page.route('**/api/activities', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        });

        await page.goto('/activities');

        // Should show empty state message
        await expect(page.locator('text=No activities available yet')).toBeVisible();
    });

    test('should display activities list with correct information', async ({ page }) => {
        // Mock activities data
        const mockActivities = [
            {
                id: 1,
                name: '3D Printing Basics',
                description: 'Learn the fundamentals of 3D printing technology and create your first print.',
                workshop: {
                    id: 1,
                    name: 'Digital Fabrication Lab'
                }
            },
            {
                id: 2,
                name: 'Laser Cutting Workshop',
                description: 'Master the art of precision cutting with our state-of-the-art laser cutters.',
                workshop: {
                    id: 2,
                    name: 'Woodworking Shop'
                }
            },
            {
                id: 3,
                name: 'Electronics Assembly',
                description: 'Build and program basic electronic circuits.',
                workshop: null // Test case with no workshop assigned
            }
        ];

        await page.route('**/api/activities', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockActivities)
            });
        });

        await page.goto('/activities');

        // Should display activities in a grid
        const activityCards = page.locator('.grid .bg-white');
        await expect(activityCards).toHaveCount(3);

        // Check first activity
        const firstCard = activityCards.first();
        await expect(firstCard.locator('h2')).toContainText('3D Printing Basics');
        await expect(firstCard.locator('p').first()).toContainText('Learn the fundamentals of 3D printing');
        await expect(firstCard.locator('text=Location: Digital Fabrication Lab')).toBeVisible();

        // Check activity with no workshop
        const thirdCard = activityCards.nth(2);
        await expect(thirdCard.locator('text=Location: Not assigned')).toBeVisible();
    });

    test('should show edit buttons for @admin users', async ({ page }) => {
        // Mock activities data
        const mockActivities = [
            {
                id: 1,
                name: 'Test Activity',
                description: 'Test description',
                workshop: { id: 1, name: 'Test Workshop' }
            }
        ];

        await mockAPIs(page, { isAdmin: true, body: mockActivities });

        await page.goto('/activities');

        // Admin should see edit button (📝 emoji)
        const editButton = page.locator('a[href="/activities/1/edit"]');
        await expect(editButton).toBeVisible();
        await expect(editButton).toContainText('📝');
        await expect(editButton).toHaveClass(/border-green-600/);
    });

    test('should hide edit buttons for regular users', async ({ page }) => {
        // Mock activities data
        const mockActivities = [
            {
                id: 1,
                name: 'Test Activity',
                description: 'Test description',
                workshop: { id: 1, name: 'Test Workshop' }
            }
        ];

        await mockAPIs(page, { isAdmin: true, body: mockActivities });

        await page.goto('/activities');

        // Regular user should not see edit button
        const editButton = page.locator('a[href="/activities/1/edit"]');
        await expect(editButton).not.toBeVisible();
    });

    test('should navigate to edit page when admin clicks edit button', async ({ page }) => {
        // Mock activities data
        const mockActivities = [
            {
                id: 1,
                name: 'Test Activity',
                description: 'Test description',
                workshop: { id: 1, name: 'Test Workshop' }
            }
        ];

        await page.route('**/api/activities', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockActivities)
            });
        });

        await page.route('**/api/auth/**', route =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: { userType: 'SUPERADMIN', id: 1, email: 'admin@test.com' }
                }),
            })
        );

        await page.goto('/activities');

        // Click edit button
        const editButton = page.locator('a[href="/activities/1/edit"]');
        await editButton.click();

        // Should navigate to edit page
        await expect(page).toHaveURL('/activities/1/edit');
    });

    test('should handle activities with long descriptions', async ({ page }) => {
        // Mock activity with long description
        const mockActivities = [
            {
                id: 1,
                name: 'Advanced Electronics',
                description: 'This is a very long description that should be truncated in the UI. '.repeat(10),
                workshop: { id: 1, name: 'Electronics Lab' }
            }
        ];

        await page.route('**/api/activities', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockActivities)
            });
        });

        await page.goto('/activities');

        // Should have line-clamp class for truncation
        const description = page.locator('.line-clamp-3').first();
        await expect(description).toBeVisible();
    });

    test('should display hover effects on activity cards', async ({ page }) => {
        // Mock activities data
        const mockActivities = [
            {
                id: 1,
                name: 'Test Activity',
                description: 'Test description',
                workshop: { id: 1, name: 'Test Workshop' }
            }
        ];

        await page.route('**/api/activities', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockActivities)
            });
        });

        await page.goto('/activities');

        // Check that cards have hover transform class
        const activityCard = page.locator('.bg-white').first();
        await expect(activityCard).toHaveClass(/hover:scale-105/);
        await expect(activityCard).toHaveClass(/transition-transform/);
    });

    test('should be responsive across different screen sizes', async ({ page }) => {
        // Mock activities data
        const mockActivities = [
            { id: 1, name: 'Activity 1', description: 'Description 1', workshop: null },
            { id: 2, name: 'Activity 2', description: 'Description 2', workshop: null },
            { id: 3, name: 'Activity 3', description: 'Description 3', workshop: null }
        ];

        await page.route('**/api/activities', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockActivities)
            });
        });

        await page.goto('/activities');

        // Check that grid has responsive classes
        const grid = page.locator('.grid');
        await expect(grid).toHaveClass(/grid-cols-1/); // Mobile
        await expect(grid).toHaveClass(/md:grid-cols-2/); // Tablet
        await expect(grid).toHaveClass(/lg:grid-cols-3/); // Desktop
    });
});