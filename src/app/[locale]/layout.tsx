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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CROUStillant",
  applicationName: "CROUStillant",
  appleWebApp: true,
  description: "CROUStillant vous permet de consulter les menus des restaurants CROUS de France et d'outre-mer.",
  openGraph: {
    title: "CROUStillant",
    description: "CROUStillant vous permet de consulter les menus des restaurants CROUS de France et d'outre-mer.",
    type: "website",
    locale: "fr_FR",
    images: { url: process.env.WEB_URL + "/banner.png" },
    url: process.env.WEB_URL,
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
            <main className="p-4 pb-20 lg:p-20 grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
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
