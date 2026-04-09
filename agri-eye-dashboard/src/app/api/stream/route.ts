import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_STREAM_URL = process.env.BACKEND_STREAM_URL ?? "http://localhost:4000/api/stream";

export async function GET() {
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

  try {
    console.log(`[stream-proxy:${requestId}] requesting upstream ${BACKEND_STREAM_URL}`);

    const upstream = await fetch(BACKEND_STREAM_URL, {
      cache: "no-store",
      // Keep this request dynamic and do not cache MJPEG chunks.
      next: { revalidate: 0 },
    });

    console.log(
      `[stream-proxy:${requestId}] upstream response ${upstream.status} ${upstream.headers.get("content-type") ?? "unknown-content-type"}`
    );

    if (!upstream.ok || !upstream.body) {
      console.error(
        `[stream-proxy:${requestId}] upstream unavailable status=${upstream.status} bodyPresent=${Boolean(upstream.body)}`
      );
      return NextResponse.json(
        { error: "Stream source unavailable", status: upstream.status, requestId },
        { status: 502 }
      );
    }

    const headers = new Headers();
    headers.set(
      "Content-Type",
      upstream.headers.get("content-type") ?? "multipart/x-mixed-replace; boundary=frame"
    );
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Connection", "keep-alive");
    headers.set("x-stream-proxy-id", requestId);

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown stream proxy error";
    console.error(`[stream-proxy:${requestId}] exception`, message);
    return NextResponse.json({ error: message, requestId }, { status: 502 });
  }
}
