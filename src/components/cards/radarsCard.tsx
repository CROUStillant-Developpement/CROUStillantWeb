"use client";
import { School, UtensilsCrossed } from "lucide-react";
import RadarsIcons from "../ui/radarsIcon";
import Link from "next/link";

interface Props {
    style?: string;
}

const RadarsCard = ({ style }: Props) => {
    return (
        <section className={`${style}`}>
            <aside className=" flex flex-col w-full h-full gap-6 py-4 px-3.5 bg-[#FAFAFA] rounded-[8px] border border-[#555555] border-opacity-[7%] ">
                <div className="flex flex-col gap-2">
                    <p className="bg-gradient-to-r from-[#e40514] to-[#9e2020] bg-clip-text text-transparent font-bold text-2xl">
                        Créé par des étudiants, pour des étudiants
                    </p>
                    <p className="text-base">
                        CROUStillant est un projet qui a pour but de fournir des
                        informations sur les menus des restaurants universitaires en
                        France et en Outre-Mer.
                    </p>
                    <Link href="/" className="underline text-base font-bold">
                        Participer au projet
                    </Link>
                </div>
                <aside className="overflow-hidden relative flex items-center justify-center w-full h-60 bg-[#F8E9E9] bg-opacity-40 rounded-xl">
                    <RadarsIcons
                        style={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            zIndex: "5",
                        }}
                    >
                        <UtensilsCrossed color="white" />
                    </RadarsIcons>
                    <RadarsIcons
                        style={{
                            position: "absolute",
                            bottom: "80px",
                            left: "60px",
                            zIndex: "5",
                        }}
                    >
                        <UtensilsCrossed color="white" />
                    </RadarsIcons>
                    <RadarsIcons
                        style={{
                            position: "absolute",
                            bottom: "15px",
                            right: "25px",
                            zIndex: "5",
                        }}
                    >
                        <UtensilsCrossed color="white" />
                    </RadarsIcons>
                    <RadarsIcons
                        style={{
                            position: "absolute",
                            bottom: "0px",
                            left: "35px",
                            zIndex: "5",
                        }}
                    >
                        <UtensilsCrossed color="white" />
                    </RadarsIcons>
                    <RadarsIcons
                        style={{
                            position: "absolute",
                            top: "15px",
                            right: "120px",
                            zIndex: "5",
                        }}
                    >
                        <UtensilsCrossed color="white" />
                    </RadarsIcons>
                    <RadarsIcons
                        style={{
                            position: "absolute",
                            top: "40px",
                            right: "5px",
                            zIndex: "5",
                        }}
                    >
                        <UtensilsCrossed color="white" />
                    </RadarsIcons>
                    <RadarsIcons big style={{ position: "absolute", zIndex: "10" }}>
                        <School className="size-12" color="white" />
                    </RadarsIcons>
                    <div className="z-[3] absolute rounded-full border-2 border-[#ffb9b9] bg-[radial-gradient(circle_at_center,_#ffd1d1_0%,_#ffbfbf_100%)] size-44" />
                    <div className="z-[2] absolute rounded-full border-2 border-[rgba(251,174,174,0.6)] bg-[radial-gradient(circle_at_center,_rgba(248,233,233,0.8)_0%,_rgba(255,201,201,0.8)_100%)] size-72" />
                    <div className="z-[1] absolute rounded-full border-2 border-[rgba(255,202,202,0.4)] bg-[radial-gradient(circle_at_center,_rgba(248,233,233,0.6)_0%,_rgba(255,221,221,0.6)_100%)] size-[430px]" />

                    <div className="z-[4] absolute animate-scan bg-[#ff46466a] rounded-full size-[500px]" />
                </aside>
            </aside>

        </section>

    );
};
export default RadarsCard;
