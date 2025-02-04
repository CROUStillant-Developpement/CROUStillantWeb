"use client";

import { Link } from "@/i18n/routing";
import { slugify } from "@/lib/utils";
import { useUserPreferences } from "@/store/userPreferencesStore";

interface IFavQuickAccessProps {
  text: string;
}

export default function FavQuickAccess({ text }: IFavQuickAccessProps) {
  const { starredFav } = useUserPreferences();

  return (
    <Link
      href={
        starredFav
          ? `/restaurants/${slugify(starredFav.name)}-r${starredFav.code}`
          : "/restaurants"
      }
      className="hover:underline"
    >
      {text}
    </Link>
  );
}
