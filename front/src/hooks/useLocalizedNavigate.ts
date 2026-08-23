import {
  useNavigate,
  useParams,
  type NavigateOptions,
} from "react-router-dom";

const DEFAULT_LANGUAGE = "uk";

const useLocalizedNavigate = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const currentLanguage = lang || DEFAULT_LANGUAGE;

  const localizedNavigate = (
    path: string,
    options?: NavigateOptions
  ) => {
    const normalizedPath = path
      ? path.startsWith("/") ? path : `/${path}`
      : "";

    navigate(
      `/${currentLanguage}${normalizedPath}`,
      options
    );
  };

  return localizedNavigate;
};

export default useLocalizedNavigate;