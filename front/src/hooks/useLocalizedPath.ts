import { useParams } from "react-router-dom";

const DEFAULT_LANGUAGE = "uk";

const useLocalizedPath = () => {
  const { lang } = useParams();

  const currentLanguage = lang || DEFAULT_LANGUAGE;

  return (path = "") => {
    const normalizedPath = path
      ? path.startsWith("/") ? path : `/${path}`
      : "";

    return `/${currentLanguage}${normalizedPath}`;
  };
};

export default useLocalizedPath;