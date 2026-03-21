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
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import UmamiProvider from "next-umami";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "CROUStillant";
const APP_DEFAULT_TITLE = "CROUStillant";
const APP_TITLE_TEMPLATE = "%s - CROUStillant";
const APP_DESCRIPTION =
  "CROUStillant vous permet de consulter les menus des restaurants CROUS de France et d'outre-mer.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.WEB_URL || "https://croustillant.menu"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
    description: APP_DESCRIPTION,
    images: { url: process.env.WEB_URL + "/banner.png" },
    url: process.env.WEB_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: { url: process.env.WEB_URL + "/banner.png" },
  },
};

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

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <UmamiProvider
          websiteId="727eceb7-824d-4cac-b24b-789188b2480c"
          src="https://analytics.bayfield.dev/script.js"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased relative",
          inter.className
        )}
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
