import ApiCard from "./cards/ApiCard"
import GitCard from "./cards/gitCard"
import RadarsCard from "./cards/radarsCard"

const JoinTeam = () => {
    return(
        <section id="team" className="container flex flex-col gap-6 lg:gap-10 ">
            <h2 className="mt-32 lg:text-6xl lg:text-center lg:max-w-[60%] lg:mx-auto text-3xl font-bold leading-tight bg-gradient-to-r from-[#151414] via-[#151414] to-[#E40514] bg-clip-text text-transparent ">Faites partie de l’équipe</h2>
            <section className="grid grid-cols-1 md:grid-cols-2 mb-32 gap-x-4 gap-y-2">
                <RadarsCard />
                <GitCard />
                <ApiCard style="md:col-span-2"/>
            </section>
          </section>
    )
}
export default JoinTeam