"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { Flame, Loader2, RotateCcw, Share2, Swords, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getTop100Dishes } from "@/services/stats-services";
import { buildDeck, duelWinner, pickDuel, type DuelDish } from "@/lib/dish-duel";
import { cn } from "@/lib/utils";
import log from "@/lib/log";

const BEST_SCORE_STORAGE_KEY = "dish-duel-best-score";
const SHARE_URL = "https://croustillant.menu";

/** How long the totals stay on screen before the next round (or the game over). */
const REVEAL_MS = 1800;

/** How many dishes are kept out of the draw so rounds don't repeat too soon. */
const RECENT_MEMORY = 8;

type Phase = "loading" | "error" | "playing" | "revealing" | "over";

/**
 * Reads the best score kept from previous sessions.
 *
 * @returns The stored best score, or 0 when unavailable.
 */
function readBestScore(): number {
  try {
    const stored = Number(localStorage.getItem(BEST_SCORE_STORAGE_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  } catch {
    // storage unavailable (private mode) — the run just won't be remembered
    return 0;
  }
}

/**
 * Persists a new best score.
 *
 * @param score - The score to store.
 */
function writeBestScore(score: number) {
  try {
    localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
  } catch {
    // storage unavailable — the score simply won't survive the session
  }
}

interface DishDuelProps {
  onClose: () => void;
}

/**
 * The hidden "dish duel": two dishes drawn from the live top-100 ranking, and
 * the player picks the one CROUS restaurants have served the most.
 *
 * This component is only imported once the easter egg is unlocked, so neither
 * its code nor its API call is part of a normal page load.
 */
export default function DishDuel({ onClose }: DishDuelProps) {
  const t = useTranslations("DishDuel");
  const locale = useLocale();
  const umami = useUmami();
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>("loading");
  const [pair, setPair] = useState<[DuelDish, DuelDish] | null>(null);
  const [picked, setPicked] = useState<DuelDish | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const deck = useRef<DuelDish[]>([]);
  const recent = useRef<DuelDish["code"][]>([]);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextRound = useCallback(() => {
    const duel = pickDuel(deck.current, Math.random, recent.current);
    if (!duel) {
      setPhase("error");
      return;
    }

    recent.current = [duel[0].code, duel[1].code, ...recent.current].slice(
      0,
      RECENT_MEMORY
    );
    setPicked(null);
    setPair(duel);
    setPhase("playing");
  }, []);

  // Fetch the live ranking once, when the game opens.
  useEffect(() => {
    let cancelled = false;
    umami.event("EasterEgg.DishDuel.Open");

    getTop100Dishes()
      .then((result) => {
        if (cancelled) return;

        if (!result.success) {
          log.error(["Dish duel: failed to load dishes", result.error], "dev");
          setPhase("error");
          return;
        }

        deck.current = buildDeck(result.data);
        setBest(readBestScore());
        nextRound();
      })
      .catch((error) => {
        if (cancelled) return;
        log.error(["Dish duel: failed to load dishes", error], "dev");
        setPhase("error");
      });

    return () => {
      cancelled = true;
    };
  }, [nextRound]);

  useEffect(
    () => () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    },
    []
  );

  function answer(choice: DuelDish) {
    if (phase !== "playing" || !pair) return;

    setPicked(choice);
    setPhase("revealing");

    const winner = duelWinner(pair[0], pair[1]);
    // A perfect tie has no wrong answer — either pick keeps the run alive.
    const correct = winner === null || winner.code === choice.code;
    const nextScore = correct ? score + 1 : score;
    if (correct) setScore(nextScore);

    revealTimer.current = setTimeout(() => {
      if (correct) {
        nextRound();
        return;
      }

      if (nextScore > best) {
        setBest(nextScore);
        writeBestScore(nextScore);
      }
      umami.event("EasterEgg.DishDuel.GameOver", { score: nextScore });
      setPhase("over");
    }, REVEAL_MS);
  }

  function replay() {
    setScore(0);
    setPicked(null);
    recent.current = [];
    nextRound();
  }

  async function share() {
    umami.event("EasterEgg.DishDuel.Share", { score });
    const text = t("share.text", { score });

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "CROUStillant", text, url: SHARE_URL });
        return;
      } catch (error) {
        // The user cancelled the share sheet — don't fall back to a copy.
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${SHARE_URL}`);
      toast({
        title: t("share.copied.title"),
        description: t("share.copied.description"),
      });
    } catch (error) {
      log.error([error], "dev");
    }
  }

  const revealed = phase === "revealing" || phase === "over";
  const winner = pair ? duelWinner(pair[0], pair[1]) : null;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Swords className="h-5 w-5 text-primary" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {phase === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">{t("loading")}</p>
          </div>
        )}

        {phase === "error" && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">{t("error")}</p>
            <Button variant="outline" onClick={onClose}>
              {t("close")}
            </Button>
          </div>
        )}

        {pair && phase !== "loading" && phase !== "error" && (
          <>
            <div className="flex items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary ring-1 ring-inset ring-primary/20">
                <Flame className="h-4 w-4" />
                {t("streak", { score })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground">
                <Trophy className="h-4 w-4" />
                {t("best", { score: best })}
              </span>
            </div>

            <p className="text-center text-sm font-semibold text-foreground/80">
              {t("question")}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
              {pair.map((dish, index) => {
                const isWinner = winner?.code === dish.code;
                const isPicked = picked?.code === dish.code;

                return (
                  <div key={dish.code} className="contents">
                    {index === 1 && (
                      <div className="flex items-center justify-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                        {t("versus")}
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={phase !== "playing"}
                      onClick={() => answer(dish)}
                      className={cn(
                        "flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all",
                        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                        phase === "playing" &&
                          "cursor-pointer border-primary/20 bg-primary/5 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10",
                        revealed && isWinner && "border-green-500/40 bg-green-500/10",
                        revealed && !isWinner && "border-border bg-muted/40 opacity-70",
                        revealed &&
                          isPicked &&
                          !isWinner &&
                          winner !== null &&
                          "border-red-500/50 bg-red-500/10 opacity-100"
                      )}
                    >
                      <span className="text-base font-extrabold leading-tight wrap-break-word">
                        {dish.libelle}
                      </span>
                      {revealed && (
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            isWinner
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground"
                          )}
                        >
                          {t("servings", { count: dish.total.toLocaleString(locale) })}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {phase === "over" && (
              <div className="mt-1 flex flex-col items-center gap-3 rounded-2xl bg-secondary/40 p-4 text-center">
                <div>
                  <p className="text-lg font-extrabold">{t("gameOver.title")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {score > 0 && score >= best
                      ? t("gameOver.record", { score })
                      : t("gameOver.score", { score })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button onClick={replay} className="rounded-xl font-bold">
                    <RotateCcw className="h-4 w-4" />
                    {t("gameOver.replay")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={share}
                    className="rounded-xl font-bold"
                  >
                    <Share2 className="h-4 w-4" />
                    {t("gameOver.share")}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              {t("footnote")}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
