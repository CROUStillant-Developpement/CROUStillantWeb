"use client";

import {
  Clock,
  CreditCard,
  ForkKnifeCrossed,
  MapPin,
  HeartHandshakeIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import HomeCard from "./home-card";
import { Link } from "@/i18n/routing";

interface CardProps {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  style?: string;
  children: React.ReactNode;
}

function BasicCard({
  title,
  description,
  cta,
  ctaLink,
  style,
  children,
}: CardProps) {
  return (
    <aside
      className={`${style} relative flex items-center min-h-[160px] h-full w-full overflow-hidden border-2 border-[#555] border-opacity-5 bg-[#FAFAFA] dark:bg-[#151414] dark:border-[rgba(85,85,85,0.35)] rounded-xl p-4 md:p-6`}
    >
      <div className="flex flex-col w-full max-w-[80%] h-fit gap-4 ">
        <div className="flex flex-col gap-1">
          <h3 className="bg-gradient-to-r from-[#e40514] to-[#ff6868] dark:linear-gradient(to right, #E40514 0%, #FF7474 100%) bg-clip-text text-transparent text-2xl font-bold">
            {title}
          </h3>
          <p className="text-base">{description}</p>
        </div>
        <Link href={`/${ctaLink}`} className="text-sm font-bold underline">
          {cta}
        </Link>
      </div>
      <div className="absolute -right-16">{children}</div>
    </aside>
  );
}

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <>
      <section id="info" className="mt-32">
        <h2 className="2xl:mt-28 lg:text-6xl lg:text-center lg:max-w-[80%] lg:mx-auto text-3xl font-bold leading-tight bg-gradient-to-r from-[#151414] via-[#151414] to-[#E40514] dark:bg-[linear-gradient(90deg,_#FAFAFA_13.49%,_#E40514_87.52%)] bg-clip-text text-transparent">
          {t("title.second")}
        </h2>
        <aside className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 lg:mt-10">
          <BasicCard
            title={t("card1.title")}
            description={t("card1.description")}
            cta={t("card1.cta")}
            ctaLink="about"
          >
            <MapPin
              height={200}
              width={125}
              color="#555555"
              opacity={0.1}
              className="dark:opacity-30"
            />
          </BasicCard>
          <BasicCard
            title={t("card2.title")}
            description={t("card2.description")}
            cta={t("card2.cta")}
            ctaLink="about"
          >
            <Clock
              height={200}
              width={125}
              color="#555555"
              opacity={0.1}
              className="dark:opacity-30"
            />
          </BasicCard>
          <BasicCard
            title={t("card3.title")}
            description={t("card3.description")}
            cta={t("card3.cta")}
            ctaLink="about"
          >
            <CreditCard
              height={200}
              width={125}
              color="#555555"
              opacity={0.1}
              className="dark:opacity-30"
            />
          </BasicCard>
          <BasicCard
            title={t("card4.title")}
            description={t("card4.description")}
            cta={t("card4.cta")}
            ctaLink="about"
            style={
              " md:bg-[#DAD6D6] md:bg-opacity-15 dark:bg-[rgba(218,214,214,0.08)]"
            }
          >
            <ForkKnifeCrossed
              height={200}
              width={125}
              color="#555555"
              opacity={0.1}
              className="dark:opacity-30"
            />
          </BasicCard>
        </aside>
      </section>
      <section id="team" className="flex flex-col gap-6 lg:gap-10 ">
        <h2 className="mt-32 lg:text-6xl lg:text-center lg:max-w-[60%] lg:mx-auto text-3xl font-bold leading-tight bg-gradient-to-r from-[#151414] via-[#151414] to-[#E40514] dark:bg-[linear-gradient(90deg,_#FAFAFA_13.49%,_#E40514_87.52%)] bg-clip-text text-transparent ">
          {t("title.third")}
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-2 mb-32 gap-6">
          <HomeCard />
        </section>
      </section>
      <section>
        <div className="flex flex-col items-center justify-center w-full px-6 mx-auto py-20 rounded-[20px] border-2 border-[rgba(255,255,255,0.70)] dark:border-[rgba(21,20,20,0.7)] bg-[linear-gradient(113deg,_rgba(255,255,255,0.62)_0%,_rgba(255,255,255,0.20)_110.84%)]  dark:bg-[linear-gradient(113deg,_#222222_100%,_#191818_110.84%)] backdrop-blur-[21px]">
          <div className="mb-5 w-fit h-fit p-6 flex items-center justify-center rounded-[30px] border border-[#FF9595] bg-[radial-gradient(50%_50%_at_50%_50%,_#FF4646_0%,_rgba(255,71,71,0.80)_100%)] shadow-[inset_-6px_-3px_10px_0px_#FFD7D7] dark:shadow-[inset_-6px_-3px_10px_0px_#464646]">
            <HeartHandshakeIcon color="white" size={75} />
          </div>
          <div className="flex flex-col justify-center items-center text-center gap-3">
            <p className="bg-gradient-to-r from-[#e40514] to-[#9e2020] dark:bg-[linear-gradient(90deg,_#FAFAFA_13.49%,_#E40514_87.52%)] bg-clip-text text-transparent font-bold text-4xl md:text-5xl">
              {t("footer.title")}
            </p>
            <p className="text-center text-base md:text-lg max-w-96">
              {t("footer.subtitle")}
            </p>
          </div>
          <Link
            href={"/restaurants"}
            className="mt-9 hover:scale-105 transition-transform duration-300 ease-out text-sm md:text-base rounded-[16px] bg-[#E40514] shadow-[inset_0px_1px_3px_0px_#E40514,_inset_0px_2px_2px_2px_rgba(255,255,255,0.25)] py-3 px-6 text-white"
          >
            {t("cta.first")}
          </Link>
        </div>
      </section>
    </>
  );
}
