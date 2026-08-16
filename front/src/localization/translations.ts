import type { Language } from "../store/languageStore";

export const translations = {
  uk: {
    home: {
      heroTitle: "Шлях до твого відпочинку!",
      heroSubtitle: "Знайди ідеальне місце серед тисяч варіантів",

      destination: "Куди?",
      destinationPlaceholder: "Напрямок маршруту",

      checkIn: "Заїзд",
      checkOut: "Виїзд",
      guests: "Хто?",

      guest: "гостей",
      room: "номер",

      allOptions: "Всі доступні варіанти",
      housingIn: "Житло у",

      showPerPage: "Показувати по:",
      nothingFound: "За вашим запитом нічого не знайдено",
      loadingError: "Не вдалося завантажити житло.",

      shown: "Показано",
      of: "з",
    },

    categories: {
      all: "Всі варіанти",
      apartment: "Квартири",
      house: "Будинки",
      villa: "Вілли",
      studio: "Студії",
      room: "Кімнати",
    },

    destinationDropdown: {
      recent: "Ви нещодавно шукали:",
      popular: "Популярні напрямки:",
      nothingFound: "Нічого не знайдено",
    },

    housing: {
      apartment: "Квартира",
      house: "Будинок",
      room: "Кімната",
      studio: "Студія",
      villa: "Вілла",

      rooms: "кімн.",
      guestsUpTo: "до",
      guests: "гостей",
      perNight: "/ ніч",
      view: "Переглянути",
    },

    profile: {
      profile: "Профіль",
      myAccount: "Мій акаунт",
      wishlist: "Список бажань",
      trips: "Мої подорожі",
      reviews: "Відгуки",
      logout: "Вийти",
    },

    wishlist: {
      title: "Список бажань",
      subtitle: "Збережені вами оголошення",
      empty: "Список бажань порожній",
      emptyDescription:
        "Натискайте на сердечко біля оголошень, які вам сподобалися.",
    },
  },

  en: {
    home: {
      heroTitle: "Your way to the perfect getaway!",
      heroSubtitle: "Find the perfect place among thousands of options",

      destination: "Where?",
      destinationPlaceholder: "Destination",

      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Who?",

      guest: "guests",
      room: "room",

      allOptions: "All available properties",
      housingIn: "Properties in",

      showPerPage: "Show per page:",
      nothingFound: "No properties found for your search",
      loadingError: "Failed to load properties.",

      shown: "Showing",
      of: "of",
    },

    categories: {
      all: "All options",
      apartment: "Apartments",
      house: "Houses",
      villa: "Villas",
      studio: "Studios",
      room: "Rooms",
    },

    destinationDropdown: {
      recent: "You recently searched:",
      popular: "Popular destinations:",
      nothingFound: "Nothing found",
    },

    housing: {
      apartment: "Apartment",
      house: "House",
      room: "Room",
      studio: "Studio",
      villa: "Villa",

      rooms: "rooms",
      guestsUpTo: "up to",
      guests: "guests",
      perNight: "/ night",
      view: "View",
    },

    profile: {
      profile: "Profile",
      myAccount: "My account",
      wishlist: "Wishlist",
      trips: "My trips",
      reviews: "Reviews",
      logout: "Log out",
    },

    wishlist: {
      title: "Wishlist",
      subtitle: "Your saved properties",
      empty: "Your wishlist is empty",
      emptyDescription:
        "Click the heart icon on properties you like to save them here.",
    },
  },

  sv: {
    home: {
      heroTitle: "Vägen till din perfekta semester!",
      heroSubtitle: "Hitta det perfekta boendet bland tusentals alternativ",

      destination: "Vart?",
      destinationPlaceholder: "Destination",

      checkIn: "Incheckning",
      checkOut: "Utcheckning",
      guests: "Vem?",

      guest: "gäster",
      room: "rum",

      allOptions: "Alla tillgängliga boenden",
      housingIn: "Boenden i",

      showPerPage: "Visa per sida:",
      nothingFound: "Inga boenden hittades",
      loadingError: "Det gick inte att ladda boenden.",

      shown: "Visar",
      of: "av",
    },

    categories: {
      all: "Alla alternativ",
      apartment: "Lägenheter",
      house: "Hus",
      villa: "Villor",
      studio: "Studior",
      room: "Rum",
    },

    destinationDropdown: {
      recent: "Du sökte nyligen efter:",
      popular: "Populära resmål:",
      nothingFound: "Inga resultat hittades",
    },

    housing: {
      apartment: "Lägenhet",
      house: "Hus",
      room: "Rum",
      studio: "Studio",
      villa: "Villa",

      rooms: "rum",
      guestsUpTo: "upp till",
      guests: "gäster",
      perNight: "/ natt",
      view: "Visa",
    },

    profile: {
      profile: "Profil",
      myAccount: "Mitt konto",
      wishlist: "Önskelista",
      trips: "Mina resor",
      reviews: "Recensioner",
      logout: "Logga ut",
    },

    wishlist: {
      title: "Önskelista",
      subtitle: "Dina sparade boenden",
      empty: "Din önskelista är tom",
      emptyDescription:
        "Klicka på hjärtat vid ett boende för att spara det här.",
    },
  },
} as const;

export const getTranslations = (language: Language) =>
  translations[language];