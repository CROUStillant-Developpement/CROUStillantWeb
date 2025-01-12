import { useTranslations } from "next-intl";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className = "" }: LoadingProps) {
  const t = useTranslations("Common");

  return (
    <div
      className={`${
        className.length > 0 ? className + " " : className
      }flex items-center justify-center w-full h-full flex-1`}
    >
      <div className="flex justify-center items-center space-x-1 text-sm">
        <svg
          fill="none"
          className="w-6 h-6 animate-spin"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>

        <div>{t("loading")}</div>
      </div>
    </div>
  );
}
