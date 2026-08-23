import { useQuery } from "@tanstack/react-query";
import { currencyApi } from "../api/currencyApi";
import { useCurrencyStore } from "../store/currencyStore";

export const useCurrency = () => {
    const currency = useCurrencyStore(state => state.currency);

    const { data } = useQuery({

        queryKey: [
            "currency",
            currency
        ],

        queryFn: () => currencyApi.getRates("uah"),

        staleTime: 1000 * 60 * 60 * 12 // оновлення курсу валют кожні 12 годин

    });


    const convert = (price: number) => {
        if (currency === "uah")
            return price;

        const rate = data?.uah?.[currency];

        if (!rate)
            return price;

        return Math.round(
            price * rate
        );
    };

    return {
        currency,
        convert
    };

};