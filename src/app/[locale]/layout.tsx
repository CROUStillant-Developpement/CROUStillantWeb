import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import LayoutShell from "@/components/layout-shell";
import Header from "@/components/header";
import BackToTopButton from "@/components/ui/back-to-top-button";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/app/[locale]/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import {
  DEFAULT_OG_IMAGE,
  IS_PRODUCTION_DEPLOYMENT,
  NO_INDEX_ROBOTS,
  SITE_URL,
  buildAlternates,
} from "@/lib/metadata";
import { buildSiteJsonLd } from "@/lib/site-jsonld";
import JsonLd from "@/components/json-ld";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import UmamiProvider from "next-umami";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "CROUStillant";
const APP_DEFAULT_TITLE = "CROUStillant";
const APP_TITLE_TEMPLATE = "%s - CROUStillant";

/**
 * Site-wide defaults inherited by every page.
 *
 * Localised through `generateMetadata` rather than a static export: these
 * strings used to be hardcoded French, so English pages advertised a French
 * description and French keywords to crawlers.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const locale = await getLocale();

  const description = t("siteDescription");
  const banner = { ...DEFAULT_OG_IMAGE, alt: t("bannerAlt") };

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description,
    authors: [
      {
        name: "CROUStillant Développement",
        url: "https://github.com/CROUStillant-Developpement",
      },
    ],
    creator: "CROUStillant Développement",
    publisher: "CROUStillant Développement",
    category: "food",
    keywords: [
      "CROUS",
      "CROUStillant",
      "Crous Menu",
      "Menu",
      "Restaurant",
      "Cantine",
      "Restauration",
      "Université",
      "Étudiant",
      "RU",
      "Resto U",
      "Restauration Universitaire",
      "Nourriture",
      "Repas",
      "France",
      "Outre-mer",
    ],
    alternates: buildAlternates(locale),
    robots: IS_PRODUCTION_DEPLOYMENT
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : NO_INDEX_ROBOTS,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/logo.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: APP_DEFAULT_TITLE,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: APP_NAME,
      title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
      },
      description,
      images: [banner],
      url: `${SITE_URL}/${locale}`,
      locale: locale === "en" ? "en_GB" : "fr_FR",
      alternateLocale: locale === "en" ? ["fr_FR"] : ["en_GB"],
    },
    twitter: {
      card: "summary_large_image",
      title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
      },
      description,
      images: [banner],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  const t = await getTranslations("Metadata");
  const siteJsonLd = buildSiteJsonLd(locale, t("siteDescription"));

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <UmamiProvider
          websiteId="727eceb7-824d-4cac-b24b-789188b2480c"
          src="https://analytics.bayfield.dev/script.js"
        />
        <JsonLd data={siteJsonLd} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased relative",
          inter.className
        )}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutShell
              header={<Header />}
              footer={<Footer />}
              backToTop={<BackToTopButton />}
            >
              {children}
            </LayoutShell>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
