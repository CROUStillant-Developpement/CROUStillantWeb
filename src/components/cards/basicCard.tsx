import { Link } from "@/i18n/routing";

interface Props {
    title: string;
    description: string;
    CTA: string,
    CTALink: string,
    style?: string;
    children: React.ReactNode;
  }
  const BasicCard = async ({ title, description, CTA, CTALink, style, children }: Props) => {
    return (
      <aside
      className={`${style} relative flex items-center min-h-[160px] h-full w-full overflow-hidden border-2 border-[#555] border-opacity-5 bg-[#FAFAFA] dark:bg-[#151414] dark:border-[rgba(85,85,85,0.35)] rounded-xl p-4 md:p-6`}>
        <div className="flex flex-col w-full max-w-[80%] h-fit gap-4 ">
          <div className="flex flex-col gap-1">
            <h3 className="bg-gradient-to-r from-[#e40514] to-[#ff6868] dark:linear-gradient(to right, #E40514 0%, #FF7474 100%) bg-clip-text text-transparent text-2xl font-bold">{title}</h3>
            <p className="text-base">{description}</p>
          </div>
          <Link href={`/${CTALink}`} className="text-sm font-bold underline">{CTA}</Link>
        </div>
        <div className="absolute -right-16">{children}</div>
      </aside>
    );
  };
  export default BasicCard;
  