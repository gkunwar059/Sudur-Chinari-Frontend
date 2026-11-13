import { NextRequest, NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/auth-session";

const rawBackend = process.env.DJANGO_API_URL || "http://127.0.0.1:8001";
const BACKEND_URL = rawBackend.replace(/\/+$/, "").replace(/\/api\/v1$/, "");

export async function GET(request: NextRequest) {
  try {
    const { pathname, search } = request.nextUrl;
    const targetUrl = `${BACKEND_URL}${pathname}${search}`;

    const forwardHeaders = new Headers();
    const passthroughHeaders = [
      "accept",
      "range",
      "if-none-match",
      "if-modified-since",
    ];
    for (const headerName of passthroughHeaders) {
      const val = request.headers.get(headerName);
      if (val) {
        forwardHeaders.set(headerName, val);
      }
    }

    const existingAuth = request.headers.get("authorization");
    if (existingAuth) {
      forwardHeaders.set("Authorization", existingAuth);
    } else {
      const token = await getValidAccessToken();
      if (token) {
        forwardHeaders.set("Authorization", `Bearer ${token}`);
      }
    }

    const res = await fetch(targetUrl, { headers: forwardHeaders });
    const headers = new Headers();
    res.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      if (
        lower !== "content-encoding" &&
        lower !== "transfer-encoding" &&
        lower !== "connection"
      ) {
        headers.append(key, val);
      }
    });

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Media proxy error", details: err?.message || String(err) },
      { status: 502 }
    );
  }
}
