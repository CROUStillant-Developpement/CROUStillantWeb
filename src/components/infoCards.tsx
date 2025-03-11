import { Clock, CreditCard, ForkKnifeCrossed, MapPin } from "lucide-react"
import BasicCard from "./cards/basicCard"
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("HomePage");
  
    return {
      title: t("seo.title"),
      description: t("seo.description"),
      keywords: t("seo.keywords"),
      openGraph: {
        title: t("seo.title"),
        description: t("seo.description"),
        images: { url: process.env.WEB_URL + "/banner.png" },
        siteName: "CROUStillant",
      },
    };
  }
  

const InfoCards = async () => {
    const t = await getTranslations("InfoCard");

    return(
        <section id="#info" className="mt-32">
            <h2 className="2xl:mt-28 lg:text-6xl lg:text-center lg:max-w-[80%] lg:mx-auto text-3xl font-bold leading-tight bg-gradient-to-r from-[#151414] via-[#151414] to-[#E40514] bg-clip-text text-transparent">{t("title")}</h2>
            <aside className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 lg:mt-10">
                <BasicCard
                    title={t("card1.title")}
                    description={t("card1.description")}
                    CTA={t("card1.title")}
                    CTALink="/"
                >
                    <MapPin height={200} width={125} color="#555555" opacity={0.1} />
                </BasicCard>
                <BasicCard
                    title={t("card2.title")}
                    description={t("card2.description")}
                    CTA={t("card2.title")}
                    CTALink="/"
                >
                    <Clock height={200} width={125} color="#555555" opacity={0.1} />
                </BasicCard>
                <BasicCard
                    title={t("card3.title")}
                    description={t("card3.description")}
                    CTA={t("card3.title")}
                    CTALink="/"
                >
                    <CreditCard height={200} width={125} color="#555555" opacity={0.1} />
                </BasicCard>
                <BasicCard
                    title={t("card4.title")}
                    description={t("card4.description")}
                    CTA={t("card4.title")}
                    CTALink="/"
                    style={" md:bg-[#DAD6D6] md:bg-opacity-15"}
                >
                    <ForkKnifeCrossed height={200} width={125} color="#555555" opacity={0.1} />
                </BasicCard>
            </aside>
        </section>
    )
}
export default InfoCards