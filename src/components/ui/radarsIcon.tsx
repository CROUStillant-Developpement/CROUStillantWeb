import { cn } from "@/lib/utils";

interface Props {
  big?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const RadarsIcons = ({ big, children, style }: Props) => {
  return (
    <div
      style={style}
      className={cn(
        `${
          big ? "size-24" : "size-12"
        }

        flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,_#ff4646_0%,_rgba(255,71,71,0.8)_100%)] shadow-[inset_-6px_-3px_10px_0px_#ffd7d7] dark:shadow-[inset_-6px_-3px_10px_0px_#464646] border-[1.2px] border-[#ff9595]`
      )}
    >
      {children}
    </div>
  );
};

export { RadarsIcons };
