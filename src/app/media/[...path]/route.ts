import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.DJANGO_API_URL || "http://127.0.0.1:8001";

export async function GET(request: NextRequest) {
  try {
    const { pathname, search } = request.nextUrl;
    const targetUrl = `${BACKEND_URL}${pathname}${search}`;

    const res = await fetch(targetUrl);
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
