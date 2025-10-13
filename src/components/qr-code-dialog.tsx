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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {qrCodeData && (
            <Image
              ref={imageRef}
              src={qrCodeData}
              alt="Generated QR Code"
              width={SIZE}
              height={SIZE}
              className="rounded-lg"
            />
          )}
        </div>
        <DialogFooter>
          {/* ...existing code for download/copy image buttons... */}
          {url && (
            <div className="w-full">
              <div className="flex w-full mt-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 rounded-l-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ minWidth: 0 }}
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  type="button"
                  onClick={() => {
                    handleCopyLink();
                    umami.event("QrCodeDialog.CopyLink");
                  }}
                  className="rounded-l-none rounded-r-md"
                  variant="outline"
                  tabIndex={0}
                  aria-label={t("copyLink.button", {
                    defaultValue: "Copy link",
                  })}
                >
                  <Copy className="mr-1" size={18} />
                </Button>
              </div>
              <div className="flex flex-wrap justify-evenly w-full mt-2">
                <FacebookShareButton url={url} hashtag="#CROUStillant">
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                  url={url}
                  title={title}
                  hashtags={["CROUStillant", "Menu"]}
                  via="CROUStillant"
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton
                  url={url}
                  title={title}
                  summary={description}
                  source="CROUStillant"
                >
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <WhatsappShareButton url={url} title={title} separator=" - ">
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <TelegramShareButton url={url} title={title}>
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
                <RedditShareButton url={url} title={title}>
                  <RedditIcon size={32} round />
                </RedditShareButton>
                <EmailShareButton
                  url={url}
                  subject={title}
                  body={description || url}
                >
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
