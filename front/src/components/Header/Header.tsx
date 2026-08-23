import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../../store/authStore";
import { useCurrencyStore } from "../../store/currencyStore";

import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
import useLocalizedPath from "../../hooks/useLocalizedPath";

import AuthModal from "../AuthModal/AuthModal";
import LanguageModal from "../LanguageModal/LanguageModal";
import CurrencyModal from "../CurrencyModal/CurrencyModal";
import DropdownProfileModal, {
  type DropdownOption,
} from "../DropdownProfileModal/DropdownProfileModal";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const localizedNavigate = useLocalizedNavigate();
  const localizedPath = useLocalizedPath();

  const { isAuthenticated, logout } = useAuthStore();
  const currency = useCurrencyStore((state) => state.currency);

  const [authOpen, setAuthOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  // /uk, /en, /sv тощо вважаємо головною сторінкою.
  const homePath = localizedPath();
  const isHomePage =
    location.pathname === homePath ||
    location.pathname === `${homePath}/`;

  // ─────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────

  const handleLogout = () => {
    logout();
    localizedNavigate("");
  };

  // ─────────────────────────────────────────────
  // PROFILE MENU
  // ─────────────────────────────────────────────

  const profileList: DropdownOption[] = [
    {
      key: "account",
      title: t("header.profile.account"),
      icon: "/images/icons/user.svg",
    },
    {
      key: "wishlist",
      title: t("header.profile.wishlist"),
      icon: "/images/icons/like.svg",
    },
    {
      key: "trips",
      title: t("header.profile.trips"),
      icon: "/images/icons/my_travels.svg",
    },
    {
      key: "reviews",
      title: t("header.profile.reviews"),
      icon: "/images/icons/reviews.svg",
    },
    {
      key: "logout",
      title: t("header.profile.logout"),
      icon: "/images/icons/exit.svg",
    },
  ];

  const handleProfileSelect = (item: DropdownOption) => {
    switch (item.key) {
      case "account":
        localizedNavigate("/profile");
        break;

      case "wishlist":
        localizedNavigate("/wishlist");
        break;

      case "trips":
        localizedNavigate("/booking");
        break;

      case "reviews":
        localizedNavigate("/reviews");
        break;

      case "logout":
        handleLogout();
        break;
    }
  };

  return (
    <>
      <header
        className={`z-[900] w-full transition-all duration-300 ${
          isHomePage
            ? "absolute left-0 top-0 bg-transparent text-white"
            : "sticky top-0 bg-white text-slate-800 shadow-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to={localizedPath()} className="flex items-center">
            <img
              src="/images/logos/WhiteLogo_WayGo.png"
              alt="WayGo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav
            className={`hidden items-center gap-6 text-sm font-medium md:flex ${
              isHomePage ? "text-white" : "text-slate-600"
            }`}
          >
            <Link
              to={localizedPath()}
              className="transition hover:text-slate-900"
            >
              {t("header.navigation.home")}
            </Link>

            <Link
              to={localizedPath("/housing")}
              className="transition hover:text-slate-900"
            >
              {t("header.navigation.housing")}
            </Link>

            {isAuthenticated && (
              <Link
                to={localizedPath("/booking")}
                className="transition hover:text-slate-900"
              >
                {t("header.navigation.bookings")}
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Language */}
                <button
                  type="button"
                  onClick={() => setLanguageOpen(true)}
                  className="flex items-center"
                  aria-label={t("header.actions.language")}
                >
                  <img
                    src="/images/icon_language.svg"
                    alt={t("header.actions.language")}
                    className="h-6 w-6"
                  />
                </button>

                {/* Currency */}
                <button
                  type="button"
                  onClick={() => setCurrencyOpen(true)}
                  aria-label={t("header.actions.currency")}
                >
                  {currency.toUpperCase()}
                </button>

                {/* Register housing */  /* Create housing */}
                <button
                  type="button"
                  onClick={() => localizedNavigate("/housing/create")}
                >
                  {t("header.actions.registerHousing")}
                </button>

                {/* Profile */}
                <DropdownProfileModal
                  title={t("header.profile.title")}
                  options={profileList}
                  onSelect={handleProfileSelect}
                  variant={isHomePage ? "hero" : "light"}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                {t("header.actions.login")}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      <CurrencyModal
        isOpen={currencyOpen}
        onClose={() => setCurrencyOpen(false)}
        selectedCurrency={currency.toUpperCase()}
        setSelectedCurrency={() => {}}
      />

      <LanguageModal
        isOpen={languageOpen}
        onClose={() => setLanguageOpen(false)}
      />
    </>
  );
};

export default Header;