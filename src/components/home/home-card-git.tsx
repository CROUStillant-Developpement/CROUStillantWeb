import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface Props {
  style?: string;
}

export default function GitCard({ style }: Props) {
  const t = useTranslations("HomeCard.GitCard");
  const activitiesData = [
    {
      id: 1,
      name: "Paul Bayfield",
      role: "Développeur Back",
      time: "20s",
      pushedTo: "CROUStillantAPI",
    },
    {
      id: 2,
      name: "Alden Cherif",
      role: "Développeur Web",
      time: "5m",
      pushedTo: "CROUStillantWeb",
    },
    {
      id: 3,
      name: "Lucas Debeve",
      role: "Développeur BDD",
      time: "12day",
      pushedTo: "CROUStillant",
    },
  ];

  return (
    <section className={`${style}`}>
      <aside className="flex flex-col w-full h-full max-h-[30rem] gap-6 py-4 px-3.5 bg-[#FAFAFA] dark:bg-[rgba(218,214,214,0.08)] rounded-[8px] border-2 border-[#555555] border-opacity-[7%]">
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
        <section className="relative flex items-center justify-center w-full h-full bg-[#F8E9E9] dark:bg-[rgba(70,70,70,0.40)] bg-opacity-40 rounded-xl p-2 overflow-hidden">
          <aside className="overflow-hidden flex flex-col gap-6 md:gap-4 px-3 py-1 border border-[#FFCACA] border-opacity-40 dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(36,36,36,0.6)_0%,rgba(1,1,1,0.18)_100%)] w-full h-full rounded-[8px]">
            <div className="flex justify-between items-center w-full">
              <p className="text-lg font-medium opacity-80">{t("Card.name")}</p>
              <p className="text-xs font-medium opacity-80">
                {t("Card.seeMore")}
              </p>
            </div>
            {activitiesData.slice(0, 2).map((activity) => (
              <GitActivity key={activity.id} activity={activity} />
            ))}
            <div className="hidden md:block">
              {activitiesData.slice(2).map((activity) => (
                <GitActivity key={activity.id} activity={activity} />
              ))}
            </div>
          </aside>
        </section>
      </aside>
    </section>
  );
}

interface Activity {
  id: number;
  name: string;
  role: string;
  time: string;
  pushedTo: string;
}

interface GitActivityProps {
  activity: Activity;
}

function GitActivity({ activity }: GitActivityProps) {
  return (
    <article className="flex flex-col gap-2 md:gap-1">
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col md:flew-row md:items-center gap-1.5 md:gap-3">
          <div className="px-2 py-1 rounded-[8px] bg-gray-300 dark:bg-[rgba(85,85,85,0.20)] text-sm font-medium">
            {activity.role}
          </div>
          <p className="font-medium text-lg">{activity.name}</p>
        </div>
        <p className="hidden sm:block text-base opacity-80">{activity.time}</p>
      </div>
      <p className="font-medium text-base opacity-80">
        Pushed to {activity.pushedTo}
      </p>
    </article>
  );
}
