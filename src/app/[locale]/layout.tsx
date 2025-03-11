import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/app/[locale]/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import UmamiProvider from "next-umami";
import InfoCards from "@/components/infoCards";
import JoinTeam from "@/components/joinTeam";
import FooterCtaCard from "@/components/cards/FooterCtaCard";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "CROUStillant";
const APP_DEFAULT_TITLE = "CROUStillant";
const APP_TITLE_TEMPLATE = "%s - CROUStillant";
const APP_DESCRIPTION =
  "CROUStillant vous permet de consulter les menus des restaurants CROUS de France et d'outre-mer.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
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
    card: "summary",
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
            <main className=" pb-20 grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <Header />
              {children}
            </main>
            <Footer />
            <Toaster />
            
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
