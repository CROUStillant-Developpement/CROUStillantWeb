import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";

export default function Logo({
  withText,
  ...props
}: { withText?: boolean } & React.ComponentProps<"div">) {
  return (
    <div className="m-0 flex items-center" {...props}>
      <Image
        src={`/logo.png`}
        width={40}
        height={40}
        alt="CROUStillant Logo"
        className={cn(
          "transition-all duration-300 hover:scale-110",
          withText && "mr-2"
        )}
      />
      {withText && (
        <span className="ml-2 text-2xl font-bold">CROUStillant</span>
      )}
    </div>
  );
}
