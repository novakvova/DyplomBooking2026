import { useQuery } from "@tanstack/react-query";
import { currencyApi } from "../api/currencyApi";
import { useCurrencyStore } from "../store/currencyStore";

export const useCurrency = () => {
  const currency = useCurrencyStore((state) => state.currency);

  const { data } = useQuery({
    queryKey: ["currency-rates", "uah"],
    queryFn: () => currencyApi.getRates("uah"),
    staleTime: 1000 * 60 * 60 * 12,
  });

  const rate =
    currency === "uah"
      ? 1
      : data?.uah?.[currency] ?? 1;

  // UAH -> вибрана валюта
  const convert = (price: number) => {
    if (currency === "uah") return price;

    return Math.round(price * rate);
  };

  // Вибрана валюта -> UAH
  const toBaseCurrency = (price: number) => {
    if (currency === "uah") return price;

    return Math.round(price / rate);
  };

  const getCurrencySymbol = () => {
    try {
      const parts = new Intl.NumberFormat("uk-UA", {
        style: "currency",
        currency: currency.toUpperCase(),
        currencyDisplay: "narrowSymbol",
      }).formatToParts(0);

      return (
        parts.find((part) => part.type === "currency")?.value ??
        currency.toUpperCase()
      );
    } catch {
      return currency.toUpperCase();
    }
  };

  return {
    currency,
    currencyCode: currency.toUpperCase(),
    currencySymbol: getCurrencySymbol(),
    convert,
    toBaseCurrency,
  };
};