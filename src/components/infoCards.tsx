import { Clock, CreditCard, ForkKnifeCrossed, MapPin } from "lucide-react"
import BasicCard from "./cards/basicCard"

const InfoCards = () => {
    return(
        <section id="#info" className="container ">
            <h2 className="2xl:mt-28 lg:text-6xl lg:text-center lg:max-w-[80%] lg:mx-auto text-3xl font-bold leading-tight bg-gradient-to-r from-[#151414] via-[#151414] to-[#E40514] bg-clip-text text-transparent">Toutes les informations sur votre restaurant</h2>
            <aside className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 lg:mt-10">
                <BasicCard
                    title="Recherche par région, ville ou restaurant"
                    description="Lorem ipsum dolor sit amet. Eos voluptate molestiae aut maiores expedita et quae galisum. Vel nemo ipsa est magni "
                >
                    <MapPin height={200} width={125} color="#555555" opacity={0.1} />
                </BasicCard>
                <BasicCard
                    title="Horaires d'ouverture et de fermeture"
                    description="Lorem ipsum dolor sit amet. Eos voluptate molestiae aut maiores expedita et quae galisum. Vel nemo ipsa est magni "
                >
                    <Clock height={200} width={125} color="#555555" opacity={0.1} />
                </BasicCard>
                <BasicCard
                    title="Contacts et moyens de paiement acceptés"
                    description="Lorem ipsum dolor sit amet. Eos voluptate molestiae aut maiores expedita et quae galisum. Vel nemo ipsa est magni "
                >
                    <CreditCard height={200} width={125} color="#555555" opacity={0.1} />
                </BasicCard>
                <BasicCard
                    title="Accès à tous les restaurants"
                    description="Lorem ipsum dolor sit amet. Eos voluptate molestiae aut maiores expedita et quae galisum. Vel nemo ipsa est magni "
                    style={" md:bg-[#DAD6D6] md:bg-opacity-15"}
                >
                    <ForkKnifeCrossed height={200} width={125} color="#555555" opacity={0.1} />
                </BasicCard>
            </aside>
        </section>
    )
}
export default InfoCards