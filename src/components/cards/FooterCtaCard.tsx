import { HeartHandshakeIcon } from "lucide-react";
import Link from "next/link";

const FooterCtaCard = () => {
    return (
        <section className="flex flex-col items-center justify-center w-[90%] px-6 lg:w-[70%] mx-auto py-20 rounded-[20px] border border-[rgba(255,255,255,0.70)] bg-[linear-gradient(113deg,_rgba(255,255,255,0.62)_0%,_rgba(255,255,255,0.20)_110.84%)] backdrop-blur-[21px]">
        <div className="mb-5 w-fit h-fit p-6 flex items-center justify-center rounded-[30px] border border-[#FF9595] bg-[radial-gradient(50%_50%_at_50%_50%,_#FF4646_0%,_rgba(255,71,71,0.80)_100%)] shadow-[inset_-6px_-3px_10px_0px_#FFD7D7]">
            <HeartHandshakeIcon color="white" size={75} />
        </div>
        <div className="flex flex-col justify-center items-center gap-3">
            <p className="bg-gradient-to-r from-[#e40514] to-[#9e2020] bg-clip-text text-transparent font-bold text-4xl md:text-5xl">Convaincu ? </p>
            <p className="text-center text-base md:text-lg max-w-96">Débutez votre utilisation de CROUStillant dès maintenant !</p>
        </div>
        <Link href={"/"} className="mt-9 text-sm md:text-base rounded-[16px] bg-[#E40514] shadow-[inset_0px_1px_3px_0px_#E40514,_inset_0px_2px_2px_2px_rgba(255,255,255,0.25)] py-3 px-6 text-white">Découvrir votre menu</Link>
        </section>
    )
}
export default FooterCtaCard;