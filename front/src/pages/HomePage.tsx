import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { destinationApi, housingApi, wishlistApi } from "../api/api";
import { useAuthStore } from "../store/authStore";

import type { Destination } from "../types/destination";
import type { Housing } from "../types/housing";

import DestinationDropdown from "../components/DestinationSearch/DestinationDropdown";
import PopularDestinations from "../components/Destinations/PopularDestinations";
import Footer from "../components/Footer/Footer";
import GuestsDropdown from "../components/GuestsDropdown/GuestsDropdown";
import DateDropdown from "../components/DateSearch/DateDropdown";
import HousingCard from "../components/HousingCard/HousingCard";

const PAGE_SIZE_OPTIONS = [8, 12, 24, 48];

const CATEGORIES = [
  { key: "all", labelKey: "home.categories.all" },
  { key: "Apartment", labelKey: "home.categories.apartments" },
  { key: "House", labelKey: "home.categories.houses" },
  { key: "Villa", labelKey: "home.categories.villas" },
  { key: "Studio", labelKey: "home.categories.studios" },
  { key: "Room", labelKey: "home.categories.rooms" },
];

const HERO_NAV_ITEMS = [
  { key: "hotels", label: "Готелі" },
  { key: "housing", label: "Будинки та апартаменти" },
  { key: "excursions", label: "Екскурсії" },
  { key: "transport", label: "Транспорт" },
];

const HomePage = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [city, setCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxPrice] = useState("");

  const [openDestination, setOpenDestination] = useState(false);
  const [openDates, setOpenDates] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  const [category, setCategory] = useState("all");
  const [heroNav, setHeroNav] = useState("hotels");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
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

  const handlePopularDestinationOpen = (destination: Destination) => {
    void destinationApi.registerView(destination.id);
  };

  const registerDestinationView = async (destination: Destination) => {
    try {
      await destinationApi.registerView(destination.id);
    } catch (error) {
      console.error("Failed to register destination view:", error);
    }
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

  const {
    data: allHousings,
    isLoading,
    error,
  } = useQuery<Housing[]>({
    queryKey: ["housing", city, maxPrice, guests],
    queryFn: () =>
      housingApi.getAll({
        city: city || undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minGuests: guests.adults + guests.children,
        rooms: guests.rooms,
      }),
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
    setPage(1);

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

  const resetPage = () => setPage(1);

  const handleSearch = async () => {
    const query = cityInput.trim().toLocaleLowerCase();

    const destination =
      selectedDestination ??
      [...searchedDestinations, ...popularDestinations].find((item) => {
        const backendCity = item.city.toLocaleLowerCase();
        const localizedCity = getDestinationCityName(item).toLocaleLowerCase();

        return backendCity === query || localizedCity === query;
      });

    if (destination) {
      const localizedCity = getDestinationCityName(destination);

      setCityInput(localizedCity);
      setCity(localizedCity);
      saveRecentDestination(localizedCity);

      if (!selectedDestination) {
        await registerDestinationView(destination);
      }
    } else {
      setCity(cityInput.trim());
    }

    setSelectedDestination(null);
    setOpenDestination(false);
    resetPage();
  };

  const handleCategory = (key: string) => {
    setCategory(key);
    resetPage();
  };

  const handlePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const filteredHousings = useMemo(() => {
    if (!allHousings) return [];
    if (category === "all") return allHousings;

    return allHousings.filter((housing) => housing.type === category);
  }, [allHousings, category]);

  const totalItems = filteredHousings.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const housings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredHousings.slice(start, start + pageSize);
  }, [filteredHousings, page, pageSize]);

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  }, [page, totalPages]);

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
            {HERO_NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setHeroNav(item.key)}
                className="
                  flex h-[58px] items-center justify-center
                  whitespace-nowrap bg-white px-2
                  text-center text-[20px] font-medium
                  leading-none tracking-normal
                  text-[#243C4E]
                  transition hover:bg-[#F5F7F8]
                "
              >
                {item.label}
              </button>
            ))}
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

      {/* ─────────────── CATEGORIES ─────────────── */}

      <div className="sticky top-16 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategory(cat.key)}
                className={`
                  shrink-0 border-b-2 py-4 text-sm font-medium transition
                  ${
                    category === cat.key
                      ? "border-slate-800 text-slate-800"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }
                `}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────── HOUSING LIST ─────────────── */}

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {city
              ? t("home.housing.inCity", { city })
              : t("home.housing.allAvailable")}

            {totalItems > 0 && (
              <span className="ml-2 text-base font-normal text-slate-400">
                ({totalItems})
              </span>
            )}
          </h2>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="hidden sm:block">
              {t("home.housing.showPerPage")}
            </span>

            <div className="flex gap-1">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handlePageSize(size)}
                  className={`
                    rounded-lg px-3 py-1.5 font-medium transition
                    ${
                      pageSize === size
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(pageSize)].map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            ⚠️ {t("home.housing.loadError")}
          </div>
        )}

        {!isLoading && !error && filteredHousings.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-12 text-center text-slate-500">
            <img
              src="/images/logos/Logo_WayGo.png"
              alt="WayGo"
              className="mx-auto mb-3 h-8 w-auto"
            />

            {t("home.housing.empty")}
          </div>
        )}

        {housings.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {housings.map((housing) => (
              <HousingCard
                key={housing.id}
                housing={housing}
                isFavorite={wishlist.some((item) => item.id === housing.id)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-slate-500">
              {t("home.pagination.shown", {
                from: (page - 1) * pageSize + 1,
                to: Math.min(page * pageSize, totalItems),
                total: totalItems,
              })}
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg border border-slate-200
                  text-slate-600 disabled:opacity-30
                "
              >
                ‹
              </button>

              {pageNumbers.map((pageNumber, index) =>
                pageNumber === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="
                      flex h-9 w-9 items-center
                      justify-center text-slate-400
                    "
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`
                      flex h-9 w-9 items-center justify-center
                      rounded-lg text-sm font-medium
                      ${
                        page === pageNumber
                          ? "bg-slate-800 text-white"
                          : "border border-slate-200 text-slate-600"
                      }
                    `}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page === totalPages}
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg border border-slate-200
                  text-slate-600 disabled:opacity-30
                "
              >
                ›
              </button>
            </div>
          </div>
        )}
      </section>

      <PopularDestinations onDestinationOpen={handlePopularDestinationOpen} />
      <Footer />
    </div>
  );
};

export default HomePage;