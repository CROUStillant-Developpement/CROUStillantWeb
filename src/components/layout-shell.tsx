"use client";

import { usePathname } from "@/i18n/routing";
import { Toaster } from "@/components/ui/toaster";
import NewUIBanner from "@/components/new-ui-banner";
import BetaBanner from "@/components/beta-banner";
import { useTranslations } from "next-intl";
import UpdateBanner from "@/components/update-banner";


export default function LayoutShell({
  children,
  header,
  footer,
  backToTop,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  backToTop: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations("Common");
  const isScreen = pathname.endsWith("/screen");

  if (isScreen) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-bold focus:shadow-lg"
      >
        {t("skipToMainContent")}
      </a>
      <main id="main-content" className="md:p-4 pb-20 lg:p-20 grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 min-h-screen max-w-[1920px] mx-auto w-full">
        {header}
        {children}
        {backToTop}
      </main>
      {footer}
      <Toaster />
      <NewUIBanner />
      <BetaBanner />
      <UpdateBanner />
    </>
  );
}
