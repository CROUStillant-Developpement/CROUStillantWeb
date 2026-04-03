import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";
import { ArrowRight } from "lucide-react";

interface Props {
  style?: string;
}

export default function GitCard({ style }: Props) {
  const t = useTranslations("HomeCard.GitCard");
  const umami = useUmami();

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
      name: "Louis Descotes",
    },
    {
      id: 5,
      name: "Audric Fullhardt",
    },
  ];

  return (
    <section className={style}>
      <aside className="flex flex-col w-full h-full gap-6 p-8 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs">
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
            {t("title")}
          </h3>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            {t("subtitle")}
          </p>
          <Link
            href="https://github.com/CROUStillant-Developpement"
            className="text-base font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all inline-flex items-center gap-2 w-fit group/link"
            onClick={() => {
              umami.event("Home.Join.GitHub");
            }}
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
        <section className="flex items-center justify-center w-full h-full bg-background/50 backdrop-blur-xs rounded-3xl border border-primary/10 p-6 overflow-hidden">
          <aside className="flex flex-col gap-6 w-full h-full">
            <div className="flex justify-between items-center w-full">
              <p className="text-xl font-black tracking-tight text-primary/80 uppercase">{t("Card.name")}</p>
            </div>
            <div className="flex flex-col gap-4">
              {members.map((member) => (
                <div
                  className="flex items-start justify-between w-full"
                  key={member.id}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center pl-1.5 mr-2">
                      <div className="absolute size-2 rounded-full bg-blue-500" />
                      <div className="absolute size-3 rounded-full bg-blue-500 animate-scan" />
                    </div>
                    <p className="text-sm md:text-lg font-medium">
                      {member.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </aside>
    </section>
  );
}
