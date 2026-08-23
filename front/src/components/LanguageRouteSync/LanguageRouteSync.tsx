import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const supportedLanguages = [
  "uk",
  "en",
  "sv",
];


const LanguageRouteSync = () => {
  const { i18n } = useTranslation();

  const { lang } = useParams();

  const navigate = useNavigate();


  useEffect(() => {
    // Якщо мова в URL некоректна —
    // повертаємо на українську.
    if (
      !lang ||
      !supportedLanguages.includes(lang)
    ) {
      navigate(
        "/uk",
        {
          replace: true,
        }
      );

      return;
    }


    // Якщо URL-мова відрізняється від поточної i18n —
    // перемикаємо i18next.
    if (
      i18n.language !== lang
    ) {
      i18n.changeLanguage(lang);
    }

    localStorage.setItem(
      "waygo_language",
      lang
    );

    document.documentElement.lang =
      lang;

    document.documentElement.dir =
      lang === "ar"
        ? "rtl"
        : "ltr";

  }, [
    lang,
    i18n,
    navigate,
  ]);

  return null;
};


export default LanguageRouteSync;