import { Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function TooManyRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TooManyRequestsPage" });

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
