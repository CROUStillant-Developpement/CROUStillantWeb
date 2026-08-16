import { Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import RetryCountdown from "./retry-countdown";

export default async function TooManyRequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ retryAfter?: string }>;
}) {
  const { locale } = await params;
  const { retryAfter } = await searchParams;
  const t = await getTranslations({ locale, namespace: "TooManyRequestsPage" });

  const initialSeconds = Math.max(0, parseInt(retryAfter ?? "", 10) || 0);

  return (
    <>
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <Clock
          style={{ width: 48, height: 48, color: "hsl(var(--muted))" }}
        />
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          {t("title")}
        </h1>
        <p
          style={{
            color: "hsl(var(--muted))",
            maxWidth: "28rem",
            margin: 0,
          }}
        >
          {t("description")}
        </p>
        <RetryCountdown
          initialSeconds={initialSeconds}
          retryInLabel={t("retryIn")}
          retryButtonLabel={t("retryButton")}
        />
      </main>
      <footer
        style={{
          padding: "1rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "hsl(var(--muted))",
        }}
      >
        <a
          href={`/${locale}`}
          style={{ color: "inherit" }}
        >
          CROUStillant • {t("home")}
        </a>
      </footer>
    </>
  );
}
