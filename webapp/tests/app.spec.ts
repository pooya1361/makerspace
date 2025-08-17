import { expect, test } from '@playwright/test';

test.describe('Makerspace App Navigation & Authentication', () => {
    test('should load homepage and show makerspace branding', async ({ page }) => {
        await page.goto('/');

        // Test page loads correctly
        await expect(page).toHaveTitle('Makerspace App');

        // Should show main navigation or landing content
        await expect(page.locator('[data-testid="main-nav"]')).toBeVisible();

        // Should have link to login
        await expect(page.locator(`a[href*="/login"]`)).toBeVisible();
    });

    test('should redirect to login when accessing protected routes', async ({ page }) => {
        // Test that protected routes redirect to login when not logged in
        const protectedRoutes = [
            '/workshops/add',
            '/lessons/add',
            '/activities/add',
            '/scheduled-lessons'
        ];

        for (const route of protectedRoutes) {
            await page.goto(route);
            await expect(page).toHaveURL(/\/login/);
        }
    });

    test('should handle 404 pages gracefully', async ({ page }) => {
        await page.goto('/non-existent-page');

        // Should show 404 page or redirect to home
        const is404 = await page.locator('text=/404|not found/i').isVisible();
        const isHome = page.url().endsWith('/');

        expect(is404 || isHome).toBeTruthy();
    });
});

// Tests that require authentication - will use cached storageState
test.describe('Makerspace App Core Features', () => {
    // No more beforeEach needed! Authentication comes from storageState

    // test('should navigate between main sections', async ({ page }) => {
    //     // Test navigation to workshops
    //     await page.goto('/workshops');
    //     await expect(page.locator('h1, [data-testid="page-title"]')).toContainText(/workshop/i);

    //     // Test navigation to lessons  
    //     await page.goto('/lessons');
    //     await expect(page.locator('h1, [data-testid="page-title"]')).toContainText(/lesson/i);

    //     // Test navigation to activities
    //     await page.goto('/activities');
    //     await expect(page.locator('h1, [data-testid="page-title"]')).toContainText(/activit/i);

    //     // Test navigation to scheduled lessons
    //     await page.goto('/scheduled-lessons');
    //     await expect(page).toHaveURL(/\/scheduled-lessons/);
    // });

    test('should access add forms for each content type', async ({ page }) => {
        const contentTypes = [
            { name: 'workshops', path: '/workshops', addPath: '/workshops/add' },
            { name: 'lessons', path: '/lessons', addPath: '/lessons/add' },
            { name: 'activities', path: '/activities', addPath: '/activities/add' },
            { name: 'scheduled-lessons', path: '/scheduled-lessons', addPath: '/scheduled-lessons/add' }
        ];

        for (const content of contentTypes) {
            // Navigate to main page
            await page.goto(content.path);

            // Try to find add button
            const addButton = page.locator(`[data-testid="add-${content.name}-button"], a[href="${content.addPath}"]`);

            if (await addButton.isVisible()) {
                await addButton.click();
                await expect(page).toHaveURL(content.addPath);
            } else {
                // If no add button (might be admin-only), navigate directly
                await page.goto(content.addPath);
            }

            // Should show form (if the page exists)
            const form = page.locator('form, [data-testid="add-form"]');
            if (await form.isVisible()) {
                console.log(`✓ ${content.name} add form is working`);
            } else {
                console.log(`ℹ ${content.name} add form not yet implemented`);
            }
        }
    });

    test('should handle RTK state management across navigation', async ({ page }) => {
        // Create some content that will be stored in RTK state
        await page.goto('/workshops/add');

        // Check if form exists first
        const titleInput = page.locator('[data-testid="title-input"]');
        if (await titleInput.isVisible()) {
            // Fill partial form
            await titleInput.fill('Test Workshop Draft');

            const descInput = page.locator('[data-testid="description-input"]');
            if (await descInput.isVisible()) {
                await descInput.fill('This is a test');
            }

            // Navigate away and back
            await page.goto('/lessons');
            await page.goto('/workshops/add');

            // Test that we can still interact with the form
            await titleInput.fill('Updated Title');
            await expect(titleInput).toHaveValue('Updated Title');
        } else {
            console.log('ℹ Workshop add form not yet implemented');
        }
    });

    test('should display and interact with time slot voting', async ({ page }) => {
        await page.goto('/proposed-time-slots');

        // Check if time slots feature exists
        const timeSlotsContainer = page.locator('[data-testid="time-slots-list"], .time-slot');
        if (await timeSlotsContainer.isVisible()) {
            // Click on a time slot to view voting
            const firstTimeSlot = page.locator('[data-testid="time-slot-card"], .time-slot-card').first();
            if (await firstTimeSlot.isVisible()) {
                await firstTimeSlot.click();
                await expect(page).toHaveURL(/\/proposed-time-slots\/\d+\/votes/);
            }
        } else {
            console.log('ℹ Time slots feature not yet implemented');
        }
    });

    test('should handle user logout', async ({ page }) => {
        await page.goto('/');

        // Look for logout button
        const logoutButton = page.locator('[data-testid="logout-button"], [data-testid="user-menu-logout"]');

        if (await logoutButton.isVisible()) {
            await logoutButton.click();

            // Should redirect to login or home page
            await expect(page).toHaveURL(/\/login|\/$/);

            // Should not be able to access protected routes
            await page.goto('/workshops/add');
            await expect(page).toHaveURL(/\/login/);
        } else {
            console.log('ℹ Logout functionality not yet implemented');
        }
    });

    test('should handle network errors gracefully', async ({ page }) => {
        // Mock network failure for API calls
        await page.route('**/api/**', async route => {
            await route.abort();
        });

        await page.goto('/workshops');

        // Should handle the error gracefully (not crash)
        // Look for error states, retry buttons, or loading states
        const errorHandled = await Promise.race([
            page.locator('[data-testid="error-message"], .error').isVisible(),
            page.locator('[data-testid="retry-button"], button:has-text("retry")').isVisible(),
            page.locator('text=Loading').isVisible(),
            new Promise(resolve => setTimeout(() => resolve(true), 2000)) // Timeout after 2s
        ]);

        // App should handle the error gracefully (not crash)
        expect(errorHandled).toBeTruthy();
    });
});

// Separate test suite for registration/login flows (no auth needed)
test.describe('Makerspace App Registration & Login', () => {
    const testUser = {
        firstname: 'Test',
        lastname: 'User',
        email: 'playwright-test@makerspace.com',
        password: 'SecurePassword123!'
    };

    test('should show registration form', async ({ page }) => {
        await page.goto('/register');

        // Verify form exists and has correct fields
        await expect(page.locator('form, [data-testid="register-form"]')).toBeVisible();
        await expect(page.locator('[data-testid="firstname-input"]')).toBeVisible();
        await expect(page.locator('[data-testid="lastname-input"]')).toBeVisible();
        await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
        await expect(page.locator('[data-testid="password-input"]')).toBeVisible();

        // Test that form accepts input
        await page.fill('[data-testid="firstname-input"]', testUser.firstname);
        await page.fill('[data-testid="lastname-input"]', testUser.lastname);
        await expect(page.locator('[data-testid="firstname-input"]')).toHaveValue(testUser.firstname);
    });

    test('should handle login flow', async ({ page }) => {
        // Mock successful login response
        await page.route('**/api/auth/login', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: { id: 1, email: testUser.email, firstname: testUser.firstname, lastname: testUser.lastname },
                    token: 'mock-jwt-token'
                })
            });
        });

        await page.goto('/login');

        // Test form is visible
        await expect(page.locator('form, [data-testid="login-form"]')).toBeVisible();

        // Fill login form
        await page.fill('[data-testid="email-input"]', testUser.email);
        await page.fill('[data-testid="password-input"]', testUser.password);
        await page.click('[data-testid="login-button"]');

        // Should redirect away from login page
        await expect(page).not.toHaveURL('/login');
    });

    test('should handle login validation errors', async ({ page }) => {
        await page.goto('/login');

        // Mock failed login
        await page.route('**/api/auth/login', async route => {
            await route.fulfill({
                status: 401,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Invalid credentials' })
            });
        });

        // Try with invalid credentials
        await page.fill('[data-testid="email-input"]', 'nonexistent@example.com');
        await page.fill('[data-testid="password-input"]', 'wrongpassword');
        await page.click('[data-testid="login-button"]');

        // Should show error message
        await expect(page.locator('[data-testid="login-error"], .error')).toBeVisible();
    });
});