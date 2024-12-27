import { useTranslations } from "next-intl";
import Image from "next/image";
import Logo from "./logo";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-grey align-center flex w-full flex-col border-t px-10 py-10 font-medium md:px-0">
      <div className="mx-auto flex w-full justify-between gap-[20px] border-b px-10 pb-10 pt-10 lg:!w-2/3 lg:px-0">
        <div className="flex flex-col">
          <Logo />
          <div className="mt-6">
            <h1 className="text-2xl font-bold opacity-80">CROUStillant</h1>
            <div className="flex flex-row mt-4 items-center gap-2">
              <div className="mt-4 flex opacity-90">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/CROUStillant-Developpement"
                >
                  <Image
                    src="/icons/github.svg"
                    width={20}
                    height={20}
                    alt="GitHub"
                  />
                </a>
              </div>
              <div className="mt-4 flex opacity-70">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://discord.gg/yG6FjqbWtk"
                >
                  <Image
                    src="/icons/discord.svg"
                    width={20}
                    height={20}
                    alt="Discord"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <div>
            <h2 className="text-md font-bold opacity-80">Découvrir</h2>
            <ul className="mt-4 font-normal opacity-70">
              <li>
                <a className="hover:underline" href="/menus">
                  Menus
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/restaurants">
                  Restaurants
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/plats">
                  Plats
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/statistiques">
                  Statistiques
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-10 md:ml-12 md:mt-0 lg:ml-24">
            <h2 className="text-md font-bold opacity-80">À propos</h2>
            <ul className="mt-4 font-normal opacity-70">
              <li>
                <a className="hover:underline" href="/a-propos">
                  À propos
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/equipe">
                  L'équipe
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/contact">
                  Contact
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/mentions-legales">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-10 md:ml-12 md:mt-0 lg:ml-24">
            <h2 className="text-md font-bold opacity-80">Liens utiles</h2>
            <ul className="mt-4 font-normal opacity-70">
              <li>
                <a
                  className="hover:underline"
                  href="https://github.com/CROUStillant-Developpement"
                  target="_blank"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className="hover:underline"
                  href="https://discord.gg/yG6FjqbWtk"
                  target="_blank"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  className="hover:underline"
                  href="https://uptime.bayfield.dev/status/croustillant"
                  target="_blank"
                >
                  Statut
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full flex flex-col px-10 pt-10 lg:!w-2/3 lg:px-0 text-xs font-normal opacity-70">
        <p>{t("authors")}</p>
        <p className="mt-2 font-semibold">
          © {new Date().getFullYear()} CROUStillant Développement, tous droits
          réservés.
        </p>
        <p className="mt-2 italic">
          CROUStillant n'est pas affilié au "CROUS". CROUStillant n'est pas un
          projet à but lucratif.
        </p>
      </div>
    </footer>
  );
}
