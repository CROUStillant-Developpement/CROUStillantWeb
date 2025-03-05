import Link from "next/link";

interface Props {
    style?: string;
}

const ApiCard = ({ style }: Props) => {
    return (
        <section className={`${style}`}>
            <aside className=" flex flex-col md:flex-row w-full h-full gap-6 py-4 px-3.5 bg-[#FAFAFA] rounded-[8px] border border-[#555555] border-opacity-[7%] ">
                <div className="flex flex-col gap-2">
                    <p className="bg-gradient-to-r from-[#e40514] to-[#9e2020] bg-clip-text text-transparent font-bold text-2xl">
                        Intégration facile
                    </p>
                    <p className="text-base">
                        Vous pouvez intégrer les informations des restaurants CROUS sur votre site web ou votre application en utilisant notre API. L'API est gratuite et ne nécessite pas d'inscription.</p>
                    <Link href="/" className="underline text-base font-bold">
                        Commencer à l’utiliser
                    </Link>
                </div>
                <section className="relative flex items-center justify-center w-full h-fit bg-[#F8E9E9] bg-opacity-40 rounded-xl overflow-hidden py-2.5">
                    <aside className="overflow-hidden translate-x-4 flex flex-col justify-between px-3 py-1 w-full h-full ">
                        <div className="flex gap-2 items-center w-fullborder border border-r-0 border-b-0 rounded-bl-none border-[#FFCACA] border-opacity-40 rounded-[8px] pt-2 pl-2 pb-2 ">
                            <p className="text-lg font-medium opacity-80 ">Server</p>
                            <div className="relative flex items-center justify-center pl-1.5">
                                <div className=" absolute size-2 rounded-full bg-green-500 "/>
                                <div className=" absolute size-3 rounded-full bg-green-500 animate-scan"/>
                            </div>
                        </div>
                        <div className="flex items-center w-fullborder border border-r-0 rounded-l-none border-[#FFCACA] border-opacity-40 rounded-[8px] pt-2 pl-2 pb-2 ">
                            <p className="text-sm md:text-lg font-medium ">https://api-croustillant.bayfield.dev</p>
                        </div>
                        <div className="flex items-center w-fullborder border border-r-0 border-t-0 rounded-tl-none border-[#FFCACA] border-opacity-40 rounded-[8px] pt-2 pl-2 pb-2">
                            <p className="text-xs md:text-base font-medium opacity-60">Serveur de production</p>
                        </div>
                    </aside>
                </section>
            </aside>
        </section>
    );
}
export default ApiCard;

export const GitActivity = () => {
    return (
        <article className="flex flex-col gap-3">
            <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-3 ">
                    <div className="px-2 py-1 rounded-[8px] bg-gray-300 text-sm font-medium">Développeur</div>
                    <p className="font-medium text-lg">Paul Bayfield</p>
                </div>
                <p className="hidden sm:block text-base opacity-80">20s</p>
            </div>
            <p className="font-medium text-base opacity-80">Pushed to CROUStillant</p>
        </article>
    )
}