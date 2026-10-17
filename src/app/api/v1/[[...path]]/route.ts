import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.DJANGO_API_URL || "http://127.0.0.1:8001";

async function proxyRequest(request: NextRequest) {
  try {
    const { pathname, search } = request.nextUrl;

    // Ensure path ends with slash for Django DRF trailing_slash convention
    let targetPath = pathname;
    if (!targetPath.endsWith("/") && !targetPath.includes(".")) {
      targetPath = `${targetPath}/`;
    }

    const targetUrl = `${BACKEND_URL}${targetPath}${search}`;

    const headers = new Headers(request.headers);
    // Remove host so fetch doesn't send original Next.js host header to Django
    headers.delete("host");
    headers.delete("connection");

    // Pass through access token cookie if Authorization header is missing
    const token = request.cookies.get("access_token")?.value;
    if (token && !headers.has("authorization")) {
      headers.set("authorization", `Bearer ${token}`);
    }

    const init: RequestInit = {
      method: request.method,
      headers,
      redirect: "follow",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const body = await request.arrayBuffer();
      if (body.byteLength > 0) {
        init.body = body;
      }
    }

    const backendRes = await fetch(targetUrl, init);

    const responseHeaders = new Headers();
    backendRes.headers.forEach((val, key) => {
      // Don't forward content-encoding or hop-by-hop headers
      const lower = key.toLowerCase();
      if (
        lower !== "content-encoding" &&
        lower !== "transfer-encoding" &&
        lower !== "connection"
      ) {
        responseHeaders.append(key, val);
      }
    });

    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error("[API Proxy Error]:", err);
    return NextResponse.json(
      { error: "Backend proxy error", details: err?.message || String(err) },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const HEAD = proxyRequest;
export const OPTIONS = proxyRequest;
