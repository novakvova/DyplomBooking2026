import { X } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  ["UA", "Українська"],
  ["GB", "English"],
  ["CN", "汉语"],
  ["IN", "हिन्दी"],
  ["DE", "Deutsch"],
  ["IT", "Italiano"],
  ["ES", "Español"],
  ["NO", "Norsk"],
  ["MD", "Moldovenească"],
  ["SA", "العربية"],
  ["NL", "Nederlands"],
  ["KR", "한국어"],
  ["FR", "Français"],
  ["SE", "Svenska"],
  ["KZ", "Қазақ тілі"],
  ["BD", "বাংলা"],
  ["PL", "Polski"],
  ["LT", "Lietuvių"],
  ["PT", "Português"],
  ["HR", "Hrvatski"],
  ["GR", "Ελληνικά"],
  ["JP", "日本語"],
  ["CZ", "Čeština"],
  ["GE", "ქართული"],
];


const LanguageModal = ({ isOpen, onClose }: LanguageModalProps) => {

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

      <div
        className="
          relative
          w-[590px]
          rounded-2xl
          bg-[#385b75]
          p-8
          text-white
          shadow-2xl
          z-1010
        "
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onClose}
          className="
            absolute
            right-6
            top-5
            text-3xl
            text-white/70
            hover:text-white
          "
        >
          ×
        </button>

        <h2 className="mb-4 text-xl font-bold">
          Найпопулярніші мови:
        </h2>

        <div className="grid grid-cols-3 gap-y-5 text-sm mb-8">

          {languages.slice(0,3).map(([code, name]) => (
            <button
                key={name}
                className="flex items-center gap-2"
            >

                <ReactCountryFlag
                countryCode={code}
                svg
                className="w-6 h-5"
                />

                <span>{name}</span>

            </button>
          ))}

        </div>

        <h2 className="mb-5 text-xl font-bold">
          Всі мови:
        </h2>

        <div className="grid grid-cols-3 gap-y-5 text-sm">

          {languages.slice(3).map(([code, name]) => (
            <button
                key={name}
                className="flex items-center gap-2"
            >

                <ReactCountryFlag
                countryCode={code}
                svg
                className="w-6 h-5"
                />

                <span>{name}</span>

            </button>
          ))}

        </div>
      </div>
    </div>
  );
};


export default LanguageModal;