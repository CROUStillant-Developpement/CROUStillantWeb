// store/pwaStore.ts
import { create } from 'zustand';

// Chromium-only event, absent from TypeScript's DOM typings.
export interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PwaStore {
    // The browser fires `beforeinstallprompt` once, early in the page's life,
    // so it is captured globally (see PwaProvider) and kept here until a
    // component — the settings page — offers the install. Null when the
    // browser has not offered one, or once it has been used.
    installPrompt: BeforeInstallPromptEvent | null;
    setInstallPrompt: (event: BeforeInstallPromptEvent | null) => void;
}

const usePwaStore = create<PwaStore>((set) => ({
    installPrompt: null,
    setInstallPrompt: (installPrompt) => set({ installPrompt }),
}));

export default usePwaStore;
