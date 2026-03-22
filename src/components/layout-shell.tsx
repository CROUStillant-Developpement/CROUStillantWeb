"use client";

import { usePathname } from "@/i18n/routing";
import { Toaster } from "@/components/ui/toaster";
import NewUIBanner from "@/components/new-ui-banner";


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
  const isScreen = pathname.endsWith("/screen");

  if (isScreen) {
    return <>{children}</>;
  }

  return (
    <>
      <main className="md:p-4 pb-20 lg:p-20 grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 min-h-screen">
        {header}
        {children}
        {backToTop}
      </main>
      {footer}
      <Toaster />
      <NewUIBanner />
    </>
  );
}
