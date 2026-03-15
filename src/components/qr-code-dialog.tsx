"use client";

import { useEffect, useRef, useState } from "react";
import log from "@/lib/log";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  WhatsappIcon,
} from "react-share";

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
      <DialogContent className="sm:max-w-[480px] bg-background/80 backdrop-blur-xl border border-primary/20 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden will-change-[transform,opacity]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground/80 font-medium">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-8">
          {qrCodeData && (
            <div className="p-6 bg-white rounded-[2.5rem] shadow-xl border border-black/5 group hover:scale-[1.02] transition-transform duration-500">
              <Image
                ref={imageRef}
                src={qrCodeData}
                alt={t("alt")}
                width={280}
                height={280}
                className="rounded-2xl"
              />
            </div>
          )}

          <div className="w-full space-y-6">
            <div className="flex gap-2 p-1.5 bg-secondary/20 border border-primary/10 rounded-2xl items-center focus-within:border-primary/30 transition-colors">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 bg-transparent px-4 py-2 text-sm font-medium focus:outline-none"
                onFocus={(e) => e.target.select()}
              />
              <Button
                type="button"
                onClick={() => {
                  handleCopyLink();
                  umami.event("QrCodeDialog.CopyLink");
                }}
                className="rounded-xl h-10 px-4 font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                variant="default"
                aria-label={t("copyLink.button")}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t("copyLink.cta")}
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 text-center">
                {t("share")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-secondary/10 rounded-3xl border border-primary/5">
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
                    {/* @ts-ignore - rounding issues in react-share types */}
                    <ShareIcon size={36} round />
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
