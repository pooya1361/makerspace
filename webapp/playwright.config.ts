import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',

    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
            teardown: 'cleanup'
        },
        {
            name: 'cleanup',
            testMatch: /.*\.teardown\.ts/
        },
        {
            name: 'user-tests',
            use: { storageState: './tests/.auth/user.json' },
            dependencies: ['setup'],
            testIgnore: ['**/*@admin*'],
        },
        {
            name: 'admin-tests',
            use: { storageState: './tests/.auth/admin.json' },
            dependencies: ['setup'],
            grep: /@admin/,
        },
    ],

    // Start dev server before tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});