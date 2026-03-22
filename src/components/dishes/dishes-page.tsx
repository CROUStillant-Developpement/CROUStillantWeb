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
import { motion } from "@/lib/motion";
import { Search, Trophy, History } from "lucide-react";

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
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 justify-center md:hidden">
        <Button asChild variant="secondary" className="rounded-full shadow-sm border-primary/10">
          <Link href="#top100">{t("top100")}</Link>
        </Button>
        <Button asChild variant="secondary" className="rounded-full shadow-sm border-primary/10">
          <Link href="#last100">{t("last100")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col gap-10"
        >
          <Card className="h-full rounded-[2rem] border-primary/10 shadow-lg overflow-hidden bg-card/50 backdrop-blur-sm" id="top100">
            <CardHeader className="border-b border-primary/5 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary break-words">{t("top100")}</CardTitle>
                  <CardDescription className="text-sm sm:text-base font-medium">{t("top100Description")}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  className="pl-11 rounded-2xl bg-muted/30 border-primary/5 focus-visible:ring-primary/20 h-12 text-base"
                  placeholder={t("search")}
                  value={searchTop100}
                  onChange={(e) => setSearchTop100(e.target.value)}
                />
              </div>
              <div className="rounded-2xl border border-primary/5 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-primary/5">
                      <TableHead className="w-24 text-center font-bold">{t("ranking")}</TableHead>
                      <TableHead className="w-32 text-center font-bold">{t("occurrences")}</TableHead>
                      <TableHead className="font-bold">{t("label")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDataTop100.map((item, index) => (
                      <TableRow key={item.code} className="group border-primary/5 hover:bg-primary/5 transition-colors">
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 font-bold text-sm text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            {index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {item.total?.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{item.libelle}</TableCell>
                      </TableRow>
                    ))}
                    {filteredDataTop100.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                          {t("noResults")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-col gap-10"
        >
          <Card className="h-full rounded-[2rem] border-primary/10 shadow-lg overflow-hidden bg-card/50 backdrop-blur-sm" id="last100">
            <CardHeader className="border-b border-primary/5 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0">
                  <History className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary break-words">{t("last100")}</CardTitle>
                  <CardDescription className="text-sm sm:text-base font-medium">{t("last100Description")}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  className="pl-11 rounded-2xl bg-muted/30 border-primary/5 focus-visible:ring-primary/20 h-12 text-base"
                  placeholder={t("search")}
                  value={searchLast100}
                  onChange={(e) => setSearchLast100(e.target.value)}
                />
              </div>
              <div className="rounded-2xl border border-primary/5 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-primary/5">
                      <TableHead className="w-24 text-center font-bold">{t("ranking")}</TableHead>
                      <TableHead className="w-32 text-center font-bold">{t("code")}</TableHead>
                      <TableHead className="font-bold">{t("label")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDataLast100.map((item, index) => (
                      <TableRow key={item.code} className="group border-primary/5 hover:bg-primary/5 transition-colors">
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 font-bold text-sm text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            {index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs text-muted-foreground">
                          {item.code}
                        </TableCell>
                        <TableCell className="font-medium">{item.libelle}</TableCell>
                      </TableRow>
                    ))}
                    {filteredDataLast100.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                          {t("noResults")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
