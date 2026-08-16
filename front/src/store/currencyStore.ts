import { create } from "zustand";


interface CurrencyStore {
    currency: string;
    setCurrency: (currency: string) => void;
}


export const useCurrencyStore =
    create<CurrencyStore>((set) => (
        {
            currency:
                localStorage.getItem("currency")
                || "uah",

            setCurrency: (currency) => {

                localStorage.setItem(
                    "currency",
                    currency
                );

                set({
                    currency
                });
            }
        }
    ));