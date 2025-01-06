"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  CheckIcon,
  HeartHandshake,
  ExternalLinkIcon,
  GraduationCap,
  FileCode2,
  Soup,
  CookingPot,
  Bot,
  Globe,
  Code,
  Database,
  FileTerminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

function Checkmark() {
  return (
    <CheckIcon className="h-7 w-7 flex-none rounded-full bg-green-500 p-1 text-black dark:bg-green-400" />
  );
}

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <>
      <div className="mx-auto lg:mt-36 mt-20 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 lg:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex-1 p-2 lg:p-12">
          <div className="flex flex-col justify-center lg:p-12 py-4 px-2">
            <h3 className="lg:text-4xl text-xl font-medium">
              <GraduationCap className="inline h-10 w-10 mr-3"></GraduationCap>
              {t("presentation.title")}
            </h3>
            <p className="mt-4 lg:text-lg">
              {t("presentation.description")}
            </p>
          </div>
          <hr />
          <div className="flex flex-col justify-center lg:p-12 p-2">
            <h3 className="lg:text-4xl text-xl font-medium">
              <Soup className="inline h-10 w-10 mr-3" />
              {t("updates.title")}
            </h3>
            <p className="mt-4 lg:text-lg">
              {t("updates.description")}
            </p>
          </div>
        </div>
        <div className="mx-2 h-[1px] border-t lg:h-[unset] lg:w-[1px] lg:border-l lg:border-t-0"></div>
        <div className="flex-1 p-2 lg:p-12">
          <div className="flex flex-col justify-center lg:p-12 py-4 px-2">
            <h3 className="lg:text-4xl text-xl font-medium">
              <FileCode2 className="inline h-10 w-10 mr-3" />
              {t("open-source.title")}
            </h3>
            <p className="mt-4 lg:text-lg">
              {t("open-source.description")}
            </p>
            <div className="mt-14 w-full">
              <div className="flex items-center">
                <Checkmark />
                <p className="ml-2">
                  {t("open-source.features.feature1")}
                </p>
              </div>
              <div className="mt-5 flex items-center">
                <Checkmark />
                <p className="ml-2">
                  {t("open-source.features.feature2")}
                </p>
              </div>
              <div className="mt-5 flex items-center">
                <Checkmark />
                <p className="ml-2">
                  {t("open-source.features.feature3")}
                </p>
              </div>
              <div className="mt-5 flex items-center">
                <Checkmark />
                <p className="ml-2">
                  {t("open-source.features.feature4")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto lg:mt-36 mt-20 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 xl:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col justify-center p-4 py-6 lg:p-12 xl:w-1/2">
          <h2 className="lg:text-4xl text-xl font-medium">
            {t("product.title")}
          </h2>
          <p className="mt-4 lg:text-lg">
            {t("product.description")}
          </p>
          <div className="mt-8 w-full">
            <div className="flex items-center">
              <Checkmark />
              <p className="ml-2">
                {t("product.features.feature1")}
              </p>
            </div>
            <div className="mt-4 flex items-center">
              <Checkmark />
              <p className="ml-2">
                {t("product.features.feature2")}
              </p>
            </div>
            <div className="mt-4 flex items-center">
              <Checkmark />
              <p className="ml-2">
                {t("product.features.feature3")}
              </p>
            </div>
            <div className="mt-4 flex items-center">
              <Checkmark />
              <p className="ml-2">
                {t("product.features.feature4")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center xl:w-1/2 xl:object-right">
          <Image
            width={1350}
            height={900}
            src="/previews/homepage.png"
            alt="Menu Preview"
            className="rounded-md object-contain"
          />
        </div>
      </div>
      <div
        className="mx-auto lg:mt-36 mt-12 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 lg:flex-row border border-gray-200 dark:border-gray-800 scroll-mt-32"
        id="team"
      >
        <div className="flex flex-col justify-center p-4 py-6 lg:p-12 lg:w-1/2">
          <h2 className="lg:text-4xl text-xl font-medium">
            {t("team.title")}
          </h2>
          <p className="mt-4 lg:text-lg">
            {t("team.description")}
          </p>
        </div>
        <div className="mx-2 h-[1px] border-t lg:h-[unset] lg:w-[1px] lg:border-l lg:border-t-0"></div>
        <div className="flex flex-col justify-center p-4 py-6 lg:p-12 lg:w-1/2">
          <div className="mt-8 w-full">
            <div className="flex items-center">
              <FileTerminal className="h-7 w-7 flex-none rounded-full bg-gray-300 p-1 text-black dark:bg-gray-400" />
              <div className="flex flex-col ml-2">
                <p className="ml-2 font-semibold">
                  {t("team.members.member1.name")}
                </p>
                <p className="ml-2">
                  {t("team.members.member1.role")}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Code className="h-7 w-7 flex-none rounded-full bg-gray-300 p-1 text-black dark:bg-gray-400" />
              <div className="flex flex-col ml-2">
                <p className="ml-2 font-semibold">
                  {t("team.members.member2.name")}
                </p>
                <p className="ml-2">
                  {t("team.members.member2.role")}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Database className="h-7 w-7 flex-none rounded-full bg-gray-300 p-1 text-black dark:bg-gray-400" />
              <div className="flex flex-col ml-2">
                <p className="ml-2 font-semibold">
                  {t("team.members.member3.name")}
                </p>
                <p className="ml-2">
                  {t("team.members.member3.role")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto lg:mt-36 mt-20 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 xl:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center object-left xl:w-1/2">
          <Image
            width={1350}
            height={900}
            src="/previews/menu.png"
            alt="Menu Preview"
            className="rounded-md object-contain"
          />
        </div>
        <div className="flex flex-col justify-center p-4 py-6 lg:p-12 xl:w-1/2">
          <h2 className="lg:text-4xl text-xl font-medium">
            {t("discord.title")}
          </h2>
          <p className="mt-4 lg:text-lg">
            {t("discord.description")}
          </p>
          <div className="relative">
            <Link
              href="https://discord.com/oauth2/authorize?client_id=1024564077068025867"
              target="_blank"
            >
              <Button className="mt-8">
                <Bot className="inline mr-1" />
                {t("discord.button")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto lg:mt-36 mt-20 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 xl:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col justify-center p-4 py-6 lg:p-12 xl:w-1/2">
          <h2 className="lg:text-4xl text-xl font-medium">
            {t("integrated.title")}
          </h2>
          <p className="mt-4 lg:text-lg">
            {t("integrated.description")}
          </p>
          <div className="relative">
            <Link href="https://api-croustillant.bayfield.dev" target="_blank">
              <Button className="mt-8">
                <Globe className="inline mr-1" />
                {t("integrated.button")}
              </Button>
            </Link>
          </div>
        </div>
        <div className="xl:w-1/2 xl:object-left flex items-center justify-center">
          <Image
            width={1350}
            height={900}
            src="/previews/api.png"
            alt="Menu Preview"
            className="rounded-md object-cover "
          />
        </div>
      </div>
      <div className="mx-auto lg:mt-36 mt-20 flex w-full flex-col shadow md:w-5/6 md:rounded-md lg:w-3/4 lg:flex-row border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col justify-center p-4 py-6 lg:p-12 lg:w-1/2">
          <h3 className="lg:text-4xl text-xl font-medium">
            {t("convinced.title")}
          </h3>
          <p className="mt-4 lg:text-lg">
            {t("convinced.description")}
          </p>
          <div className="flex flex-wrap gap-2 mt-8">
            <Button asChild>
              <Link href="/restaurants" prefetch={true}>
                <CookingPot className="inline mr-1" />
                {t("convinced.button")}
              </Link>
            </Button>
            <Button asChild>
              <Link href="https://discord.com/oauth2/authorize?client_id=1024564077068025867">
                <Bot className="inline mr-1" />
                {t("convinced.button2")}
              </Link>
            </Button>
          </div>
        </div>
        <div className="mx-2 h-[1px] border-t lg:h-[unset] lg:w-[1px] lg:border-l lg:border-t-0"></div>
        <div className="flex flex-col justify-center p-4 py-6 lg:p-12 lg:w-1/2">
          <h3 className="lg:text-4xl text-xl font-medium">
            <HeartHandshake className="inline h-10 w-10 mr-3" />
            {t("more-convinced.title")}
          </h3>
          <p className="mt-4 lg:text-lg">
            {t("more-convinced.description")}
          </p>
          <div className="relative mt-8 flex">
            <Link
              href="https://discord.gg/yG6FjqbWtk"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button variant="outline">
                {t("more-convinced.button")}
                <ExternalLinkIcon className="ml-4 h-4 w-4 opacity-50" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
