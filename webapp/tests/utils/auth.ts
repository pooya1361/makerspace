import { expect, Page } from '@playwright/test';

export async function loginAs(page: Page, isAdmin: boolean = false) {
    // Mock login endpoint
    await page.route('**/api/auth/login', route =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                user: {
                    id: 1,
                    firstName: isAdmin ? 'Alice' : 'Jane',
                    lastName: isAdmin ? 'Admin' : 'Doe',
                    email: isAdmin ? 'alice@admin.com' : 'jane@user.com',
                    userType: isAdmin ? 'ADMIN' : 'NORMAL',
                },
            }),
            headers: {
                // simulate server setting auth cookie
                'set-cookie': `session=fake-session-for-${isAdmin ? 'ADMIN' : 'NORMAL'}; Path=/; HttpOnly`,
            },
        })
    );

    // Mock current user endpoint
    await page.route('**/api/auth/me', route =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: 1,
                firstName: isAdmin ? 'Alice' : 'Jane',
                lastName: isAdmin ? 'Admin' : 'Doe',
                email: isAdmin ? 'alice@admin.com' : 'jane@user.com',
                userType: isAdmin ? 'ADMIN' : 'NORMAL',
            }),
        })
    );

    await page.route('**/api/summary/available-lessons', route =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]), // or some fake lessons
        })
    );

    await page.route('**/api/summary', route =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ totalLessons: 0 }), // dummy payload
        })
    );

    // Navigate to login page and submit credentials
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Verify redirect worked (assuming login redirects off /login)
    await expect(page).not.toHaveURL('/login');
}
