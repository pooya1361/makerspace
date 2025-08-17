// tests/utils/mock-apis.ts
import { Page } from "@playwright/test";

interface mockAPIsProps {
    isAdmin: boolean,
    body: any[]
}
export async function mockAPIs(page: Page, {isAdmin, body}: mockAPIsProps) {
    await page.route('**/api/**', async route => {
        const url: string = route.request().url();
        const paths = url.split("/")

        switch (paths[paths.length - 1]) {
            case 'activities':
            case 'workshops':
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(body)
                });

                break;

            case 'me':
            case 'auth':
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        user: {
                            userType: isAdmin ? 'SUPERADMIN' : 'NORMAL',
                            id: 1,
                            email: isAdmin ? 'admin@test.com' : 'user@test.com'
                        }
                    })
                });
                break;

            default:
                await route.continue();
                break;
        }
    });
}