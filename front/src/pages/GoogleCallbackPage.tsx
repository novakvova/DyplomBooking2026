import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../store/authStore";

const GoogleCallbackPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const fullName = searchParams.get("fullName");
    const rolesParam = searchParams.get("roles");

    const roles = rolesParam ? rolesParam.split(",") : [];

    // Мова, яку користувач використовував до Google login.
    const language = localStorage.getItem("waygo_language") || "uk";
    const homePath = `/${language}`;

    if (!token || !email) {
      console.error("Google login: token or email is missing");
      navigate(homePath, { replace: true });
      return;
    }

    setAuth(token, {
      email,
      fullName,
      roles,
    });

    navigate(homePath, { replace: true });
  }, [searchParams, setAuth, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-500">
        {t("auth.googleCallback.loading")}
      </p>
    </div>
  );
};

export default GoogleCallbackPage;