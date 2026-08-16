import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { destinationApi, housingApi, wishlistApi } from "../api/api";
import { useAuthStore } from "../store/authStore";

import type { Destination } from "../types/destination";
import type { Housing } from "../types/housing";

import DestinationDropdown from "../components/Destinations/DestinationDropdown";
import PopularDestinations from "../components/Destinations/PopularDestinations";
import Footer from "../components/Footer/Footer";
import GuestsDropdown from "../components/GuestsDropdown/GuestsDropdown";
import HousingCard from "../components/HousingCard/HousingCard";


// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [8, 12, 24, 48];

const CATEGORIES = [
  { key: "all", label: "Всі варіанти" },
  { key: "Apartment", label: "Квартири" },
  { key: "House", label: "Будинки" },
  { key: "Villa", label: "Вілли" },
  { key: "Studio", label: "Студії" },
  { key: "Room", label: "Кімнати" },
];


// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

const HomePage = () => {
  // ─────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );


  // ─────────────────────────────────────────────
  // WISHLIST
  // ─────────────────────────────────────────────

  /**
   * Завантажуємо wishlist тільки для авторизованого користувача.
   *
   * Він використовується для визначення стану сердечка
   * на кожній HousingCard.
   */
  const { data: wishlist = [] } = useQuery<Housing[]>({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getAll,

    // Не робимо запит, якщо користувач не авторизований.
    enabled: isAuthenticated,

    // Не повторюємо запит автоматично при помилці.
    retry: false,

    // Не оновлюємо wishlist при кожному поверненні у вкладку.
    refetchOnWindowFocus: false,

    // Вважаємо дані актуальними протягом 5 хвилин.
    staleTime: 1000 * 60 * 5,
  });


  // ─────────────────────────────────────────────
  // SEARCH STATE
  // ─────────────────────────────────────────────

  // Місто, яке вже застосоване до пошуку.
  const [city, setCity] = useState("");

  // Значення, яке користувач зараз вводить у поле "Куди?".
  const [cityInput, setCityInput] = useState("");

  // Значення для API-пошуку напрямків після debounce.
  const [searchQuery, setSearchQuery] = useState("");

  // Дати бронювання.
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Максимальна ціна.
  // Поки setter не використовується.
  const [maxPrice] = useState("");

  // Стан dropdown гостей.
  const [openGuests, setOpenGuests] = useState(false);

  // Активна категорія житла.
  const [category, setCategory] = useState("all");

  // Поточна сторінка пагінації.
  const [page, setPage] = useState(1);

  // Кількість оголошень на сторінці.
  const [pageSize, setPageSize] = useState(12);

  // Стан dropdown напрямків.
  const [openDestination, setOpenDestination] = useState(false);


  // ─────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────

  /**
   * Refs потрібні для визначення кліку поза dropdown.
   */
  const destinationRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);


  // ─────────────────────────────────────────────
  // RECENT DESTINATIONS
  // ─────────────────────────────────────────────

  /**
   * Останні напрямки зберігаємо в localStorage,
   * щоб вони залишались після перезавантаження сторінки.
   */
  const [recentDestinations, setRecentDestinations] = useState<Destination[]>(
    () => {
      try {
        return JSON.parse(
          localStorage.getItem("recentDestinations") || "[]"
        );
      } catch {
        return [];
      }
    }
  );


  // ─────────────────────────────────────────────
  // GUESTS
  // ─────────────────────────────────────────────

  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    babies: 0,
    pets: 0,
    rooms: 0,
  });


  // ─────────────────────────────────────────────
  // DESTINATION SEARCH
  // ─────────────────────────────────────────────

  /**
   * Пошук напрямків починається тільки після того,
   * як користувач ввів мінімум 2 символи.
   */
  const { data: searchedDestinations = [] } = useQuery<Destination[]>({
    queryKey: ["destination-search", searchQuery],

    queryFn: () => destinationApi.search(searchQuery),

    enabled: searchQuery.length > 1,

    retry: false,
  });


  // ─────────────────────────────────────────────
  // POPULAR DESTINATIONS
  // ─────────────────────────────────────────────

  /**
   * Популярні напрямки показуються:
   * - у dropdown до введення пошуку;
   * - нижче на головній сторінці.
   */
  const { data: popularDestinations = [] } = useQuery<Destination[]>({
    queryKey: ["popular-destinations"],
    queryFn: destinationApi.getPopular,
  });


  // ─────────────────────────────────────────────
  // HOUSINGS
  // ─────────────────────────────────────────────

  /**
   * Основний запит оголошень.
   *
   * При зміні міста, ціни або гостей React Query
   * автоматично виконає новий запит.
   */
  const {
    data: allHousings,
    isLoading,
    error,
  } = useQuery<Housing[]>({
    queryKey: ["housing", city, maxPrice, guests],

    queryFn: () =>
      housingApi.getAll({
        city: city || undefined,

        maxPrice: maxPrice
          ? Number(maxPrice)
          : undefined,

        minGuests: guests.adults + guests.children,

        rooms: guests.rooms,
      }),
  });


  // ─────────────────────────────────────────────
  // DESTINATION SELECT
  // ─────────────────────────────────────────────

  /**
   * Викликається при виборі напрямку із dropdown.
   */
  const handleDestinationSelect = (destination: Destination) => {
  // Вставляємо вибране місто у поле пошуку.
  setCityInput(destination.city);

  // Одразу застосовуємо місто до пошуку житла.
  // Через зміну city React Query автоматично виконає новий housingApi.getAll().
  setCity(destination.city);

  // Закриваємо dropdown.
  setOpenDestination(false);

  // Після нового пошуку повертаємось на першу сторінку пагінації.
  setPage(1);

  // Отримуємо попередню історію пошуку.
  let recent: Destination[] = [];

  try {
    recent = JSON.parse(
      localStorage.getItem("recentDestinations") || "[]"
    );
  } catch {
    recent = [];
  }

  // Додаємо вибране місто на початок,
  // прибираємо дубль і залишаємо максимум 3.
  const updated = [
    destination,
    ...recent.filter(
      (item) =>
        item.city.toLowerCase() !==
        destination.city.toLowerCase()
    ),
  ].slice(0, 3);

  // Зберігаємо історію між перезавантаженнями.
  localStorage.setItem(
    "recentDestinations",
    JSON.stringify(updated)
  );

  setRecentDestinations(updated);
};


  // ─────────────────────────────────────────────
  // SAVE RECENT DESTINATION
  // ─────────────────────────────────────────────

  /**
   * Якщо користувач ввів місто вручну і воно є
   * серед popularDestinations — додаємо його
   * до останніх напрямків.
   */
  const saveRecentDestination = (cityName: string) => {
    const destination = popularDestinations.find(
      (item) =>
        item.city.toLowerCase() === cityName.toLowerCase()
    );

    if (!destination) {
      return;
    }

    const updated = [
      destination,
      ...recentDestinations.filter(
        (item) => item.id !== destination.id
      ),
    ].slice(0, 3);

    localStorage.setItem(
      "recentDestinations",
      JSON.stringify(updated)
    );

    setRecentDestinations(updated);
  };


  // ─────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────

  /**
   * При зміні фільтрів повертаємось
   * на першу сторінку.
   */
  const resetPage = () => {
    setPage(1);
  };

  const handleSearch = () => {
    saveRecentDestination(cityInput);

    setCity(cityInput);
    setOpenDestination(false);

    resetPage();
  };


  // ─────────────────────────────────────────────
  // CATEGORY
  // ─────────────────────────────────────────────

  const handleCategory = (key: string) => {
    setCategory(key);
    resetPage();
  };


  // ─────────────────────────────────────────────
  // PAGE SIZE
  // ─────────────────────────────────────────────

  const handlePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };


  // ─────────────────────────────────────────────
  // FILTER HOUSINGS
  // ─────────────────────────────────────────────

  /**
   * Фільтруємо отримані оголошення за категорією.
   *
   * useMemo не дозволяє виконувати фільтрацію
   * повторно без зміни allHousings або category.
   */
  const filteredHousings = useMemo(() => {
    if (!allHousings) {
      return [];
    }

    if (category === "all") {
      return allHousings;
    }

    return allHousings.filter(
      (housing) => housing.type === category
    );
  }, [allHousings, category]);

  const totalItems = filteredHousings.length;

  const totalPages = Math.ceil(
    totalItems / pageSize
  );


  // ─────────────────────────────────────────────
  // PAGINATION
  // ─────────────────────────────────────────────

  /**
   * Беремо тільки ті оголошення,
   * які належать до поточної сторінки.
   */
  const housings = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredHousings.slice(
      start,
      start + pageSize
    );
  }, [filteredHousings, page, pageSize]);


  /**
   * Формуємо кнопки пагінації.
   *
   * Наприклад:
   * 1 2 3 ... 10
   */
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }, [page, totalPages]);


  // ─────────────────────────────────────────────
  // DESTINATION DEBOUNCE
  // ─────────────────────────────────────────────

  /**
   * Не відправляємо API-запит після кожної введеної
   * літери. Чекаємо 400 мс після завершення вводу.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(cityInput.trim());
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [cityInput]);


  // ─────────────────────────────────────────────
  // CLICK OUTSIDE DROPDOWNS
  // ─────────────────────────────────────────────

  /**
   * Закриваємо dropdown напрямків або гостей,
   * якщо користувач натиснув поза ним.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        destinationRef.current &&
        !destinationRef.current.contains(target)
      ) {
        setOpenDestination(false);
      }

      if (
        guestsRef.current &&
        !guestsRef.current.contains(target)
      ) {
        setOpenGuests(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div>
      {/* ──────────────────────────────────────── */}
      {/* HERO */}
      {/* ──────────────────────────────────────── */}

      <section
        className="
          relative
          flex
          h-[600px]
          w-full
          flex-col
          items-center
          justify-center
          overflow-visible
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: "url('/images/background.jpg')",
        }}
      >
        {/* Затемнення фонового зображення */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Основний контент hero */}
        <div
          className="
            relative
            z-100
            flex
            w-full
            max-w-4xl
            flex-col
            items-center
            gap-6
            px-4
          "
        >
          <h1
            className="
              text-center
              text-4xl
              font-bold
              text-white
              drop-shadow-lg
              md:text-5xl
            "
          >
            Шлях до твого відпочинку!
          </h1>

          <p className="text-center text-lg text-white/80">
            Знайди ідеальне місце серед тисяч варіантів
          </p>


          {/* ──────────────────────────────────── */}
          {/* SEARCH BOX */}
          {/* ──────────────────────────────────── */}

          {/*
            Search box має z-index 100.

            Це важливо, щоб dropdown напрямків та гостей
            знаходився вище sticky categories і HousingCard.
          */}
          <div
            className="
              relative
              z-[100]
              flex
              w-full
              flex-col
              items-stretch
              gap-0
              rounded-2xl
              bg-white
              p-2
              shadow-2xl
              sm:flex-row
            "
          >
            {/* DESTINATION */}

            {/*
              Цей контейнер є position: relative,
              тому DestinationDropdown може використовувати
              position: absolute відносно нього.
            */}
            <div
              ref={destinationRef}
              className="
                relative
                z-[110]
                flex
                flex-1
                flex-col
                border-b
                border-slate-200
                px-4
                py-3
                sm:border-b-0
                sm:border-r
              "
            >
              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-800
                "
              >
                Куди?
              </span>

              <input
                type="text"
                placeholder="Напрямок маршруту"
                value={cityInput}
                onFocus={() => {
                  setOpenDestination(true);
                }}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setOpenDestination(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="
                  mt-0.5
                  bg-transparent
                  text-sm
                  text-slate-600
                  outline-none
                  placeholder:text-slate-400
                "
              />

              {openDestination && (
                <DestinationDropdown
                  destinations={
                    cityInput.length > 1
                      ? searchedDestinations
                      : popularDestinations.slice(0, 5)
                  }
                  recent={recentDestinations}
                  onSelect={handleDestinationSelect}
                />
              )}
            </div>


            {/* CHECK IN */}

            <div
              className="
                flex
                flex-col
                border-b
                border-slate-200
                px-4
                py-3
                sm:border-b-0
                sm:border-r
              "
            >
              <span className="text-xs font-bold uppercase tracking-wide text-slate-800">
                Заїзд
              </span>

              <input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                }}
                className="
                  mt-0.5
                  bg-transparent
                  text-sm
                  text-slate-600
                  outline-none
                "
              />
            </div>


            {/* CHECK OUT */}

            <div
              className="
                flex
                flex-col
                border-b
                border-slate-200
                px-4
                py-3
                sm:border-b-0
                sm:border-r
              "
            >
              <span className="text-xs font-bold uppercase tracking-wide text-slate-800">
                Виїзд
              </span>

              <input
                type="date"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                }}
                className="
                  mt-0.5
                  bg-transparent
                  text-sm
                  text-slate-600
                  outline-none
                "
              />
            </div>


            {/* GUESTS */}

            <div
              ref={guestsRef}
              className="relative z-[110]"
            >
              <div
                onClick={() => {
                  setOpenGuests((prev) => !prev);
                }}
                className="
                  flex
                  cursor-pointer
                  flex-col
                  px-4
                  py-3
                "
              >
                <span className="text-xs font-bold text-slate-800">
                  ХТО?
                </span>

                <span className="whitespace-nowrap text-sm text-slate-500">
                  {guests.adults +
                    guests.children +
                    guests.babies}{" "}
                  гостей · {guests.rooms} номер
                </span>
              </div>

              {openGuests && (
                <GuestsDropdown
                  guests={guests}
                  setGuests={setGuests}
                />
              )}
            </div>


            {/* SEARCH BUTTON */}

            <button
              type="button"
              onClick={handleSearch}
              className="
                m-1
                flex
                items-center
                justify-center
                rounded-xl
                bg-slate-800
                px-6
                py-3
                text-white
                transition
                hover:bg-slate-700
              "
              aria-label="Пошук житла"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────── */}
      {/* CATEGORIES */}
      {/* ──────────────────────────────────────── */}

      {/*
        z-20 навмисно нижчий за search box (z-100).
        Тому dropdown буде відкриватись поверх цього меню.
      */}
      <div
        className="
          sticky
          top-16
          z-20
          border-b
          border-slate-200
          bg-white
        "
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  handleCategory(cat.key);
                }}
                className={`
                  shrink-0
                  border-b-2
                  py-4
                  text-sm
                  font-medium
                  transition
                  ${
                    category === cat.key
                      ? "border-slate-800 text-slate-800"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* ──────────────────────────────────────── */}
      {/* HOUSING LIST */}
      {/* ──────────────────────────────────────── */}

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Заголовок + кількість елементів */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <h2 className="text-xl font-bold text-slate-800">
            {city
              ? `Житло у ${city}`
              : "Всі доступні варіанти"}

            {totalItems > 0 && (
              <span className="ml-2 text-base font-normal text-slate-400">
                ({totalItems})
              </span>
            )}
          </h2>


          {/* Кількість карток на сторінці */}

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="hidden sm:block">
              Показувати по:
            </span>

            <div className="flex gap-1">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    handlePageSize(size);
                  }}
                  className={`
                    rounded-lg
                    px-3
                    py-1.5
                    font-medium
                    transition
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


        {/* ────────────────────────────────────── */}
        {/* LOADING */}
        {/* ────────────────────────────────────── */}

        {isLoading && (
          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {[...Array(pageSize)].map((_, index) => (
              <div
                key={index}
                className="
                  h-72
                  animate-pulse
                  rounded-2xl
                  bg-slate-200
                "
              />
            ))}
          </div>
        )}


        {/* ────────────────────────────────────── */}
        {/* ERROR */}
        {/* ────────────────────────────────────── */}

        {error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            ⚠️ Не вдалося завантажити житло.
          </div>
        )}


        {/* ────────────────────────────────────── */}
        {/* EMPTY */}
        {/* ────────────────────────────────────── */}

        {!isLoading &&
          !error &&
          filteredHousings.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-12 text-center text-slate-500">
              <img
                src="/images/logos/Logo_WayGo.png"
                alt="WayGo"
                className="mx-auto mb-3 h-8 w-auto"
              />

              За вашим запитом нічого не знайдено
            </div>
          )}


        {/* ────────────────────────────────────── */}
        {/* HOUSING CARDS */}
        {/* ────────────────────────────────────── */}

        {housings.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {housings.map((housing) => (
              <HousingCard
                key={housing.id}
                housing={housing}

                // Перевіряємо, чи знаходиться житло у wishlist.
                isFavorite={wishlist.some(
                  (item) => item.id === housing.id
                )}
              />
            ))}
          </div>
        )}


        {/* ────────────────────────────────────── */}
        {/* PAGINATION */}
        {/* ────────────────────────────────────── */}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-slate-500">
              Показано{" "}
              {(page - 1) * pageSize + 1}
              –
              {Math.min(page * pageSize, totalItems)}
              {" "}з{" "}
              {totalItems}
            </p>

            <div className="flex items-center gap-1">
              {/* Previous page */}

              <button
                type="button"
                onClick={() => {
                  setPage((currentPage) =>
                    Math.max(1, currentPage - 1)
                  );
                }}
                disabled={page === 1}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  text-slate-600
                  disabled:opacity-30
                "
              >
                ‹
              </button>


              {/* Page numbers */}

              {pageNumbers.map((pageNumber, index) =>
                pageNumber === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      text-slate-400
                    "
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => {
                      setPage(pageNumber);
                    }}
                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      text-sm
                      font-medium
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


              {/* Next page */}
              <button
                type="button"
                onClick={() => {
                  setPage((currentPage) =>
                    Math.min(
                      totalPages,
                      currentPage + 1
                    )
                  );
                }}
                disabled={page === totalPages}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  text-slate-600
                  disabled:opacity-30
                "
              >
                ›
              </button>
            </div>
          </div>
        )}
      </section>
      {/* ─────────────────── POPULAR DESTINATIONS ───────────────────*/}
      <PopularDestinations />
      {/*─────────────────── FOOTER ───────────────────*/}
      <Footer />
    </div>
  );
};

export default HomePage;