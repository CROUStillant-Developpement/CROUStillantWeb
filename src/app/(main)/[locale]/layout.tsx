import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/app/(main)/[locale]/theme-provider";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CROUStillant",
  applicationName: "CROUStillant",
  appleWebApp: true,
  description:
    "CROUStillant vous permet de consulter les menus des restaurants CROUS de France et d'outre-mer.",
  // icons: {
  //   icon: [
  //     { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  //     { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
  //   ],
  //   apple: [
  //     { url: "/icons/apple-touch-icon.png" },
  //     { url: "/icons/apple-touch-icon.png", sizes: "152x152" },
  //     { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
  //     { url: "/icons/apple-touch-icon.png", sizes: "167x167" },
  //   ],
  //   other: [
  //     {
  //       rel: "mask-icon",
  //       url: "/icons/apple-touch-icon.png",
  //       color: "#5bbad5",
  //     },
  //     { rel: "shortcut icon", url: "/favicon.ico" },
  //   ],
  // },
  manifest: "/manifest.json",
  // twitter: {
  //   card: "summary",
  //   title: "CROUStillant",
  //   description: "Le menu du RU, plus simplement.",
  //   images: "https://croustillant.vercel.app/icons/android-chrome-192x192.png",
  //   creator: "@cherifad",
  // },
  // openGraph: {
  //   type: "website",
  //   title: "CROUStillant",
  //   description: "Le menu du RU, plus simplement.",
  //   siteName: "CROUStillant",
  //   url: "https://croustillant.vercel.app/",
  //   images: [
  //     { url: "https://croustillant.vercel.app/icons/apple-touch-icon.png" },
  //   ],
  // },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side (just to get started)
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
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
