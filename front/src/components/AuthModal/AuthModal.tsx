import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { authApi } from "../../api/api";
import { useAuthStore } from "../../store/authStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
}

interface ForgotForm {
  email: string;
}

const AuthModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();

  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>();
  const forgotForm = useForm<ForgotForm>();

  if (!isOpen) return null;

  // ─────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);

    try {
      const res = await authApi.login(data.email, data.password);

      setAuth(res.token, {
        email: res.email,
        fullName: res.fullName,
        roles: res.roles,
      });

      toast.success(
        t("auth.toast.welcome", {
          name: res.fullName ?? res.email,
        })
      );

      onClose();
    } catch {
      toast.error(t("auth.toast.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Register
  // ─────────────────────────────────────────────

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true);

    try {
      const res = await authApi.register(
        data.email,
        data.password,
        data.fullName
      );

      setAuth(res.token, {
        email: res.email,
        fullName: res.fullName,
        roles: res.roles,
      });

      toast.success(t("auth.toast.registerSuccess"));
      onClose();
    } catch {
      toast.error(t("auth.toast.registerError"));
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Forgot password
  // ─────────────────────────────────────────────

  const handleForgot = async (data: ForgotForm) => {
    setLoading(true);

    try {
      await authApi.forgotPassword(data.email);

      toast.success(t("auth.toast.resetSent"));
      setTab("login");
    } catch {
      toast.error(t("auth.toast.resetError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="relative z-[20001] w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {tab === "login" && t("auth.login.title")}
            {tab === "register" && t("auth.register.title")}
            {tab === "forgot" && t("auth.forgot.title")}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="text-xl text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Google login */}
          {tab !== "forgot" && (
            <a
              href="http://localhost:5080/api/auth/google/login"
              className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>

              {t("auth.google")}
            </a>
          )}

          {tab !== "forgot" && (
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">
                {t("auth.or")}
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          )}

          {/* Login */}
          {tab === "login" && (
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder={t("auth.fields.email")}
                {...loginForm.register("email", { required: true })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />

              <input
                type="password"
                placeholder={t("auth.fields.password")}
                {...loginForm.register("password", { required: true })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-800 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
              >
                {loading
                  ? t("common.loading")
                  : t("auth.login.submit")}
              </button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="text-slate-500 hover:text-slate-800"
                >
                  {t("auth.login.noAccount")}
                </button>

                <button
                  type="button"
                  onClick={() => setTab("forgot")}
                  className="text-slate-500 hover:text-slate-800"
                >
                  {t("auth.login.forgotPassword")}
                </button>
              </div>
            </form>
          )}

          {/* Register */}
          {tab === "register" && (
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder={t("auth.fields.fullName")}
                {...registerForm.register("fullName", { required: true })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />

              <input
                type="email"
                placeholder={t("auth.fields.email")}
                {...registerForm.register("email", { required: true })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />

              <input
                type="password"
                placeholder={t("auth.fields.passwordRegister")}
                {...registerForm.register("password", {
                  required: true,
                  minLength: 6,
                })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-800 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
              >
                {loading
                  ? t("auth.register.loading")
                  : t("auth.register.submit")}
              </button>

              <button
                type="button"
                onClick={() => setTab("login")}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-800"
              >
                {t("auth.register.haveAccount")}
              </button>
            </form>
          )}

          {/* Forgot password */}
          {tab === "forgot" && (
            <form
              onSubmit={forgotForm.handleSubmit(handleForgot)}
              className="space-y-4"
            >
              <p className="text-sm text-slate-500">
                {t("auth.forgot.description")}
              </p>

              <input
                type="email"
                placeholder={t("auth.fields.email")}
                {...forgotForm.register("email", { required: true })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-800 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
              >
                {loading
                  ? t("auth.forgot.sending")
                  : t("auth.forgot.submit")}
              </button>

              <button
                type="button"
                onClick={() => setTab("login")}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-800"
              >
                ← {t("auth.forgot.back")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;