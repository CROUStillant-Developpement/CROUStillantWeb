import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface BlockConfig {
  id: string;
  enabled: boolean;
}

export const INITIAL_BLOCKS: BlockConfig[] = [
  { id: "header",      enabled: true  },
  { id: "header_text", enabled: false },
  { id: "region",      enabled: false },
  { id: "status",      enabled: true  },
  { id: "address",     enabled: false },
  { id: "menu",        enabled: true  },
  { id: "hours",       enabled: true  },
  { id: "contact",     enabled: false },
  { id: "payment",     enabled: false },
  { id: "access",      enabled: false },
  { id: "link",        enabled: false },
];

export interface PersistedBuilderState {
  restaurantCode: number | null;
  blocks: BlockConfig[];
  theme: "light" | "dark";
  color: string;
  font: string;
  meals: string[];
  width: number;
  height: number;
  lang: "fr" | "en";
}

const DEFAULT_STATE: PersistedBuilderState = {
  restaurantCode: null,
  blocks: INITIAL_BLOCKS,
  theme: "light",
  color: "ef4444",
  font: "Inter",
  meals: ["midi"],
  width: 480,
  height: 600,
  lang: "fr",
};

interface BuilderStore extends PersistedBuilderState {
  update: <K extends keyof PersistedBuilderState>(key: K, value: PersistedBuilderState[K]) => void;
  reset: () => void;
}

export const useIframeBuilderStore = create<BuilderStore>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      update: (key, value) => set({ [key]: value } as Partial<BuilderStore>),
      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: "iframe-builder-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
