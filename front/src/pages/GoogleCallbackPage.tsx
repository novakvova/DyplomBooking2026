import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../store/authStore";

// Має відповідати ADMIN_ROLES у store/authStore.ts.
const ADMIN_ROLES = ["Admin", "Manager"];

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
    const isAdmin = roles.some((role) => ADMIN_ROLES.includes(role));

    // Мова, яку користувач використовував до Google login.
    const language = localStorage.getItem("waygo_language") || "uk";
    const homePath = `/${language}`;

    if (!token || !email) {
      console.error("Google login: token or email is missing");
      navigate(homePath, { replace: true });
      return;  
    }

    // setAuth пише в спільний auth-стор (той самий, що читає
    // ProtectedRoute адмінки), тому Google-логін коректно працює
    // і для звичайних користувачів, і для Admin/Manager.
    setAuth(token, {
      email,
      fullName,
      roles,
    });

    // Адмінів/менеджерів, що заходили через Google з адмінського
    // /login, повертаємо в адмінку, а не на публічну головну.
    navigate(isAdmin ? "/admin" : homePath, { replace: true });
  }, [searchParams, setAuth, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-500">
        {t("auth.googleCallback.loading", "Виконуємо вхід...")}
      </p>
    </div>
  );
};

export default GoogleCallbackPage;
