import { getLocale, getTranslations } from "next-intl/server";
import Logo from "./logo";
import { Link } from "@/i18n/routing";
import { Badge } from "./ui/badge";
import AccessibilityButton from "./accessibility-button";
import { getStats } from "@/services/umami-service";
import { cn } from "@/lib/utils";
import FavQuickAccess from "./fav-quick-access";

export default async function Footer() {
  const t = await getTranslations("Footer");

  const stats = await getStats();

  const locale = await getLocale();
  let localeString = "fr-FR";
  if (locale === "en") {
    localeString = "en-GB";
  }

  return (
    <footer className="w-full px-8 lg:px-24 flex flex-col items-center">
      <div className={cn(
        "w-full bg-secondary/40 backdrop-blur-md border border-border/20 rounded-t-[2.5rem] shadow-xl p-8 md:p-12 relative overflow-hidden"
      )}>
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group transition-all duration-300">
                <Logo />
                <h1 className="text-2xl font-bold opacity-90 group-hover:opacity-100 transition-opacity">CROUStillant</h1>
              </Link>
              <Link href="/changelog">
                <Badge variant="version" className="animate-appear text-xs">
                  Version {process.env.VERSION}
                </Badge>
              </Link>
            </div>

            <div className="flex gap-4">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/CROUStillant-Developpement"
                className="p-2 rounded-xl bg-background/50 hover:bg-background transition-all border border-border/10 hover:border-primary/30"
              >
                <svg
                  className="fill-current w-5 h-5"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://discord.gg/yG6FjqbWtk"
                className="p-2 rounded-xl bg-background/50 hover:bg-background transition-all border border-border/10 hover:border-primary/30"
              >
                <svg
                  className="fill-current w-5 h-5"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Discord</title>
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/company/croustillant-menu"
                className="p-2 rounded-xl bg-background/50 hover:bg-background transition-all border border-border/10 hover:border-primary/30"
              >
                <svg
                  className="fill-current w-5 h-5"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>LinkedIn</title>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v5.759z" />
                </svg>
              </Link>
            </div>

            <p className="text-sm opacity-70 leading-relaxed italic">
              {t("disclaimer")}
            </p>
          </div>

          <div className="flex flex-wrap gap-10 md:gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-bold opacity-40 uppercase tracking-widest">
                {t("links.discover.title")}
              </h2>
              <ul className="flex flex-col gap-2 text-sm font-medium">
                <li>
                  <FavQuickAccess text={t("links.discover.meals")} />
                </li>
                <li>
                  <Link href="/restaurants" className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block">
                    {t("links.discover.restaurants")}
                  </Link>
                </li>
                <li>
                  <Link href="/dishes" className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block">
                    {t("links.discover.dishes")}
                  </Link>
                </li>
                <li>
                  <Link href="/stats" className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block">
                    {t("links.discover.stats")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-bold opacity-40 uppercase tracking-widest">
                {t("links.about.title")}
              </h2>
              <ul className="flex flex-col gap-2 text-sm font-medium">
                <li>
                  <Link href="/about" className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block">
                    {t("links.about.project")}
                  </Link>
                </li>
                <li>
                  <Link href="/about#team" className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block">
                    {t("links.about.team")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block">
                    {t("links.about.contact")}
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block">
                    {t("links.about.legal")}
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block">
                    {t("links.about.changelog")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-bold opacity-40 uppercase tracking-widest">
                {t("links.resources.title")}
              </h2>
              <ul className="flex flex-col gap-2 text-sm font-medium">
                <li>
                  <Link
                    href="https://api.croustillant.menu"
                    className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block"
                    target="_blank"
                  >
                    {t("links.resources.api")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/CROUStillant-Developpement"
                    className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block"
                    target="_blank"
                  >
                    {t("links.resources.documentation")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.com/oauth2/authorize?client_id=1024564077068025867"
                    className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block"
                    target="_blank"
                  >
                    {t("links.resources.discord")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://uptime.bayfield.dev/status/croustillant"
                    className="opacity-70 hover:opacity-100 hover:translate-x-1 transition-all inline-block"
                    target="_blank"
                  >
                    {t("links.resources.status")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
            <div className="flex flex-col gap-2 opacity-70">
              <p className="font-semibold">{t("authors")}</p>
              {stats.success && (
                <p>
                  {t.rich("visits", {
                    strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
                    visitors: (stats.data.visitors ?? 0).toLocaleString(
                      localeString
                    ),
                    pageviews: Math.max(0, Math.floor(Number(stats.data.pageviews) || 0)).toLocaleString(
                      localeString
                    ),
                  })}
                </p>
              )}
              <p className="font-medium">
                {t("copyright", { year: new Date().getFullYear() })}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 opacity-60 font-medium">
              <AccessibilityButton />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
