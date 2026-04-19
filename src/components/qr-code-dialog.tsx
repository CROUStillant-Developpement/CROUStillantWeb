"use client";

import { useEffect, useRef, useState } from "react";
import log from "@/lib/log";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QrCode from "qrcode";
import Image from "next/image";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon} from "react-share";

interface QrCodeDialogProps {
  dialogTrigger: React.ReactNode;
  title: string;
  url: string;
  description?: string;
}

const SIZE: number = 500;

export default function QrCodeDialog({
  dialogTrigger,
  title,
  url,
  description,
}: QrCodeDialogProps) {
  const { toast } = useToast();
  const imageRef = useRef(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const t = useTranslations("QrCodeDialog");
  const umami = useUmami();

  const generateQrCode = async (url: string) => {
    try {
      const qrCodeData = await QrCode.toDataURL(url, {
        width: SIZE,
        errorCorrectionLevel: "H",
      });
      setQrCodeData(qrCodeData);
    } catch (error) {
      log.error([error], "dev");
    }
  };

  // const handleCopyImage = () => {
  //   if (!!imageRef.current) {
  //     const canvas: HTMLCanvasElement = document.createElement("canvas");
  //     canvas.width = SIZE;
  //     canvas.height = SIZE;
  //     // @ts-expect-error - TS doesn't know about the drawImage method
  //     canvas.getContext("2d").drawImage(imageRef.current, 0, 0, SIZE, SIZE);
  //     canvas.toBlob((blob: Blob | null) => {
  //       navigator.clipboard.write([
  //         new ClipboardItem({
  //           "image/png": blob ?? new Blob(),
  //         }),
  //       ]);
  //     }, "image/png");

  //     toast({
  //       title: t("copy.toastTitle"),
  //       description: t("copy.toastDescription"),
  //     });
  //   }
  // };

  const handleCopyLink = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      toast({
        title: t("copyLink.toastTitle", { defaultValue: "Link copied!" }),
        description: t("copyLink.toastDescription", {
          defaultValue: "The link has been copied to your clipboard.",
        }),
      });
    }
  };

  useEffect(() => {
    if (url.length > 0) generateQrCode(url);
  }, [url]);

  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[480px] bg-background/80 backdrop-blur-xl border border-primary/20 rounded-sm shadow-2xl p-5 sm:p-8 overflow-hidden will-change-[transform,opacity]">
        <DialogHeader className="mb-3 sm:mb-4">
          <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground/80 font-medium text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 sm:gap-8">
          {qrCodeData && (
            <div className="p-4 sm:p-6 bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-black/5 group hover:scale-[1.02] transition-transform duration-500">
              <Image
                ref={imageRef}
                src={qrCodeData}
                alt={t("alt")}
                width={220}
                height={220}
                className="rounded-xl sm:rounded-2xl w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]"
              />
            </div>
          )}

          <div className="w-full space-y-4 sm:space-y-6">
            <div className="flex gap-2 p-1.5 bg-secondary/20 border border-primary/10 rounded-2xl items-center focus-within:border-primary/30 transition-colors min-w-0">
              <input
                type="text"
                value={url}
                readOnly
                aria-label={t("copyLink.button")}
                className="flex-1 min-w-0 bg-transparent px-3 py-2 text-xs sm:text-sm font-medium focus:outline-hidden truncate"
                onFocus={(e) => e.target.select()}
              />
              <Button
                type="button"
                onClick={() => {
                  handleCopyLink();
                  umami.event("QrCodeDialog.CopyLink");
                }}
                className="shrink-0 rounded-xl h-9 sm:h-10 px-3 sm:px-4 font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                variant="default"
                aria-label={t("copyLink.button")}
              >
                <Copy className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">{t("copyLink.cta")}</span>
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 text-center">
                {t("share")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-secondary/10 rounded-3xl border border-primary/5">
                {[
                  { Button: FacebookShareButton, Icon: FacebookIcon },
                  { Button: TwitterShareButton, Icon: TwitterIcon },
                  { Button: LinkedinShareButton, Icon: LinkedinIcon },
                  { Button: WhatsappShareButton, Icon: WhatsappIcon },
                  { Button: TelegramShareButton, Icon: TelegramIcon },
                  { Button: RedditShareButton, Icon: RedditIcon },
                  { Button: EmailShareButton, Icon: EmailIcon },
                ].map(({ Button: ShareBtn, Icon: ShareIcon }, idx) => (
                  <ShareBtn key={idx} url={url} title={title} className="hover:scale-110 active:scale-90 transition-transform">
                    <ShareIcon size={32} round />
                  </ShareBtn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
