import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface Props {
    title: string;
    description: string;
    CTA: string,
    CTALink: string,
    style?: string;
    children: React.ReactNode;
  }
  const BasicCard = async ({ title, description, CTA, CTALink, style, children }: Props) => {
    const t = await getTranslations("InfoCard");

    return (
      <aside
      className={`${style} relative flex items-center min-h-[160px] h-full w-full overflow-hidden border-2 border-[#555] border-opacity-5 bg-[#FAFAFA] rounded-xl p-4 md:p-6`}>
        <div className="flex flex-col w-full max-w-[80%] h-fit gap-4 ">
          <div className="flex flex-col gap-1">
            <h3 className="bg-gradient-to-r from-[#e40514] to-[#9e2020] bg-clip-text text-transparent text-2xl font-bold">{title}</h3>
            <p className="text-xs ">{description}</p>
          </div>
          <Link href={CTALink} className="text-sm font-bold underline">{CTA}</Link>
        </div>
        <div className="absolute -right-16">{children}</div>
      </aside>
    );
  };
  export default BasicCard;
  