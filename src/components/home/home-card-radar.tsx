import { School, UtensilsCrossed, ArrowRight } from "lucide-react";
import { RadarsIcons } from "../ui/radarsIcon";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";

interface Props {
  style?: string;
}

export default function RadarsCard({ style }: Props) {
  const t = useTranslations("HomeCard.RadarsCard");
  const umami = useUmami();

  return (
    <section className={style}>
      <aside className="group flex flex-col w-full h-full gap-6 p-8 bg-secondary/30 rounded-[2rem] border border-border/50 transition-all hover:bg-secondary/40 hover:shadow-xl hover:shadow-primary/5">
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
              umami.event("Home.Contribute.GitHub");
            }}
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
        <aside className="overflow-hidden relative flex items-center justify-center w-full h-72 bg-background/50 backdrop-blur-sm rounded-3xl border border-primary/10">
          <RadarsIcons
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              zIndex: "5",
            }}
          >
            <UtensilsCrossed color="white" />
          </RadarsIcons>
          <RadarsIcons
            style={{
              position: "absolute",
              bottom: "80px",
              right: "76%",
              zIndex: "5",
            }}
          >
            <UtensilsCrossed color="white" />
          </RadarsIcons>
          <RadarsIcons
            style={{
              position: "absolute",
              bottom: "15px",
              right: "25px",
              zIndex: "5",
            }}
          >
            <UtensilsCrossed color="white" />
          </RadarsIcons>
          <RadarsIcons
            style={{
              position: "absolute",
              bottom: "0px",
              left: "35px",
              zIndex: "5",
            }}
          >
            <UtensilsCrossed color="white" />
          </RadarsIcons>
          <RadarsIcons
            style={{
              position: "absolute",
              top: "15px",
              right: "85px",
              zIndex: "5",
            }}
          >
            <UtensilsCrossed color="white" />
          </RadarsIcons>
          <RadarsIcons
            style={{
              position: "absolute",
              top: "40px",
              right: "5px",
              zIndex: "5",
            }}
          >
            <UtensilsCrossed color="white" />
          </RadarsIcons>
          <RadarsIcons big style={{ position: "absolute", zIndex: "10" }}>
            <School className="size-12" color="white" />
          </RadarsIcons>
          <div className="z-[3] absolute rounded-full border-2 border-[#ffb9b9] bg-[radial-gradient(circle_at_center,_#ffd1d1_0%,_#ffbfbf_100%)] dark:bg-[radial-gradient(59.17%_59.17%_at_50%_50%,#464646_0%,#0D0A0A_100%)] size-44" />
          <div className="z-[2] absolute rounded-full border-2 border-[rgba(251,174,174,0.6)] bg-[radial-gradient(circle_at_center,_rgba(248,233,233,0.8)_0%,_rgba(255,201,201,0.8)_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(70,70,70,0.8)_0%,rgba(26,25,25,0.8)_100%)] size-72" />
          <div className="z-[1] absolute rounded-full border-2 border-[rgba(255,202,202,0.4)] bg-[radial-gradient(circle_at_center,_rgba(248,233,233,0.6)_0%,_rgba(255,221,221,0.6)_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(70,70,70,0.6)_0%,rgba(29,23,23,0.6)_100%)] size-[430px]" />
          <div className="z-[4] absolute animate-scan bg-[#ff46466a] rounded-full size-[500px]" />
        </aside>
      </aside>
    </section>
  );
}
