"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plat } from "@/services/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface DishesPageProps {
  top100Dishes: Plat[];
  last100Dishes: Plat[];
}

export default function DishesPage({
  top100Dishes,
  last100Dishes,
}: DishesPageProps) {
  const [searchTop100, setSearchTop100] = useState("");
  const [searchLast100, setSearchLast100] = useState("");

  const t = useTranslations("DishesPage");

  const filteredDataTop100 = top100Dishes.filter((item) =>
    item.libelle.toLowerCase().includes(searchTop100.toLowerCase())
  );

  const filteredDataLast100 = last100Dishes.filter((item) =>
    item.libelle.toLowerCase().includes(searchLast100.toLowerCase())
  );

  return (
    <>
      <div className="flex gap-2 justify-center mt-6 md:hidden">
        <Button>
          <Link href="#top100">{t("top100")}</Link>
        </Button>
        <Button>
          <Link href="#last100">{t("last100")}</Link>
        </Button>
      </div>
      <div className="flex gap-2 mx-auto flex-wrap w-full">
        <Card className="flex-1 h-fit" id="top100">
          <CardHeader>
            <CardTitle>{t("top100")}</CardTitle>
            <CardDescription>{t("top100Description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder={t("search")}
              value={searchTop100}
              onChange={(e) => setSearchTop100(e.target.value)}
            />
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:flex items-center">
                    {t("ranking")}
                  </TableHead>
                  <TableHead>{t("occurrences")}</TableHead>
                  <TableHead>{t("label")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDataTop100.map((item, index) => (
                  <TableRow key={item.code}>
                    <TableCell className="hidden md:flex items-center">
                      n°{index + 1}
                    </TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>{item.libelle}</TableCell>
                  </TableRow>
                ))}
                {filteredDataTop100.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="flex-1 h-fit" id="last100">
          <CardHeader>
            <CardTitle>{t("last100")}</CardTitle>
            <CardDescription>{t("last100Description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder={t("search")}
              value={searchLast100}
              onChange={(e) => setSearchLast100(e.target.value)}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:flex items-center">
                    {t("ranking")}
                  </TableHead>
                  <TableHead>{t("code")}</TableHead>
                  <TableHead>{t("label")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDataLast100.map((item, index) => (
                  <TableRow key={item.code}>
                    <TableCell className="hidden md:flex items-center">
                      n°{index + 1}
                    </TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.libelle}</TableCell>
                  </TableRow>
                ))}
                {filteredDataLast100.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      {t("noResults")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
