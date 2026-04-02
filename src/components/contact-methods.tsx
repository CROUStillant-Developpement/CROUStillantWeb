"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "@/lib/motion";
import { Mail, MessageSquare, AlertTriangle, ChevronRight } from "lucide-react";
import { FaGithub } from 'react-icons/fa';

export function ContactMethods() {
  const t = useTranslations("ContactPage");
  const [reason, setReason] = useState<string | null>(null);

  const isSiteIssue = reason === "site" || reason === "other";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-wider">
          {t("select.placeholder")}
        </label>
        <Select onValueChange={setReason}>
          <SelectTrigger className="h-14 rounded-2xl border-primary/10 bg-muted/30 px-5 text-base focus:ring-primary/20 transition-all">
            <SelectValue placeholder={t("select.placeholder")} />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-primary/10 bg-card/95 backdrop-blur-xl">
            <SelectItem value="site" className="rounded-xl py-3 focus:bg-primary/5">{t("select.site")}</SelectItem>
            <SelectItem value="crous" className="rounded-xl py-3 focus:bg-primary/5">{t("select.crous")}</SelectItem>
            <SelectItem value="other" className="rounded-xl py-3 focus:bg-primary/5">{t("select.other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence mode="wait">
        {reason && (reason === "crous" || reason === "other") && (
          <motion.div
            key="crous-warning"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 rounded-2xl bg-orange-500/10 p-4 border border-orange-500/20">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium leading-relaxed">
                {t("notOfficial")}
              </p>
            </div>
          </motion.div>
        )}

        {isSiteIssue && (
          <motion.div
            key="methods"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            <p className="text-center text-muted-foreground font-medium leading-relaxed px-2">
              {t("subdescription")}
            </p>

            <div className="grid gap-4">
              <Button asChild className="h-16 rounded-2xl group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] transition-transform">
                <Link href="mailto:croustillant@bayfield.dev" className="flex items-center justify-between px-3 sm:px-6 w-full">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="p-2 rounded-xl bg-white/10 shrink-0">
                      <Mail className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold tracking-tight truncate">{t("methods.email")}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-16 rounded-2xl group border-primary/10 hover:border-primary/20 hover:bg-muted/50 transition-all">
                <Link
                  href="https://github.com/CROUStillant-Developpement/CROUStillantWeb/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 sm:px-6 w-full"
                >
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="p-2 rounded-xl bg-primary/5 shrink-0">
                      <FaGithub className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold tracking-tight text-foreground truncate">{t("methods.github")}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </Button>

              <Button asChild variant="ghost" className="h-16 rounded-2xl group hover:bg-[#5865F2]/10 transition-all">
                <a
                  href="https://discord.gg/yG6FjqbWtk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 sm:px-6 w-full"
                >
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="p-2 rounded-xl bg-[#5865F2]/10 group-hover:bg-[#5865F2]/20 transition-colors shrink-0">
                      <MessageSquare className="w-5 h-5 text-[#5865F2]" />
                    </div>
                    <span className="font-bold tracking-tight text-foreground truncate">{t("methods.discord")}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
