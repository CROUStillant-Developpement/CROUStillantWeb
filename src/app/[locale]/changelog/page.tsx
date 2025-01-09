"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
// import { Metadata } from "next";
// import { getTranslations } from "next-intl/server";

import { Drill } from "lucide-react";
import ChangelogItem from "./changelog-item";

// export async function generateMetadata(): Promise<Metadata> {
//   const t = await getTranslations("ChangelogPage");

//   return {
//     title: t("seo.title"),
//     description: t("seo.description"),
//     keywords: t("seo.keywords"),
//     openGraph: {
//       title: t("seo.title"),
//       description: t("seo.description"),
//       images: [process.env.WEB_URL + "/banner.png"],
//       siteName: "CROUStillant",
//     },
//   };
// }

const changelogItems = [
  {
    date: "2021-10-10",
    title: "First release",
    version: "v1.0.0",
    shortDescription: "This is a dummy test data for the first release.",
    fullDescription:
      "This is a dummy test data for the first release. It includes initial features and functionalities. Users can now experience the basic functionalities of the app.",
  },
  {
    date: "2021-11-11",
    title: "Second release",
    version: "v1.1.0",
    shortDescription: "This is a dummy test data for the second release.",
    fullDescription:
      "This is a dummy test data for the second release. It includes additional features and improvements to the app. Users can now enjoy a more stable and efficient application.",
  },
  {
    date: "2021-12-12",
    title: "Third release",
    version: "v1.2.0",
    shortDescription: "This is a dummy test data for the third release.",
    fullDescription:
      "This is a dummy test data for the third release. It includes bug fixes and performance enhancements. Users will experience a smoother and faster app.",
  },
  {
    date: "2022-01-01",
    title: "Fourth release",
    version: "v1.3.0",
    shortDescription: "This is a dummy test data for the fourth release.",
    fullDescription:
      "This is a dummy test data for the fourth release. It introduces new features and optimizations. Users can now access more functionalities and enjoy an improved user interface.",
  },
  {
    date: "2022-02-02",
    title: "Fifth release",
    version: "v1.4.0",
    shortDescription: "This is a dummy test data for the fifth release.",
    fullDescription:
      "This is a dummy test data for the fifth release. It focuses on security updates and minor enhancements. Users can feel more secure while using the app.",
  },
  {
    date: "2022-03-03",
    title: "Sixth release",
    version: "v1.5.0",
    shortDescription: "This is a dummy test data for the sixth release.",
    fullDescription:
      "This is a dummy test data for the sixth release. It includes various improvements and new features. Users will benefit from a more robust and feature-rich application.",
  },
];

export default function ChangelogPage() {
  const t = useTranslations("ChangelogPage");
  return (
    <div>
      <h1 className="font-bold text-3xl mb-4">Changelog</h1>
      <Alert className="mb-6">
        <Drill className="h-4 w-4" />
        <AlertTitle>{t("buildInProgress")} 🚧</AlertTitle>
        <AlertDescription>{t("buildInProgressDescription")}</AlertDescription>
      </Alert>
      <div className="-my-6">
        {changelogItems.map((item, index) => (
          <ChangelogItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
