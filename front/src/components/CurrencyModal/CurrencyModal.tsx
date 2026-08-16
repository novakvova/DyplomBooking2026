import { useState } from "react";
import { useCurrencyStore } from "../../store/currencyStore";

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
}

const popularCurrencies = [
  { code: "UAH", name: "Гривня" },
  { code: "USD", name: "Долар США" },
  { code: "EUR", name: "Євро" },
];

const currencies = [
  //{ code: "AFN", name: "Афгані" },
  { code: "SEK", name: "Крона" },
  { code: "MKD", name: "Денар" },
  { code: "DKK", name: "Крона" },

  { code: "THB", name: "Бат" },
  { code: "LYD", name: "Динар" },
  { code: "HRK", name: "Куна" },

  { code: "PAB", name: "Бальбоа" },
  { code: "AED", name: "Дирхам" },
  { code: "GEL", name: "Ларі" },

  { code: "ETB", name: "Бир" },
  { code: "VND", name: "Донг" },
  { code: "TRY", name: "Ліра" },

  { code: "VEB", name: "Болівар" },
  { code: "AMD", name: "Драм" },
  { code: "BAM", name: "Марка" },

  { code: "KRW", name: "Вона" },
  { code: "PLN", name: "Злота" },
  { code: "AZN", name: "Манат" },

  { code: "ANG", name: "Гульден" },
  { code: "JPY", name: "Єна" },
  { code: "ARS", name: "Песо" },
];


const CurrencyModal = ({ isOpen, onClose, selectedCurrency, setSelectedCurrency}: CurrencyModalProps) => {
  const setCurrency = useCurrencyStore(state => state.setCurrency);

  const selectCurrency = (code: string) => {
      setCurrency(code.toLowerCase());
      setSelectedCurrency(code);
      onClose();
  };

    if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-1000
        flex
        items-start
        justify-center
        pt-16
        bg-black/40
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      {/* список валют */}
      <div
        className="
          relative
          w-[640px]
          rounded-[20px]
          bg-[#355872]
          p-8
          text-white
          shadow-2xl
          z-1010
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute
            right-6
            top-5
            text-4xl
            text-white/60
            hover:text-white
          "
        >
          ×
        </button>


        <h2 className="text-xl font-bold mb-5">
          Найпопулярніші валюти:
        </h2>


        <div className="grid grid-cols-3 gap-5 mb-8">

          {popularCurrencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => selectCurrency(currency.code)}
              className={`
                flex
                gap-4
                items-center
                text-left
                rounded-md
                px-2
                py-1
                transition

                ${
                  selectedCurrency === currency.code
                  ? "border border-white"
                  : "hover:bg-white/10"
                }
              `}
            >

              <span className="font-bold">
                {currency.code}
              </span>

              <span>
                {currency.name}
              </span>

            </button>
          ))}

        </div>



        <h2 className="text-xl font-bold mb-5">
          Всі валюти:
        </h2>


        <div className="grid grid-cols-3 gap-y-6">

          {currencies.map((currency) => (

            <button
              key={currency.code}
              onClick={() => selectCurrency(currency.code)}
              className="
                flex
                gap-4
                text-left
                hover:text-white/70
                transition
              "
            >

              <span className="font-bold w-12">
                {currency.code}
              </span>

              <span>
                {currency.name}
              </span>

            </button>

          ))}

        </div>

      </div>

    </div>
  );
};


export default CurrencyModal;