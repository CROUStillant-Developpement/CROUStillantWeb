import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Represents the state of the user onboarding store.
 */
interface StoreState {
  step: number; // Current step in onboarding
  completed: boolean; // Whether the onboarding is completed
  setStep: (step: number) => void; // Function to update the step
  completeOnboarding: () => void; // Function to mark onboarding as complete
  resetOnboarding: () => void; // Function to reset onboarding progress
}

export const onboardingStore = create<StoreState>()(
  persist(
    (set) => ({
      step: 1,
      completed: false,
      setStep: (step) => set({ step }),
      completeOnboarding: () => set({ completed: true }),
      resetOnboarding: () => set({ step: 1, completed: false }),
    }),
    {
      name: "onboarding-store", // Unique name for storage
      storage: createJSONStorage(() => localStorage), // Persist to localStorage
    }
  )
);
