"use client";

import dynamic from "next/dynamic";
import { useEasterEgg } from "@/hooks/useEasterEgg";

// The game — and the API call it makes — must never be part of what a
// restaurant page downloads to render, so the chunk is only fetched once the
// hidden trigger fires. `ssr: false` keeps it out of the server render too.
const DishDuel = dynamic(() => import("./dish-duel"), { ssr: false });

/**
 * Mounts the hidden dish duel on a page.
 *
 * Rendering this costs a pair of document listeners; everything else (the game
 * UI and its data) is loaded lazily, and only for the players who find it.
 * Mark the element that unlocks it on touch devices with `data-easter-egg`.
 */
export default function EasterEggLauncher() {
  const { unlocked, close } = useEasterEgg();

  if (!unlocked) return null;

  return <DishDuel onClose={close} />;
}
