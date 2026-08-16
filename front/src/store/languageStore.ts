import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "uk" | "en" | "sv";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "uk",

      setLanguage: (language) => {
        set({ language });
      },
    }),
    {
      name: "waygo-language",
    }
  )
);