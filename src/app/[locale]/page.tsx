"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useUserPreferences } from "@/store/userPreferencesStore";

export default function HomePage() {
  const t = useTranslations("HomePage");
  // const { starredFav } = useUserPreferences();

  return (
    <section className="container">
      <div className="-z-10 absolute w-full h-3/4 right-0 overflow-hidden">
        <div className="-z-10 absolute -top-32 -right-32 lg:top-0 lg:right-0 w-28 h-[62.5rem] bg-gradient-to-b from-[rgba(250,250,250,0.80)] to-[rgba(255,0,0,0.80)] rotate-[-41.805deg] blur-[34px]"/>
        <div className="-z-10 absolute -top-8 -right-8 lg:top-16 lg:right-52 w-28 h-[62.5rem] bg-gradient-to-b from-[rgba(250,250,250,0.80)] to-[rgba(255,0,0,0.80)] rotate-[-41.805deg] blur-[34px]"/>
        <div className="-z-10 absolute top-32 right-8 lg:top-96 lg:right-28 w-28 h-[62.5rem] bg-gradient-to-b from-[rgba(250,250,250,0.80)] to-[rgba(255,0,0,0.80)] rotate-[-41.805deg] blur-[34px]"/>
      </div>
      <aside className="pt-10">
        <Link href="#info" className="group cursor-pointer flex items-center gap-2 py-1.5 px-6 rounded-[20px] border border-[#FED7DA] bg-[#FED7DA] shadow-[0px_2px_4px_0px_rgba(244,64,64,0.25),_0px_1px_1px_0px_rgba(162,10,21,0.25)_inset] w-fit mx-auto">
          <p className="text-sm md:text-base">Le projet est 100% open-source ! </p>
          <ArrowRight size={15} className="transition-transform duration-300 ease-in-out group-hover:translate-x-1"/>
        </Link>
        <div className="flex flex-col items-center gap-6 pt-12">
          <h1 className="text-4xl md:text-8xl text-center font-bold max-w-[80%] leading-none bg-gradient-to-r from-[#151414] via-[#151414] to-[#E40514] bg-clip-text text-transparent">Le menu du CROUS en un clic</h1>
          <p className="text-base md:text-xl md:max-w-[70%] text-center font-medium leading-normal">CROUStillant vous permet de consulter les menus des restaurants CROUS de France et d'outre-mer.</p>
          <Link href={"/restaurants"} className=" hover:scale-105 transition-transform duration-300 ease-out text-sm md:text-base rounded-[16px] bg-[#E40514] shadow-[inset_0px_1px_3px_0px_#E40514,_inset_0px_2px_2px_2px_rgba(255,255,255,0.25)] py-3 px-6 text-white">Découvrir votre menu</Link>

        </div>

      </aside>
      <div className="mt-14 w-full bg-black h-[31rem] rounded-xl"/>
    </section>
  );
}
