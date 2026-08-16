const PRIMARY_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const FALLBACK_URL =
  "https://latest.currency-api.pages.dev/v1/currencies";

export const currencyApi = {

  getRates: async (
    baseCurrency: string = "uah"
  ) => {

    try {
      const response = await fetch(
        `${PRIMARY_URL}/${baseCurrency}.json`
      );

      if (!response.ok) {
        throw new Error();
      }

      return await response.json();
    } catch {
      const response = await fetch(
        `${FALLBACK_URL}/${baseCurrency}.json`
      );

      return await response.json();
    }
  }
};