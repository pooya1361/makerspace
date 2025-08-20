// app/api/[...proxy]/route.ts
import { cookies } from 'next/headers';

async function handleProxy(req: Request, proxyPath: string[]) {
    try {
        // Get all cookies and format them properly
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        const cookieHeader = allCookies
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join('; ');

        // Build the target URL
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:8080';

        // Don't add /api for GraphQL endpoints
        const pathString = proxyPath.join('/');
        const isGraphQL = pathString === 'graphql' || pathString === 'graphiql';

        const targetUrl = isGraphQL
            ? `${backendUrl}/${pathString}`
            : `${backendUrl}/api/${pathString}`;

        // Get request body for non-GET requests
        const requestBody = ['GET', 'HEAD'].includes(req.method)
            ? undefined
            : await req.text();

        // Build headers for backend request
        const forwardHeaders: Record<string, string> = {
            'Content-Type': req.headers.get('content-type') || 'application/json',
            'Accept': req.headers.get('accept') || 'application/json',
            'User-Agent': req.headers.get('user-agent') || 'NextJS-Proxy/1.0',
        };

        // Add cookies if they exist
        if (cookieHeader) {
            forwardHeaders['Cookie'] = cookieHeader;
        }

        // Forward other important headers
        const importantHeaders = ['authorization', 'x-requested-with', 'origin', 'referer'];
        importantHeaders.forEach(headerName => {
            const value = req.headers.get(headerName);
            if (value) {
                forwardHeaders[headerName] = value;
            }
        });

        // Make request to backend
        const backendResponse = await fetch(targetUrl, {
            method: req.method,
            headers: forwardHeaders,
            body: requestBody,
        });

        // Get response body
        const responseBody = await backendResponse.text();

        // Build response headers
        const responseHeaders = new Headers();

        // Forward content-type
        const contentType = backendResponse.headers.get('content-type');
        if (contentType) {
            responseHeaders.set('content-type', contentType);
        }

        // Forward CORS headers
        const corsHeaders = [
            'access-control-allow-origin',
            'access-control-allow-methods',
            'access-control-allow-headers',
            'access-control-allow-credentials'
        ];
        corsHeaders.forEach(header => {
            const value = backendResponse.headers.get(header);
            if (value) {
                responseHeaders.set(header, value);
            }
        });

        // Forward Set-Cookie headers (most important for auth)
        const setCookieHeaders = backendResponse.headers.get('set-cookie');
        if (setCookieHeaders) {
            responseHeaders.set('set-cookie', setCookieHeaders);
            console.log('Forwarding Set-Cookie:', setCookieHeaders);
        }

        // Handle multiple set-cookie headers if browser supports it
        if (backendResponse.headers.has('set-cookie')) {
            // Try to get all set-cookie headers
            const allSetCookies = (backendResponse.headers as any).getSetCookie?.() || [];
            allSetCookies.forEach((cookie: string) => {
                responseHeaders.append('set-cookie', cookie);
            });
        }

        if (backendResponse.status !== 200) {
            console.log('Proxy Response:', {
                status: backendResponse.status,
                statusText: backendResponse.statusText,
                hasSetCookie: responseHeaders.has('set-cookie'),
                responseLength: responseBody.length
            });
        }

        return new Response(responseBody, {
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            headers: responseHeaders,
        });

    } catch (error) {
        console.error('Proxy Error:', error);
        return new Response(
            JSON.stringify({
                error: 'Proxy failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                status: 500,
                headers: { 'content-type': 'application/json' }
            }
        );
    }
}

export async function GET(req: Request, context: { params: Promise<{ proxy: string[] }> }) {
    const { proxy } = await context.params;
    return handleProxy(req, proxy);
}

export async function POST(req: Request, context: { params: Promise<{ proxy: string[] }> }) {
    const { proxy } = await context.params;
    return handleProxy(req, proxy);
}

export async function PUT(req: Request, context: { params: Promise<{ proxy: string[] }> }) {
    const { proxy } = await context.params;
    return handleProxy(req, proxy);
}

export async function PATCH(req: Request, context: { params: Promise<{ proxy: string[] }> }) {
    const { proxy } = await context.params;
    return handleProxy(req, proxy);
}

export async function DELETE(req: Request, context: { params: Promise<{ proxy: string[] }> }) {
    const { proxy } = await context.params;
    return handleProxy(req, proxy);
}