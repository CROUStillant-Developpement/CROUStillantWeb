import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { FishOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 md:px-6">
      <FishOff className="h-20 w-20 text-gray-500 dark:text-gray-400" />
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        {t("title")}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
        {t("description")}
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">{t("cta")}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/contact">{t("report")}</Link>
        </Button>
      </div>
    </div>
  );
}
