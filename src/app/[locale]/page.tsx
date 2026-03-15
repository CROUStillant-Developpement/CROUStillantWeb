import HomePage from "@/components/home/home-page";
import HomeHero from "@/components/home/home-hero";

export default function Home() {
  return (
    <section className="w-full relative pb-20 px-4 mt-4">
      <HomeHero />
      <HomePage />
    </section>
  );
}
