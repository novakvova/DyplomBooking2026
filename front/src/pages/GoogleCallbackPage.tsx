import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const fullName = searchParams.get("fullName");
    const rolesParam = searchParams.get("roles");

    const roles = rolesParam
      ? rolesParam.split(",")
      : [];

    if (!token || !email) {
      console.error("Google login: token або email відсутній");
      navigate("/");
      return;
    }

    setAuth(
      token,
      {
        email,
        fullName,
        roles,
      }
    );

    navigate("/");
  }, [searchParams, setAuth, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-500">
        Виконуємо вхід через Google...
      </p>
    </div>
  );
};

export default GoogleCallbackPage;