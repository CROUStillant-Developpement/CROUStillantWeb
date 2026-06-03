import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import HomePage from "@/components/home/home-page";
import HomeHero from "@/components/home/home-hero";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
  };
}

export default function Home() {
  return (
    <section className="w-full relative pb-20 px-4 mt-4">
      <HomeHero />
      <HomePage />
    </section>
  );
}
