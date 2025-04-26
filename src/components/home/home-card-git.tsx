import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface Props {
  style?: string;
}

export default function GitCard({ style }: Props) {
  const t = useTranslations("HomeCard.GitCard");
  const members = [
    {
      id: 1,
      name: "Paul Bayfield",
    },
    {
      id: 2,
      name: "Alden Cherif",
    },
    {
      id: 3,
      name: "Lucas Debeve",
    },
    {
      id: 4,
      name: "Louis Descotes"
    }
  ];

  return (
    <section className={`${style}`}>
      <aside className="flex flex-col w-full h-full gap-6 py-4 px-3.5 bg-[#FAFAFA] dark:bg-[rgba(218,214,214,0.08)] rounded-[8px] border-2 border-[#555555] border-opacity-[7%]">
        <div className="flex flex-col gap-2">
          <p className="bg-gradient-to-r from-[#e40514] to-[#9e2020] dark:linear-gradient(to right, #E40514 0%, #FF7474 100%) bg-clip-text text-transparent font-bold text-2xl">
            {t("title")}
          </p>
          <p className="text-base">{t("subtitle")}</p>
          <Link
            href="https://github.com/CROUStillant-Developpement"
            className="underline text-base font-bold"
          >
            {t("cta")}
          </Link>
        </div>
        <section className="flex items-center justify-center w-full h-full bg-[#F8E9E9] dark:bg-[rgba(70,70,70,0.40)] bg-opacity-40 rounded-xl p-2 overflow-hidden">
          <aside className="flex flex-col gap-6 md:gap-4 px-3 py-1 border border-[#FFCACA] border-opacity-40 dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(36,36,36,0.6)_0%,rgba(1,1,1,0.18)_100%)] w-full h-full rounded-[8px]">
            <div className="flex justify-between items-center w-full">
              <p className="text-lg font-medium opacity-80">{t("Card.name")}</p>
            </div>
            {members.map((member) => (
              <div className="flex items-start justify-between w-full" key={member.id}>
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center pl-1.5 mr-2">
                    <div className="absolute size-2 rounded-full bg-blue-500" />
                    <div className="absolute size-3 rounded-full bg-blue-500 animate-scan" />
                  </div>
                  <p className="text-sm md:text-lg font-medium">{member.name}</p>
                </div>
              </div>
            ))}
          </aside>
        </section>
      </aside>
    </section>
  );
}
