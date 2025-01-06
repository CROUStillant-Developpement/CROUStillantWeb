"use client";

import { useEffect, useRef, useState } from "react";
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
import { ArrowDownToLine, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

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

  const generateQrCode = async (url: string) => {
    try {
      const qrCodeData = await QrCode.toDataURL(url, {
        width: SIZE,
        errorCorrectionLevel: "H",
      });
      setQrCodeData(qrCodeData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyImage = () => {
    if (!!imageRef.current) {
      const canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      // @ts-expect-error - TS doesn't know about the drawImage method
      canvas.getContext("2d").drawImage(imageRef.current, 0, 0, SIZE, SIZE);
      canvas.toBlob((blob: Blob | null) => {
        navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob ?? new Blob(),
          }),
        ]);
      }, "image/png");

      toast({
        title: t("copy.toastTitle"),
        description: t("copy.toastDescription"),
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
          <Button
            type="submit"
            disabled={!qrCodeData}
            className="w-full mt-2"
            asChild
          >
            <a href={qrCodeData ?? "#"} download={title + ".png"}>
              <ArrowDownToLine className="mr-2" />
              {t("download")}
            </a>
          </Button>
          <Button
            type="button"
            onClick={handleCopyImage}
            disabled={!qrCodeData}
            className="w-full mt-2"
          >
            <Copy className="mr-2" />
            {t("copy.button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
