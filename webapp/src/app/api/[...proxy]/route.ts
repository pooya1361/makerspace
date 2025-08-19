// app/api/[...proxy]/route.ts
import { cookies } from "next/headers";

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

export async function DELETE(req: Request, context: { params: Promise<{ proxy: string[] }> }) {
    const { proxy } = await context.params;
    return handleProxy(req, proxy);
}

async function handleProxy(req: Request, proxyPath: string[]) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:8080'}/${proxyPath.join("/")}`;

    const res = await fetch(url, {
        method: req.method,
        headers: {
            cookie: cookieHeader,
            "content-type": req.headers.get("content-type") || "",
        },
        body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
        credentials: "include",
    });

    return new Response(await res.text(), { status: res.status });
}
