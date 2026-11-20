"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

// qrcode and react-share (about 100 kB) are only needed once a dialog is opened:
// pages with several share buttons (a restaurant has one per meal) no longer
// download them, nor compute a QR code per button, to display a menu.
const QrCodeDialogContent = dynamic(() => import("./qr-code-dialog-content"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center gap-5 py-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-[180px] w-[180px] rounded-3xl sm:h-[220px] sm:w-[220px]" />
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  ),
});

interface QrCodeDialogProps {
  dialogTrigger: React.ReactNode;
  title: string;
  url: string;
  description?: string;
}

export default function QrCodeDialog({
  dialogTrigger,
  title,
  url,
  description,
}: QrCodeDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[480px] bg-background/80 backdrop-blur-xl border border-primary/20 rounded-sm shadow-2xl p-5 sm:p-8 overflow-hidden will-change-[transform,opacity]">
        {open && <QrCodeDialogContent title={title} url={url} description={description} />}
      </DialogContent>
    </Dialog>
  );
}
