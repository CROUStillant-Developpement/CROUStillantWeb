import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface Props {
    style?: string;
}

const ApiCard = async ({ style }: Props) => {
    const t = await getTranslations("ApiCard");

    return (
        <section className={`${style}`}>
            <aside className=" flex flex-col md:flex-row w-full h-full gap-6 py-4 px-3.5 bg-[#FAFAFA] dark:bg-[rgba(218,214,214,0.08)] rounded-[8px] border-2 border-[#555555] border-opacity-[7%] ">
                <div className="flex flex-col gap-2">
                    <p className="bg-gradient-to-r from-[#e40514] to-[#9e2020] dark:linear-gradient(to right, #E40514 0%, #FF7474 100%) bg-clip-text text-transparent font-bold text-2xl">
                    {t("title")}
                    </p>
                    <p className="text-base">
                        {t("subtitle")}
                    </p>
                    <Link href="/https://api-croustillant.bayfield.dev/" className="underline text-base font-bold">
                        {t("CTA")}
                    </Link>
                </div>
                <section className="relative flex items-center justify-center w-full h-fit bg-[#F8E9E9] dark:bg-[rgba(70,70,70,0.40)] bg-opacity-40 rounded-xl overflow-hidden py-2.5">
                    <aside className="overflow-hidden translate-x-4 flex flex-col justify-between  px-3 py-1 w-full h-full ">
                        <div className="flex gap-2 items-center w-fullborder border border-r-0 border-b-0 rounded-bl-none dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(36,36,36,0.6)_0%,rgba(1,1,1,0.18)_100%)] border-[#FFCACA] border-opacity-40 rounded-[8px] pt-2 pl-2 pb-2 ">
                            <p className="text-lg font-medium opacity-80 ">{t("Card.title")}</p>
                            <div className="relative flex items-center justify-center pl-1.5">
                                <div className=" absolute size-2 rounded-full bg-green-500 "/>
                                <div className=" absolute size-3 rounded-full bg-green-500 animate-scan"/>
                            </div>
                        </div>
                        <div className="flex items-center w-fullborder border border-r-0 rounded-l-none dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(36,36,36,0.6)_0%,rgba(1,1,1,0.18)_100%)] border-[#FFCACA] border-opacity-40 rounded-[8px] pt-2 pl-2 pb-2 ">
                            <p className="text-sm md:text-lg font-medium ">https://api-croustillant.bayfield.dev</p>
                        </div>
                        <div className="flex items-center w-fullborder border border-r-0 border-t-0 rounded-tl-none dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(36,36,36,0.6)_0%,rgba(1,1,1,0.18)_100%)] border-[#FFCACA] border-opacity-40 rounded-[8px] pt-2 pl-2 pb-2">
                            <p className="text-xs md:text-base font-medium opacity-60">{t("Card.subtitle")}</p>
                        </div>
                    </aside>
                </section>
            </aside>
        </section>
    );
}
export default ApiCard;