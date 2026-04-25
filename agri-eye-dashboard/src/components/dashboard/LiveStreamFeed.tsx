"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WifiOff, RefreshCw, Loader2 } from "lucide-react";

interface LiveStreamFeedProps {
  streamUrl: string;
  className?: string;
}

type StreamStatus = "connecting" | "live" | "error";

export default function LiveStreamFeed({ streamUrl, className }: LiveStreamFeedProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<StreamStatus>("connecting");
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const backendFallbackUrl =
    streamUrl === "/api/stream"
      ? process.env.NEXT_PUBLIC_BACKEND_STREAM_URL ?? "http://localhost:4000/api/stream"
      : streamUrl;
  const preferredStreamUrl = streamUrl === "/api/stream" ? backendFallbackUrl : streamUrl;

  const [activeStreamUrl, setActiveStreamUrl] = useState(preferredStreamUrl);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstFrameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<StreamStatus>("connecting");
  const retryRef = useRef(0);
  const lastReconnectAt = useRef(0);

  const debug = useCallback(
    (event: string, details?: Record<string, unknown>) => {
      if (process.env.NODE_ENV !== "development") return;
      // Useful to isolate whether failure is UI eventing, URL routing, or stream source.
      console.log("[LiveStreamFeed]", event, {
        streamUrl: activeStreamUrl,
        ...details,
      });
    },
    [activeStreamUrl]
  );

  useEffect(() => {
    setActiveStreamUrl(preferredStreamUrl);
  }, [preferredStreamUrl]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    retryRef.current = retryCount;
  }, [retryCount]);

  const connect = useCallback(() => {
    if (!imgRef.current) return;
    setStatus("connecting");
    setLastError(null);
    debug("connect:start", {
      status: statusRef.current,
      retryCount: retryRef.current,
      currentSrc: imgRef.current.currentSrc || "(none)",
    });

    if (firstFrameTimer.current) clearTimeout(firstFrameTimer.current);

    // If no real frame arrives soon, show explicit error instead of false "live" black screen.
    firstFrameTimer.current = setTimeout(() => {
      setStatus((prev) => {
        if (prev === "connecting") {
          setLastError("Connected but no frame received");
          debug("connect:no-first-frame", { status: prev, retryCount: retryRef.current });
          return "error";
        }
        return prev;
      });
    }, 1600);

    // Cache-bust so browser doesn't serve stale
    const joiner = activeStreamUrl.includes("?") ? "&" : "?";
    const finalUrl = `${activeStreamUrl}${joiner}t=${Date.now()}`;
    imgRef.current.src = finalUrl;
    debug("connect:url-applied", { finalUrl });

    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    if (activeStreamUrl === streamUrl && backendFallbackUrl !== streamUrl) {
      // If proxied route stays black/connecting, try direct backend stream once.
      fallbackTimer.current = setTimeout(() => {
        setStatus((prev) => {
          if (prev === "connecting") {
            debug("connect:fallback-to-backend", {
              from: streamUrl,
              to: backendFallbackUrl,
            });
            setActiveStreamUrl(backendFallbackUrl);
          }
          return prev;
        });
      }, 450);
    }
  }, [activeStreamUrl, backendFallbackUrl, debug, streamUrl]);

  const reconnect = useCallback(
    (reason: string) => {
      const now = Date.now();
      if (now - lastReconnectAt.current < 1200) return;
      lastReconnectAt.current = now;
      debug("reconnect:trigger", { reason, status: statusRef.current, retryCount: retryRef.current });
      connect();
    },
    [connect, debug]
  );

  const handleLoadStart = useCallback(() => {
    // Keep connecting until an actual frame is decoded.
    debug("img:loadstart", {
      status: "connecting",
      retryCount: retryRef.current,
      currentSrc: imgRef.current?.currentSrc || "(none)",
    });
  }, [debug]);

  const handleLoad = useCallback(() => {
    setStatus("live");
    setRetryCount(0);
    setLastError(null);
    if (firstFrameTimer.current) clearTimeout(firstFrameTimer.current);
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    debug("img:load", {
      status: "live",
      retryCount: 0,
      currentSrc: imgRef.current?.currentSrc || "(none)",
    });
  }, [debug]);

  const handleError = useCallback(() => {
    setStatus("error");
    if (firstFrameTimer.current) clearTimeout(firstFrameTimer.current);
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    const message = `Image stream error at ${new Date().toLocaleTimeString()}`;
    setLastError(message);
    debug("img:error", {
      status: "error",
      retryCount: retryRef.current,
      currentSrc: imgRef.current?.currentSrc || "(none)",
    });

    // Auto-retry up to 5 times with 3s back-off
    setRetryCount((prev) => {
      if (activeStreamUrl === streamUrl && backendFallbackUrl !== streamUrl) {
        debug("error:fallback-to-backend", {
          from: streamUrl,
          to: backendFallbackUrl,
        });
        setActiveStreamUrl(backendFallbackUrl);
        return prev;
      }

      if (prev < 5) {
        debug("retry:scheduled", { status: "error", retryCount: prev, nextRetry: prev + 1 });
        retryTimer.current = setTimeout(() => connect(), 3000);
        return prev + 1;
      }
      debug("retry:exhausted", { status: "error", retryCount: prev, maxRetries: 5 });
      return prev;
    });
  }, [activeStreamUrl, backendFallbackUrl, connect, debug, streamUrl]);

  useEffect(() => {
    connect();
    debug("effect:mounted", { status, retryCount });
    return () => {
      debug("effect:cleanup", { status, retryCount });
      if (retryTimer.current) clearTimeout(retryTimer.current);
      if (firstFrameTimer.current) clearTimeout(firstFrameTimer.current);
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      if (imgRef.current) imgRef.current.src = "";
    };
  }, [connect, debug]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
        // Short debounce so reconnect happens after the tab is fully active.
        resumeTimer.current = setTimeout(() => reconnect("visibility-resume"), 180);
      }
    };

    const handleFocus = () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => reconnect("window-focus"), 180);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [reconnect]);

  useEffect(() => {
    const keepAliveInterval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (statusRef.current !== "live") return;
      reconnect("keepalive-refresh");
    }, 45000);

    return () => clearInterval(keepAliveInterval);
  }, [reconnect]);

  useEffect(() => {
    debug("status:changed", { status, retryCount });
  }, [debug, status]);

  return (
    <div className={`relative w-full h-full bg-black ${className ?? ""}`}>
      {/* MJPEG stream — browsers handle multipart/x-mixed-replace natively */}
      <img
        ref={imgRef}
        alt="ESP32 Live Stream"
        crossOrigin="anonymous"
        loading="eager"
        fetchPriority="high"
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        className="w-full h-full object-cover"
        style={{ display: status === "error" ? "none" : "block" }}
      />

      {/* Lightweight connecting chip (do not block video with a dark full overlay) */}
      {status === "connecting" && (
        <div className="absolute top-2 left-2 z-20 inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-black/35 px-2 py-1">
          <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
          <span className="text-[10px] text-surface/80 font-mono tracking-wide">
            Connecting to ESP32…
          </span>
          {retryCount > 0 && (
            <span className="text-[10px] text-warning/80">
              Retry {retryCount}/5
            </span>
          )}
        </div>
      )}

      {/* Error overlay */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
          <WifiOff className="h-6 w-6 text-danger/80" />
          <span className="text-[11px] text-surface/50 font-mono">
            {retryCount >= 5 ? "Stream unreachable" : "No camera frame yet"}
          </span>
          {lastError && (
            <span className="max-w-[90%] text-center text-[10px] text-danger/80 font-mono break-words">
              {lastError}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              debug("manual:reconnect-click");
              setRetryCount(0);
              setLastError(null);
              connect();
            }}
            className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-black/50 px-3 py-1.5 text-[11px] text-surface/80 hover:bg-black/70 transition-all active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reconnect
          </button>
        </div>
      )}

      {/* Live badge — only when stream is actually flowing */}
      {status === "live" && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 border border-success/30">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="text-[9px] font-bold tracking-widest text-success">ESP32</span>
        </div>
      )}
    </div>
  );
}