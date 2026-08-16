import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AuthModal from '../AuthModal/AuthModal';
import LanguageModal from "../LanguageModal/LanguageModal";
import CurrencyModal from "../CurrencyModal/CurrencyModal";
import DropdownProfileModal from "../DropdownProfileModal/DropdownProfileModal";
import { useCurrencyStore } from "../../store/currencyStore";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currency = useCurrencyStore(state => state.currency);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const profileList = [
    {
      title: "Мій акаунт",
      icon: "/images/icons/user.svg"
    },
    {
      title: "Список бажань",
      icon: "/images/icons/like.svg"
    },
    {
      title: "Мої подорожі",
      icon: "/images/icons/my_travels.svg"
    },
    {
      title: "Відгуки",
      icon: "/images/icons/reviews.svg"
    },
    {
      title: "Вийти",
      icon: "/images/icons/exit.svg"
    }
  ];

  console.log(profileList);

  return (
    <>
      <header className={`z-40 w-full transition-all duration-300 ${isHomePage ? "absolute top-0 left-0 bg-transparent text-white" : "sticky top-0 bg-white text-slate-800 shadow-sm"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link to="/" className="flex items-center">
              <img src="/images/logos/Logo_WayGo.png" alt="WayGo" className="h-8 w-auto"/>
          </Link>

          {/* Nav */}
          <nav className={`hidden md:flex items-center gap-6 text-sm font-medium ${isHomePage ? "text-white" : "text-slate-600"}`}>
            <Link to="/" className="hover:text-slate-900 transition">Головна</Link>
            <Link to="/housing" className="hover:text-slate-900 transition">Житло</Link>
            {isAuthenticated && (
              <Link to="/profile" className="hover:text-slate-900 transition">Мої бронювання</Link>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button onClick={() => setLanguageOpen(true)} className="flex items-center" >
                  <img src="/images/icon_language.svg" alt="language" className="h-6 w-6" />
                </button>

                <button onClick={() => setCurrencyOpen(true)}>
                  {currency.toUpperCase()}
                </button>

                <button onClick={() => navigate("/housing/register")}>
                  Зареєструвати житло
                </button>

                <DropdownProfileModal
                  title="Профіль"
                  options={profileList}
                  onSelect={(item) => {

                    if (item.title === "Мій акаунт") {
                      navigate("/profile");
                    }
                    
                    if (item.title === "Список бажань") {
                      navigate("/wishlist");
                    }

                    if (item.title === "Мої подорожі") {
                      navigate("/bookings");
                    }

                    if (item.title === "Вийти") {
                      handleLogout();
                    }

                  }}
                />
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
                Увійти
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <CurrencyModal
        isOpen={currencyOpen}
        onClose={() => setCurrencyOpen(false)}
        selectedCurrency={currency.toUpperCase()}
        setSelectedCurrency={() => {}}
      />
      <LanguageModal isOpen={languageOpen} onClose={() => setLanguageOpen(false)} />
    </>
  );
};

export default Header;
