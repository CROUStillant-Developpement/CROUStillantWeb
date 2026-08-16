"use client";

import { useEffect } from "react";
import ErrorPage from "@/components/error";
import { useUmami } from "next-umami";

// Catches otherwise-uncaught render/runtime exceptions within a route —
// previously these fell through to Next.js' generic, unstyled error screen
// instead of the site's branded 500 page.
export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const umami = useUmami();

  useEffect(() => {
    umami.event("UnhandledError", {
      message: error.message,
      digest: error.digest ?? "",
    });
  }, [error, umami]);

  return <ErrorPage statusCode={500} />;
}
