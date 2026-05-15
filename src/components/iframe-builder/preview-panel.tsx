"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import {
  ExternalLink, Copy, Check, Code2, Link2,
  LayoutTemplate, Loader2, AlertTriangle, WifiOff, RefreshCw,
} from "lucide-react";

type PreviewStatus = "idle" | "checking" | "ready" | "error";

interface Props {
  iframeUrl: string | null;
  width: number;
  height: number;
  restaurantCode: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

export default function PreviewPanel({ iframeUrl, width, height, restaurantCode, t }: Props) {
  const [copied, setCopied] = useState<"embed" | "url" | null>(null);
  const [status, setStatus] = useState<PreviewStatus>("idle");
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced fetch-check: 600 ms after iframeUrl settles, validate with the API
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    controllerRef.current?.abort();

    if (!iframeUrl) {
      setStatus("idle");
      setErrorCode(null);
      return;
    }

    setStatus("checking");
    setErrorCode(null);
    setIframeLoaded(false);

    timerRef.current = setTimeout(() => {
      const controller = new AbortController();
      controllerRef.current = controller;

      fetch(iframeUrl, { signal: controller.signal })
        .then((res) => {
          if (controller.signal.aborted) return;
          if (res.ok) {
            setStatus("ready");
          } else {
            setStatus("error");
            setErrorCode(res.status);
          }
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          // CORS / network error — fail open so the iframe can still load
          setStatus("ready");
        });
    }, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      controllerRef.current?.abort();
    };
  }, [iframeUrl]);

  const retry = () => {
    if (!iframeUrl) return;
    setStatus("checking");
    setErrorCode(null);
    const controller = new AbortController();
    controllerRef.current = controller;
    fetch(iframeUrl, { signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return;
        if (res.ok) setStatus("ready");
        else { setStatus("error"); setErrorCode(res.status); }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("ready");
      });
  };

  const errorMessage = (() => {
    if (errorCode === 429) return t("preview.error429");
    if (errorCode === 404) return t("preview.error404");
    if (errorCode && errorCode >= 500) return t("preview.error500");
    if (errorCode) return t("preview.errorUnknown", { code: errorCode });
    return t("preview.errorGeneric");
  })();

  const embedCode = iframeUrl
    ? `<iframe\n  src="${iframeUrl}"\n  width="${width}"\n  height="${height}"\n  style="border:none;border-radius:12px;"\n  title="Widget CROUStillant"\n  loading="lazy"\n></iframe>`
    : null;

  const copy = useCallback(async (text: string, type: "embed" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const isLive = status === "ready";

  return (
    <div className="space-y-4">
      {/* Preview card */}
      <div className="rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs">

        {/* Header */}
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-tight">
            <span className="p-1.5 rounded-lg bg-primary/5 text-primary">
              <LayoutTemplate className="w-4 h-4" />
            </span>
            {t("preview.title")}
            <AnimatePresence mode="wait">
              {status === "checking" && (
                <motion.span
                  key="checking"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 ml-1"
                >
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground normal-case tracking-normal">
                    {t("preview.checking")}
                  </span>
                </motion.span>
              )}
              {isLive && (
                <motion.span
                  key="live"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 ml-1"
                >
                  <span className="relative flex items-center justify-center">
                    <span className="absolute size-2 rounded-full bg-green-500" />
                    <span className="absolute size-3 rounded-full bg-green-500 animate-scan" />
                    <span className="size-3" />
                  </span>
                  <span className="text-xs font-medium text-green-500 normal-case tracking-normal">
                    {t("preview.live")}
                  </span>
                </motion.span>
              )}
              {status === "error" && (
                <motion.span
                  key="error-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 ml-1"
                >
                  <span className="size-2 rounded-full bg-destructive" />
                  <span className="text-xs font-medium text-destructive normal-case tracking-normal">
                    {errorCode ? `${t("preview.errorBadge")} ${errorCode}` : t("preview.errorBadge")}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </h2>
          {iframeUrl && isLive && (
            <a
              href={iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {t("preview.openRaw")}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Content area */}
        <div className="overflow-x-auto rounded-b-2xl">
          {!restaurantCode ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6 text-muted-foreground min-h-48">
              <div className="p-4 rounded-2xl bg-primary/5 text-primary w-fit mb-3">
                <LayoutTemplate className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium text-foreground">{t("preview.empty")}</p>
              <p className="text-xs mt-1">{t("preview.emptyHint")}</p>
            </div>
          ) : !iframeUrl ? (
            <div className="flex items-center justify-center py-16 px-6 min-h-48 text-muted-foreground">
              <p className="text-sm">{t("preview.noBlocks")}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">

              {status === "checking" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center gap-3 py-16 min-h-48 text-muted-foreground"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
                  <p className="text-sm">{t("preview.checking")}</p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center justify-center gap-4 py-16 px-6 min-h-48 text-center"
                >
                  <div className="p-4 rounded-2xl bg-destructive/10 text-destructive w-fit">
                    {errorCode === 429 ? (
                      <WifiOff className="w-8 h-8" />
                    ) : (
                      <AlertTriangle className="w-8 h-8" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{t("preview.errorTitle")}</p>
                    <p className="text-xs text-muted-foreground max-w-64">{errorMessage}</p>
                  </div>
                  <button
                    type="button"
                    onClick={retry}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t("preview.retry")}
                  </button>
                </motion.div>
              )}

              {status === "ready" && (
                <motion.div
                  key={iframeUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex justify-center pb-6 pt-4"
                >
                  {/* Iframe loading overlay */}
                  <AnimatePresence>
                    {!iframeLoaded && (
                      <motion.div
                        key="iframe-loading"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-xs z-10 rounded-b-2xl"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-primary/60" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <iframe
                    key={iframeUrl}
                    src={iframeUrl}
                    onLoad={() => setIframeLoaded(true)}
                    style={{
                      border: "none",
                      display: "block",
                      width: `${width}px`,
                      minWidth: `${width}px`,
                      height: `${height + 40}px`,
                    }}
                    title="Widget CROUStillant Preview"
                    loading="lazy"
                  />
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Embed code — only when ready */}
      <AnimatePresence>
        {status === "ready" && embedCode && (
          <motion.div
            key="embed-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border/50">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-tight">
                <span className="p-1.5 rounded-lg bg-primary/5 text-primary">
                  <Code2 className="w-4 h-4" />
                </span>
                {t("embed.title")}
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <CodeBlock
                icon={<Code2 className="w-3.5 h-3.5" />}
                label={t("embed.code")}
                content={embedCode}
                onCopy={() => copy(embedCode, "embed")}
                copied={copied === "embed"}
                copyLabel={t("embed.copy")}
                copiedLabel={t("embed.copied")}
                mono
                multiline
              />
              <CodeBlock
                icon={<Link2 className="w-3.5 h-3.5" />}
                label={t("embed.url")}
                content={iframeUrl ?? ""}
                onCopy={() => iframeUrl && copy(iframeUrl, "url")}
                copied={copied === "url"}
                copyLabel={t("embed.copy")}
                copiedLabel={t("embed.copied")}
                mono
                multiline={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CodeBlock({
  icon, label, content, onCopy, copied, copyLabel, copiedLabel, mono, multiline,
}: {
  icon: React.ReactNode;
  label: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
  copyLabel: string;
  copiedLabel: string;
  mono: boolean;
  multiline: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {icon}
          {label}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-200 ${
            copied ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" />{copiedLabel}</>
          ) : (
            <><Copy className="w-3.5 h-3.5" />{copyLabel}</>
          )}
        </button>
      </div>
      {multiline ? (
        <pre className={`text-xs rounded-xl border border-border/50 bg-muted/30 p-3 overflow-x-auto text-foreground leading-relaxed whitespace-pre-wrap break-all ${mono ? "font-mono" : ""}`}>
          {content}
        </pre>
      ) : (
        <div className={`text-xs rounded-xl border border-border/50 bg-muted/30 p-3 overflow-x-auto text-foreground break-all ${mono ? "font-mono" : ""}`}>
          {content}
        </div>
      )}
    </div>
  );
}
