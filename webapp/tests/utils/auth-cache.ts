// tests/utils/auth-cache.ts
import { expect, Page, test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');
const adminAuthFile = path.join(__dirname, '../.auth/admin.json');

// Setup authentication for regular user
setup('authenticate as user', async ({ page }) => {
    // Mock the auth endpoint
    await page.route('**/api/auth/login', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                user: { id: 1, email: 'user@test.com', firstname: 'Test', lastname: 'User', userType: 'NORMAL' },
                token: 'mock-user-token'
            })
        });
    });

    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'user@test.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Wait for redirect
    await expect(page).not.toHaveURL('/login');

    // Save authentication state
    await page.context().storageState({ path: authFile });
});

// Setup authentication for admin user
setup('authenticate as admin', async ({ page }) => {
    // Mock the auth endpoint
    await page.route('**/api/auth/login', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                user: { id: 1, email: 'admin@test.com', firstname: 'Admin', lastname: 'User', userType: 'SUPERADMIN' },
                token: 'mock-admin-token'
            })
        });
    });

    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@test.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Wait for redirect
    await expect(page).not.toHaveURL('/login');

    // Save authentication state
    await page.context().storageState({ path: adminAuthFile });
});

// Helper functions to use cached auth
export async function useUserAuth(page: Page) {
    // Load the stored authentication state
    await page.context().addInitScript(() => {
        // Set any required localStorage/sessionStorage items
        localStorage.setItem('user', JSON.stringify({
            id: 1,
            email: 'user@test.com',
            userType: 'NORMAL'
        }));
    });
}

export async function useAdminAuth(page: Page) {
    // Load the stored authentication state
    await page.context().addInitScript(() => {
        // Set any required localStorage/sessionStorage items
        localStorage.setItem('user', JSON.stringify({
            id: 1,
            email: 'admin@test.com',
            userType: 'SUPERADMIN'
        }));
    });
}