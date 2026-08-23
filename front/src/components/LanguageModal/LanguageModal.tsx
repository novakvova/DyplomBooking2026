import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { useLocation, useNavigate } from "react-router-dom";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Language {
  flag: string;
  code: string;
  name: string;
}

const languages: Language[] = [
  { flag: "UA", code: "uk", name: "Українська" },
  { flag: "GB", code: "en", name: "English" },
  { flag: "CN", code: "zh", name: "汉语" },
  { flag: "IN", code: "hi", name: "हिन्दी" },
  { flag: "DE", code: "de", name: "Deutsch" },
  { flag: "IT", code: "it", name: "Italiano" },
  { flag: "ES", code: "es", name: "Español" },
  { flag: "NO", code: "no", name: "Norsk" },
  { flag: "MD", code: "ro", name: "Moldovenească" },
  { flag: "SA", code: "ar", name: "العربية" },
  { flag: "NL", code: "nl", name: "Nederlands" },
  { flag: "KR", code: "ko", name: "한국어" },
  { flag: "FR", code: "fr", name: "Français" },
  { flag: "SE", code: "sv", name: "Svenska" },
  { flag: "KZ", code: "kk", name: "Қазақ тілі" },
  { flag: "BD", code: "bn", name: "বাংলা" },
  { flag: "PL", code: "pl", name: "Polski" },
  { flag: "LT", code: "lt", name: "Lietuvių" },
  { flag: "PT", code: "pt", name: "Português" },
  { flag: "HR", code: "hr", name: "Hrvatski" },
  { flag: "GR", code: "el", name: "Ελληνικά" },
  { flag: "JP", code: "ja", name: "日本語" },
  { flag: "CZ", code: "cs", name: "Čeština" },
  { flag: "GE", code: "ka", name: "ქართული" },
];

const supportedLanguages = languages.map((language) => language.code);

const LanguageModal = ({
  isOpen,
  onClose,
}: LanguageModalProps) => {
  // Hooks завжди викликаємо до будь-якого conditional return.
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLanguage =
    i18n.resolvedLanguage?.split("-")[0] ??
    i18n.language.split("-")[0];

  // ─────────────────────────────────────────────
  // Change language
  // ─────────────────────────────────────────────

  const handleLanguageChange = async (languageCode: string) => {
    if (!supportedLanguages.includes(languageCode)) return;

    await i18n.changeLanguage(languageCode);

    localStorage.setItem("waygo_language", languageCode);

    document.documentElement.lang = languageCode;
    document.documentElement.dir =
      languageCode === "ar" ? "rtl" : "ltr";

    const segments = location.pathname
      .split("/")
      .filter(Boolean);

    // Якщо URL вже починається з коду мови —
    // замінюємо тільки цей сегмент.
    if (
      segments.length > 0 &&
      supportedLanguages.includes(segments[0])
    ) {
      segments[0] = languageCode;
    } else {
      // Якщо мовного сегмента немає — додаємо його.
      segments.unshift(languageCode);
    }

    const newPath = `/${segments.join("/")}`;

    navigate(
      {
        pathname: newPath,
        search: location.search,
        hash: location.hash,
      },
      { replace: true }
    );

    onClose();
  };

  // Важливо: тільки після всіх hooks.
  if (!isOpen) return null;

  // ─────────────────────────────────────────────
  // Language button
  // ─────────────────────────────────────────────

  const renderLanguageButton = (language: Language) => {
    const isActive = currentLanguage === language.code;

    return (
      <button
        key={language.code}
        type="button"
        onClick={() => handleLanguageChange(language.code)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
          isActive
            ? "bg-white/15 font-semibold"
            : "hover:bg-white/10"
        }`}
      >
        <ReactCountryFlag
          countryCode={language.flag}
          svg
          style={{
            width: "24px",
            height: "18px",
          }}
        />

        <span>{language.name}</span>

        {isActive && (
          <span className="ml-auto text-sm text-white/80">
            ✓
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/40 pt-16 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-[1010] max-h-[calc(100vh-100px)] w-[590px] overflow-y-auto rounded-2xl bg-[#385b75] p-8 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute right-6 top-5 flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Popular languages */}
        <h2 className="mb-4 pr-10 text-xl font-bold">
          {t("languageModal.popular")}
        </h2>

        <div className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {languages
            .slice(0, 3)
            .map(renderLanguageButton)}
        </div>

        {/* All languages */}
        <h2 className="mb-4 text-xl font-bold">
          {t("languageModal.all")}
        </h2>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {languages
            .slice(3)
            .map(renderLanguageButton)}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;