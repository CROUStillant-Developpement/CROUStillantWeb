"use client";

import { useEffect, useState } from "react";

export default function RetryCountdown({
  initialSeconds,
  retryInLabel,
  retryButtonLabel,
}: {
  initialSeconds: number;
  retryInLabel: string;
  retryButtonLabel: string;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      {seconds > 0 && (
        <p style={{ margin: 0, fontSize: "0.875rem", color: "hsl(var(--muted))" }}>
          {retryInLabel} {seconds}s
        </p>
      )}
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "0.5rem 1.25rem",
          borderRadius: "0.5rem",
          border: "1px solid hsl(var(--muted))",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
      >
        {retryButtonLabel}
      </button>
    </div>
  );
}
