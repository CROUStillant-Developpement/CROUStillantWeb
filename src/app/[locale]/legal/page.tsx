"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function LegalPage() {
  const t = useTranslations("LegalPage");

  return (
    <>
      <div className="mx-auto mt-16 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 lg:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex-1 p-5 lg:p-12">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <h2 className="text-lg font-semibold mt-4">{t("subtitle")}</h2>
          <span>{t("description")}</span>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="#legal" className="text-blue-500 dark:text-blue-400 hover:underline">
              {t("legal.title")}
            </Link>
            <Link href="#privacy" className="text-blue-500 dark:text-blue-400 hover:underline">
              {t("privacy.title")}
            </Link>
            <Link href="#cookies" className="text-blue-500 dark:text-blue-400 hover:underline">
              {t("cookies.title")}
            </Link>
            <Link href="#terms" className="text-blue-500 dark:text-blue-400 hover:underline">
              {t("terms.title")}
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 lg:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex-1 p-5 lg:p-12 scroll-mt-20" id="legal">
          <h1 className="text-2xl font-bold">{t("legal.title")}</h1>
          {["part1", "part2", "part3", "part4", "part5"].map((key) => (
            <>
              <div className="mt-5 mb-10 h-[1px] border-t border-gray-400 dark:border-gray-600 my-4"></div>
              <div key={key} className="mt-4">
                <h2 className="text-lg font-semibold">{t(`legal.${key}.title`)}</h2>
                <div className="flex flex-col mt-2 gap-2">
                  <span>{t(`legal.${key}.content1`)}</span>
                  <span>{t(`legal.${key}.content2`)}</span>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-16 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 lg:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex-1 p-5 lg:p-12 scroll-mt-20" id="privacy">
          <h1 className="text-2xl font-bold">{t("privacy.title")}</h1>
          {["part1", "part2", "part3"].map((key) => (
            <>
              <div className="mt-5 mb-10 h-[1px] border-t border-gray-400 dark:border-gray-600 my-4"></div>
              <div key={key} className="mt-4">
                <h2 className="text-lg font-semibold">{t(`privacy.${key}.title`)}</h2>
                <div className="flex flex-col mt-2 gap-2">
                  <span>{t(`privacy.${key}.content1`)}</span>
                  <span>{t(`privacy.${key}.content2`)}</span>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-16 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 lg:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex-1 p-5 lg:p-12 scroll-mt-20" id="cookies">
          <h1 className="text-2xl font-bold">{t("cookies.title")}</h1>
          {["part1", "part2"].map((key) => (
            <>
              <div className="mt-5 mb-10 h-[1px] border-t border-gray-400 dark:border-gray-600 my-4"></div>
              <div key={key} className="mt-4">
                <h2 className="text-lg font-semibold">{t(`cookies.${key}.title`)}</h2>
                <div className="flex flex-col mt-2 gap-2">
                  <span>{t(`cookies.${key}.content1`)}</span>
                  <span>{t(`cookies.${key}.content2`)}</span>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-16 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 lg:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex-1 p-5 lg:p-12 scroll-mt-20" id="terms">
          <h1 className="text-2xl font-bold">{t("terms.title")}</h1>
          {["part1", "part2", "part3", "part4", "part5"].map((key) => (
            <>
              <div className="mt-5 mb-10 h-[1px] border-t border-gray-400 dark:border-gray-600 my-4"></div>
              <div key={key} className="mt-4">
                <h2 className="text-lg font-semibold">{t(`terms.${key}.title`)}</h2>
                <div className="flex flex-col mt-2 gap-2">
                  <span>{t(`terms.${key}.content1`)}</span>
                  <span>{t(`terms.${key}.content2`)}</span>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
