import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { destinationApi, wishlistApi } from "../api/api";
import { useAuthStore } from "../store/authStore";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";

import type { Destination } from "../types/destination";
import type { Housing } from "../types/housing";

import DestinationDropdown from "../components/DestinationSearch/DestinationDropdown";
import Footer from "../components/Footer/Footer";
import GuestsDropdown from "../components/GuestsDropdown/GuestsDropdown";
import DateDropdown from "../components/DateSearch/DateDropdown";
import HotDealsSection from "../components/HomeSections/HotDealsSection";
import PromoBanner from "../components/HomeSections/PromoBanner";
import PopularDestinationsSection from "../components/HomeSections/PopularDestinationsSection";
import TravelCategoriesSection from "../components/HomeSections/TravelCategoriesSection";
import SeasonBestSection from "../components/HomeSections/SeasonBestSection";

const HERO_NAV_ITEMS = [
  { key: "hotels", label: "Готелі" },
  { key: "housing", label: "Будинки та апартаменти" },
  { key: "excursions", label: "Екскурсії" },
  { key: "transport", label: "Транспорт" },
] as const;

type HeroNavKey = (typeof HERO_NAV_ITEMS)[number]["key"];

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [city, setCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [openDestination, setOpenDestination] = useState(false);
  const [openDates, setOpenDates] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  const [heroNav, setHeroNav] = useState<HeroNavKey | null>("hotels");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    babies: 0,
    pets: 0,
    rooms: 0,
  });

  const destinationRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  const [recentDestinations, setRecentDestinations] = useState<Destination[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("recentDestinations") || "[]");
    } catch {
      return [];
    }
  });

  const registerDestinationView = async (destination: Destination) => {
    try {
      await destinationApi.registerView(destination.id);
    } catch (error) {
      console.error("Failed to register destination view:", error);
    }
  };

  // Каталог житла з фільтрами й пагінацією живе окремо на /housing
  // (HousingListPage + useHousingList) — головна сторінка більше не
  // дублює його інлайн, а лише веде туди з обраним містом.
  const goToHousingList = (cityName?: string) => {
    navigate("/housing", {
      state: cityName ? { city: cityName } : undefined,
    });
  };

  // Toggle: повторний клік по вже активній вкладці знімає виділення
  // (heroNav стає null), інакше активною стає обрана вкладка.
  const handleHeroNavClick = (key: HeroNavKey) => {
    setHeroNav((current) => (current === key ? null : key));
  };

  // Перехід на сторінку каталогу відповідного розділу залежно від
  // активної вкладки hero-навігації. Якщо активна вкладка — "Готелі"
  // або "Будинки та апартаменти", то переходимо на /housing, якщо
  // "Екскурсії" — на /excursions, якщо "Транспорт" — на /cars.
  const goToSectionForActiveNav = (cityName?: string) => {
    if (heroNav === "transport") {
      navigate("/cars");
      return;
    }

    if (heroNav === "excursions") {
      navigate("/excursions");
      return;
    }

    goToHousingList(cityName);
  };

  const { data: wishlist = [] } = useQuery<Housing[]>({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getAll,
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: searchedDestinations = [] } = useQuery<Destination[]>({
    queryKey: ["destination-search", searchQuery],
    queryFn: () => destinationApi.search(searchQuery),
    enabled: searchQuery.length > 1,
    retry: false,
  });

  const { data: popularDestinations = [] } = useQuery<Destination[]>({
    queryKey: ["popular-destinations"],
    queryFn: destinationApi.getPopular,
  });

  const getDestinationCityName = (destination: Destination) =>
    t(`destinations.cities.${destination.slug}`, {
      defaultValue: destination.city,
    });

  const dropdownDestinations = useMemo(() => {
    const query = cityInput.trim().toLocaleLowerCase();

    if (!query) return popularDestinations.slice(0, 5);

    const uniqueDestinations = Array.from(
      new Map(
        [...searchedDestinations, ...popularDestinations].map((item) => [item.id, item])
      ).values()
    );

    return uniqueDestinations.filter((item) => {
      const backendCity = item.city.toLocaleLowerCase();
      const localizedCity = getDestinationCityName(item).toLocaleLowerCase();

      return backendCity.includes(query) || localizedCity.includes(query);
    });
  }, [cityInput, searchedDestinations, popularDestinations, t]);

  const handleDestinationSelect = (destination: Destination) => {
    const localizedCity = getDestinationCityName(destination);

    setCityInput(localizedCity);
    setCity(localizedCity);
    setOpenDestination(false);

    const updated = [
      destination,
      ...recentDestinations.filter((item) => item.id !== destination.id),
    ].slice(0, 3);

    localStorage.setItem("recentDestinations", JSON.stringify(updated));
    setRecentDestinations(updated);

    void registerDestinationView(destination);
  };

  const saveRecentDestination = (cityName: string) => {
    const query = cityName.trim().toLocaleLowerCase();

    const destination = [...searchedDestinations, ...popularDestinations].find((item) => {
      const backendCity = item.city.toLocaleLowerCase();
      const localizedCity = getDestinationCityName(item).toLocaleLowerCase();

      return backendCity === query || localizedCity === query;
    });

    if (!destination) return;

    const updated = [
      destination,
      ...recentDestinations.filter((item) => item.id !== destination.id),
    ].slice(0, 3);

    localStorage.setItem("recentDestinations", JSON.stringify(updated));
    setRecentDestinations(updated);
  };

  const handleSearch = async () => {
    const query = cityInput.trim().toLocaleLowerCase();

    const destination =
      selectedDestination ??
      [...searchedDestinations, ...popularDestinations].find((item) => {
        const backendCity = item.city.toLocaleLowerCase();
        const localizedCity = getDestinationCityName(item).toLocaleLowerCase();

        return backendCity === query || localizedCity === query;
      });

    let resolvedCity = cityInput.trim();

    if (destination) {
      resolvedCity = getDestinationCityName(destination);
      saveRecentDestination(resolvedCity);

      if (!selectedDestination) {
        await registerDestinationView(destination);
      }
    }

    setCity(resolvedCity);
    setSelectedDestination(null);
    setOpenDestination(false);

    // Результати пошуку тепер показуються на окремій сторінці
    // каталогу (або відповідному розділу — залежно від активної
    // вкладки hero-навігації), а не інлайн на головній.
    goToSectionForActiveNav(resolvedCity || undefined);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(cityInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [cityInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (destinationRef.current && !destinationRef.current.contains(target)) {
        setOpenDestination(false);
      }

      if (datesRef.current && !datesRef.current.contains(target)) {
        setOpenDates(false);
      }

      if (guestsRef.current && !guestsRef.current.contains(target)) {
        setOpenGuests(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* ───────────────── HERO ───────────────── */}

      <section
        className="
          relative flex min-h-[600px] w-full flex-col
          items-center justify-center overflow-visible
          bg-cover bg-center bg-no-repeat
        "
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      >
        <div className="absolute inset-0 z-0 bg-black/30" />

        <div
          className="
            relative z-[100] flex w-full max-w-[1320px]
            flex-col items-center px-4
            min-[1024px]:px-8
          "
        >
          {/* ───────── HERO TOP NAV ───────── */}

          <div
            className="
              mb-[44px] grid h-[58px] w-full max-w-[956px]
              grid-cols-4 overflow-hidden
              rounded-[20px] bg-white
            "
          >
            {HERO_NAV_ITEMS.map((item) => {
              const isActive = heroNav === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleHeroNavClick(item.key)}
                  aria-pressed={isActive}
                  className="
                    group/nav flex h-[58px] items-center justify-center
                    whitespace-nowrap bg-white px-2
                    text-center text-[20px] font-medium
                    leading-none tracking-normal
                    text-[#243C4E]
                    transition-colors hover:bg-[#F5F7F8]
                  "
                >
                  <span
                    className={`
                      border-b-2 pb-0.5 transition-colors
                      ${
                        isActive
                          ? "border-[#243C4E]"
                          : "border-transparent group-hover/nav:border-[#243C4E]/50"
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ───────── HERO TITLE ───────── */}

          <h1
            className="
              text-center text-3xl font-bold text-white
              drop-shadow-lg
              min-[1024px]:text-4xl
              min-[1500px]:text-5xl
            "
          >
            {t("home.hero.title")}
          </h1>

          {/* ───────────────── SEARCH ───────────────── */}

          <div
            className="
              relative z-20 mx-auto mt-7 flex w-full max-w-[1256px]
              flex-col rounded-[20px]
              bg-white/10 p-3
              shadow-[0_8px_24px_rgba(0,0,0,0.12)]
              backdrop-blur-md

              min-[1024px]:h-[82px]
              min-[1024px]:flex-row
              min-[1024px]:items-center
              min-[1024px]:p-1

              min-[1500px]:h-[92px]
            "
          >
            {/* Destination */}

            <div
              ref={destinationRef}
              className="
                relative z-30 flex min-h-[72px] min-w-0
                flex-col justify-center px-5

                min-[1024px]:h-full
                min-[1024px]:min-h-0
                min-[1024px]:w-[29%]
                min-[1024px]:shrink-0

                min-[1500px]:w-[360px]
                min-[1500px]:px-6
              "
            >
              <span
                className="
                  text-base font-semibold text-white
                  min-[1500px]:text-[20px]
                  min-[1500px]:leading-[25px]
                "
              >
                {t("home.search.where")}
              </span>

              <input
                type="text"
                value={cityInput}
                placeholder={t("home.search.destinationPlaceholder")}
                onFocus={() => {
                  setOpenDestination(true);
                  setOpenDates(false);
                  setOpenGuests(false);
                }}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setSelectedDestination(null);
                  setOpenDestination(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="
                  mt-1 w-full bg-transparent
                  text-base text-white/70
                  outline-none placeholder:text-white/55

                  min-[1500px]:h-[25px]
                  min-[1500px]:text-[20px]
                  min-[1500px]:leading-[25px]
                "
              />

              {openDestination && (
                <DestinationDropdown
                  destinations={dropdownDestinations}
                  recent={recentDestinations}
                  onSelect={handleDestinationSelect}
                />
              )}
            </div>

            <div
              className="
                hidden h-[56px] w-px shrink-0
                bg-white/70
                min-[1024px]:block
                min-[1500px]:h-[64px]
              "
            />

            {/* Dates */}

            <div
              ref={datesRef}
              className="
                relative z-30 flex min-h-[72px] min-w-0
                flex-1 items-center
                border-t border-white/20

                min-[1024px]:h-full
                min-[1024px]:min-h-0
                min-[1024px]:border-0
              "
            >
              <button
                type="button"
                onClick={() => {
                  setOpenDates((prev) => !prev);
                  setOpenDestination(false);
                  setOpenGuests(false);
                }}
                className="
                  flex h-full w-full flex-col
                  justify-center px-5 text-left
                  min-[1024px]:px-6
                  min-[1500px]:px-8
                "
              >
                <span
                  className="
                    text-base font-semibold text-white
                    min-[1500px]:text-[20px]
                    min-[1500px]:leading-[25px]
                  "
                >
                  {t("home.search.when")}
                </span>

                <span
                  className="
                    mt-1 truncate text-base text-white/60
                    min-[1500px]:text-[20px]
                    min-[1500px]:leading-[25px]
                  "
                >
                  {checkIn || checkOut
                    ? `${checkIn || t("home.search.checkInPlaceholder")} – ${
                        checkOut || t("home.search.checkOutPlaceholder")
                      }`
                    : t("home.search.dateRangePlaceholder")}
                </span>
              </button>

              {openDates && (
                <DateDropdown
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={setCheckIn}
                  onCheckOutChange={setCheckOut}
                  onClose={() => setOpenDates(false)}
                />
              )}
            </div>

            <div
              className="
                hidden h-[56px] w-px shrink-0
                bg-white/70
                min-[1024px]:block
                min-[1500px]:h-[64px]
              "
            />

            {/* Guests */}

            <div
              ref={guestsRef}
              className="
                relative z-30 flex min-h-[72px] min-w-0
                items-center border-t border-white/20

                min-[1024px]:h-full
                min-[1024px]:min-h-0
                min-[1024px]:w-[24%]
                min-[1024px]:shrink-0
                min-[1024px]:border-0

                min-[1500px]:w-[300px]
              "
            >
              <button
                type="button"
                onClick={() => {
                  setOpenGuests((prev) => !prev);
                  setOpenDestination(false);
                  setOpenDates(false);
                }}
                className="
                  flex h-full w-full flex-col
                  justify-center px-5 text-left
                  min-[1024px]:px-6
                  min-[1500px]:px-8
                "
              >
                <span
                  className="
                    text-base font-semibold text-white
                    min-[1500px]:text-[20px]
                    min-[1500px]:leading-[25px]
                  "
                >
                  {t("home.search.who")}
                </span>

                <span
                  className="
                    mt-1 truncate text-base text-white/55
                    min-[1500px]:text-[20px]
                    min-[1500px]:leading-[25px]
                  "
                >
                  {t("home.search.guestsSummary", {
                    guests: guests.adults + guests.children + guests.babies,
                    rooms: guests.rooms,
                  })}
                </span>
              </button>

              {openGuests && (
                <GuestsDropdown guests={guests} setGuests={setGuests} />
              )}
            </div>

            {/* Search button */}

            <button
              type="button"
              onClick={handleSearch}
              aria-label={t("home.search.searchButton")}
              className="
                mt-2 flex h-[52px] w-full shrink-0
                items-center justify-center
                rounded-[10px] bg-[#355872]
                text-white transition
                hover:bg-[#2d4b62]

                min-[1024px]:ml-3
                min-[1024px]:mr-2
                min-[1024px]:mt-0
                min-[1024px]:w-[72px]

                min-[1500px]:w-[100px]
              "
            >
              <svg
                className="
                  h-6 w-6
                  min-[1500px]:h-8
                  min-[1500px]:w-8
                "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m20 20-4.3-4.3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────── HOT DEALS ─────────────── */}

      <HotDealsSection wishlist={wishlist} />

      {/* ─────────────── PROMO BANNER ─────────────── */}

      <div className="py-4">
        <PromoBanner onBrowseClick={() => goToHousingList()} />
      </div>

      {/* ─────────────── POPULAR DESTINATIONS ─────────────── */}

      <PopularDestinationsSection
        onDestinationSelect={(destination) => {
          handleDestinationSelect(destination);
          goToHousingList(getDestinationCityName(destination));
        }}
      />

      {/* ─────────────── TRAVEL CATEGORIES ─────────────── */}

      <TravelCategoriesSection wishlist={wishlist} />

      {/* ─────────────── SEASON BEST ─────────────── */}

      <SeasonBestSection wishlist={wishlist} />

      <Footer />
    </div>
  );
};

export default HomePage;