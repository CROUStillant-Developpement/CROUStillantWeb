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
            <h2 className="2xl:mt-28 lg:text-6xl lg:text-center lg:max-w-[80%] lg:mx-auto text-3xl font-bold leading-tight bg-gradient-to-r from-[#151414] via-[#151414] to-[#E40514] dark:bg-[linear-gradient(90deg,_#FAFAFA_13.49%,_#E40514_87.52%)] bg-clip-text text-transparent">{t("title")}</h2>
            <aside className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 lg:mt-10">
                <BasicCard
                    title={t("card1.title")}
                    description={t("card1.description")}
                    CTA={t("card1.CTA")}
                    CTALink="about"
                >
                    <MapPin height={200} width={125} color="#555555" opacity={0.1} className="dark:opacity-30"/>
                </BasicCard>
                <BasicCard
                    title={t("card2.title")}
                    description={t("card2.description")}
                    CTA={t("card2.CTA")}
                    CTALink="about"
                >
                    <Clock height={200} width={125} color="#555555" opacity={0.1} className="dark:opacity-30" />
                </BasicCard>
                <BasicCard
                    title={t("card3.title")}
                    description={t("card3.description")}
                    CTA={t("card3.CTA")}
                    CTALink="about"
                >
                    <CreditCard height={200} width={125} color="#555555" opacity={0.1} className="dark:opacity-30" />
                </BasicCard>
                <BasicCard
                    title={t("card4.title")}
                    description={t("card4.description")}
                    CTA={t("card4.CTA")}
                    CTALink="fr/about"
                    style={" md:bg-[#DAD6D6] md:bg-opacity-15 dark:bg-[rgba(218,214,214,0.08)]"}
                >
                    <ForkKnifeCrossed height={200} width={125} color="#555555" opacity={0.1} className="dark:opacity-30" />
                </BasicCard>
            </aside>
        </section>
    )
}
export default InfoCards