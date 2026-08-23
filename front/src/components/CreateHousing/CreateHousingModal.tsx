import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";

import {
  addressApi,
  type AddressSuggestion,
} from "../../api/addressApi";

// ─────────────────────────────────────────────
// MAP MARKER
// ─────────────────────────────────────────────

const markerIcon = L.icon({
  iconUrl: "/images/icons/pin.png",
  iconSize: [52, 64],
  iconAnchor: [26, 64],
});

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface MapClickHandlerProps {
  onPositionChange: (latitude: number, longitude: number) => void;
}

export interface HousingAddress {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  postalCode: string;
  street: string;
  apartment: string;
  latitude?: number;
  longitude?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: HousingAddress) => void;
}

interface Country {
  name: string;
  code: string;
}

// ─────────────────────────────────────────────
// MAP CLICK HANDLER
// Клік по карті переносить маркер
// ─────────────────────────────────────────────

const MapClickHandler = ({
  onPositionChange,
}: MapClickHandlerProps) => {
  useMapEvents({
    click(event) {
      onPositionChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

interface MapRecenterProps {
  latitude?: number;
  longitude?: number;
  zoom: number;
}

const MapRecenter = ({
  latitude,
  longitude,
  zoom,
}: MapRecenterProps) => {
  const map = useMap();

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return;

    map.setView([latitude, longitude], zoom, {
      animate: true,
    });
  }, [latitude, longitude, zoom, map]);

  return null;
};

// ─────────────────────────────────────────────
// ISO 3166-1 ALPHA-2 COUNTRY CODES
// ─────────────────────────────────────────────

const countryCodes = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR",
  "AS", "AT", "AU", "AW", "AX", "AZ",
  "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL",
  "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY",
  "BZ",
  "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM",
  "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ",
  "DE", "DJ", "DK", "DM", "DO", "DZ",
  "EC", "EE", "EG", "EH", "ER", "ES", "ET",
  "FI", "FJ", "FK", "FM", "FO", "FR",
  "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM",
  "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY",
  "HK", "HM", "HN", "HR", "HT", "HU",
  "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT",
  "JE", "JM", "JO", "JP",
  "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY",
  "KZ",
  "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV",
  "LY",
  "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM",
  "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW",
  "MX", "MY", "MZ",
  "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR",
  "NU", "NZ",
  "OM",
  "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR",
  "PS", "PT", "PW", "PY",
  "QA",
  "RE", "RO", "RS", "RU", "RW",
  "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK",
  "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY",
  "SZ",
  "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN",
  "TO", "TR", "TT", "TV", "TW", "TZ",
  "UA", "UG", "UM", "US", "UY", "UZ",
  "VA", "VC", "VE", "VG", "VI", "VN", "VU",
  "WF", "WS",
  "YE", "YT",
  "ZA", "ZM", "ZW",
];

const countries: Country[] = countryCodes.map((code) => ({
  code: code.toLowerCase(),
  name: code,
}));

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

const CreateHousingModal = ({
  isOpen,
  onClose,
  onSubmit,
}: Props) => {
  const { t, i18n } = useTranslation();

  // Geoapify підтримує мовний код інтерфейсу.
  const currentLanguage = i18n.resolvedLanguage?.split("-")[0] ?? "uk";

  // ─────────────────────────────────────────────
  // COUNTRY LOCALIZATION
  // ─────────────────────────────────────────────

  const countryNames = useMemo(
    () =>
      new Intl.DisplayNames([currentLanguage], {
        type: "region",
      }),
    [currentLanguage]
  );

  const getCountryName = (countryCode: string) =>
    countryNames.of(countryCode.toUpperCase()) ?? countryCode.toUpperCase();

  const DEFAULT_MAP_CENTER: [number, number] = [50.5, 10.5];
  const DEFAULT_MAP_ZOOM = 4;

  // ─────────────────────────────────────────────
  // STATE
  // 1 — країна
  // 2 — адреса
  // 3 — карта
  // ─────────────────────────────────────────────

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<Country | null>(null);

  const [addressSearch, setAddressSearch] = useState("");
  const [debouncedAddress, setDebouncedAddress] = useState("");
  const [showAddressSuggestions, setShowAddressSuggestions] =
    useState(false);

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");

  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isMapLocating, setIsMapLocating] = useState(false);

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ─────────────────────────────────────────────
  // COUNTRY FILTER
  // Пошук і сортування поточною мовою
  // ─────────────────────────────────────────────

  const filteredCountries = useMemo(() => {
    const query = countrySearch
      .trim()
      .toLocaleLowerCase(currentLanguage);

    const filtered = !query
      ? [...countries]
      : countries.filter((country) =>
          getCountryName(country.code)
            .toLocaleLowerCase(currentLanguage)
            .includes(query)
        );

    return filtered.sort((a, b) =>
      getCountryName(a.code).localeCompare(
        getCountryName(b.code),
        currentLanguage
      )
    );
  }, [countrySearch, currentLanguage, countryNames]);

  // ─────────────────────────────────────────────
  // ADDRESS DEBOUNCE
  // ─────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAddress(addressSearch.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [addressSearch]);

  // ─────────────────────────────────────────────
  // ADDRESS AUTOCOMPLETE
  // ─────────────────────────────────────────────

  const {
    data: addressSuggestions = [],
    isFetching: addressLoading,
  } = useQuery<AddressSuggestion[]>({
    queryKey: [
      "address-autocomplete",
      debouncedAddress,
      selectedCountry?.code,
      currentLanguage,
    ],

    queryFn: () =>
      addressApi.autocomplete(
        debouncedAddress,
        selectedCountry?.code,
        currentLanguage
      ),

    enabled:
      step === 2 &&
      !!selectedCountry &&
      debouncedAddress.length >= 3,

    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // ─────────────────────────────────────────────
  // COUNTRY SELECT
  // ─────────────────────────────────────────────

  const handleCountrySelect = (country: Country) => {
    const localizedCountry: Country = {
      ...country,
      name: getCountryName(country.code),
    };

    setSelectedCountry(localizedCountry);
    setCountrySearch(localizedCountry.name);
    setLocationError("");
    setStep(2);
  };

  // ─────────────────────────────────────────────
  // ADDRESS SELECT
  // Заповнюємо поля результатом Geoapify
  // ─────────────────────────────────────────────

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setAddressSearch(suggestion.formatted);
    setRegion(suggestion.state ?? suggestion.county ?? "");
    setCity(suggestion.city ?? "");
    setPostalCode(suggestion.postcode ?? "");

    setStreet(
      [suggestion.street, suggestion.housenumber]
        .filter(Boolean)
        .join(" ")
    );

    setLatitude(suggestion.lat);
    setLongitude(suggestion.lon);
    setShowAddressSuggestions(false);
  };

  // ─────────────────────────────────────────────
  // CURRENT LOCATION
  // GPS → reverse geocoding → адреса
  // ─────────────────────────────────────────────

  const handleCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        t("createHousing.address.locationErrors.notSupported")
      );
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const detectedLatitude = position.coords.latitude;
          const detectedLongitude = position.coords.longitude;

          const result = await addressApi.reverse(
            detectedLatitude,
            detectedLongitude,
            currentLanguage
          );

          if (!result) {
            setLocationError(
              t("createHousing.address.locationErrors.addressNotFound")
            );
            return;
          }

          const detectedCountry: Country = {
            name: result.countryCode
              ? getCountryName(result.countryCode)
              : result.country,
            code: result.countryCode.toLowerCase(),
          };

          setSelectedCountry(detectedCountry);
          setCountrySearch(detectedCountry.name);
          setAddressSearch(result.formatted);

          setRegion(result.state ?? result.county ?? "");
          setCity(result.city ?? "");
          setPostalCode(result.postcode ?? "");

          setStreet(
            [result.street, result.housenumber]
              .filter(Boolean)
              .join(" ")
          );

          setLatitude(result.lat ?? detectedLatitude);
          setLongitude(result.lon ?? detectedLongitude);

          setStep(2);
        } catch (error) {
          console.error("Current location error:", error);

          setLocationError(
            t("createHousing.address.locationErrors.reverseFailed")
          );
        } finally {
          setIsLocating(false);
        }
      },

      (error) => {
        setIsLocating(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              t("createHousing.address.locationErrors.permissionDenied")
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationError(
              t("createHousing.address.locationErrors.unavailable")
            );
            break;

          case error.TIMEOUT:
            setLocationError(
              t("createHousing.address.locationErrors.timeout")
            );
            break;

          default:
            setLocationError(
              t("createHousing.address.locationErrors.unknown")
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000 * 60 * 5,
      }
    );
  };

  // ─────────────────────────────────────────────
  // OPEN MAP BY IP COUNTRY
  // Backend визначає країну за IP, Geoapify дає центр країни
  // ─────────────────────────────────────────────

  const handleOpenMap = async () => {
    setLocationError("");
    setIsMapLocating(true);

    // Спочатку показуємо Європу.
    // Якщо backend визначить країну — карта переміститься на неї.
    setLatitude(undefined);
    setLongitude(undefined);
    setMapZoom(DEFAULT_MAP_ZOOM);
    setStep(3);

    try {
      const { countryCode } = await addressApi.getUserCountry();

      if (!countryCode) {
        setLatitude(undefined);
        setLongitude(undefined);
        return;
      }

      const code = countryCode.toLowerCase();
      const detectedCountry: Country = {
        code,
        name: getCountryName(code),
      };

      setSelectedCountry(detectedCountry);
      setCountrySearch(detectedCountry.name);

      const suggestions = await addressApi.autocomplete(
        detectedCountry.name,
        code,
        currentLanguage
      );

      const countryLocation =
        suggestions.find(
          (item) => item.countryCode?.toLowerCase() === code
        ) ?? suggestions[0];

      if (!countryLocation) {
        setLatitude(undefined);
        setLongitude(undefined);
        return;
      }

      if (
        countryLocation.lat === undefined ||
        countryLocation.lon === undefined
      ) {
        return;
      }

      setMapZoom(5);
      setLatitude(countryLocation.lat);
      setLongitude(countryLocation.lon);
    } catch (error) {
      console.error("IP country detection error:", error);
      setLatitude(undefined);
      setLongitude(undefined);
    } finally {
      setIsMapLocating(false);
    }
  };

  // ─────────────────────────────────────────────
  // MAP CONTINUE
  // reverse geocoding → address → parent confirm modal
  // ─────────────────────────────────────────────

  const handleMapContinue = async () => {
    if (latitude === undefined || longitude === undefined) return;

    try {
      const result = await addressApi.reverse(
        latitude,
        longitude,
        currentLanguage
      );

      if (!result) {
        setLocationError(
          t("createHousing.address.locationErrors.addressNotFound")
        );
        return;
      }

      const detectedCountry: Country = {
        name: result.countryCode
          ? getCountryName(result.countryCode)
          : result.country,
        code: result.countryCode.toLowerCase(),
      };

      const nextRegion = result.state ?? result.county ?? "";
      const nextCity = result.city ?? "";
      const nextPostalCode = result.postcode ?? "";
      const nextStreet = [result.street, result.housenumber]
        .filter(Boolean)
        .join(" ");

      setSelectedCountry(detectedCountry);
      setCountrySearch(detectedCountry.name);
      setAddressSearch(result.formatted);
      setRegion(nextRegion);
      setCity(nextCity);
      setPostalCode(nextPostalCode);
      setStreet(nextStreet);
      setIsMapFullscreen(false);

      onSubmit({
        country: getCountryName(detectedCountry.code),
        countryCode: detectedCountry.code,
        region: nextRegion.trim(),
        city: nextCity.trim(),
        postalCode: nextPostalCode.trim(),
        street: nextStreet.trim(),
        apartment: apartment.trim(),
        latitude,
        longitude,
      });

      onClose();
    } catch (error) {
      console.error("Map reverse geocoding error:", error);
      setLocationError(
        t("createHousing.address.locationErrors.reverseFailed")
      );
    }
  };

  // ─────────────────────────────────────────────
  // BACK
  // ─────────────────────────────────────────────

  const handleBack = () => {
    if (step === 3) {
      setIsMapFullscreen(false);
      setStep(selectedCountry ? 2 : 1);
      return;
    }

    if (step === 2) {
      setStep(1);
      setShowAddressSuggestions(false);
    }
  };

  // ─────────────────────────────────────────────
  // CONTINUE TO MAP
  // ─────────────────────────────────────────────

  const handleAddressContinue = () => {
    if (!selectedCountry || !city.trim() || !street.trim()) return;
    if (latitude === undefined || longitude === undefined) return;

    setMapZoom(16);
    setStep(3);
  };


  useEffect(() => {
    if (!isOpen) setIsMapFullscreen(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/50 pt-[60px] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[calc(100vh-120px)] w-[549px] overflow-y-auto rounded-[20px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute right-5 top-4 z-20 text-xl text-slate-400 transition hover:text-slate-700"
        >
          ×
        </button>

        {/* ─────────────────────────────────── */}
        {/* STEP 1 — COUNTRY */}
        {/* ─────────────────────────────────── */}

        {step === 1 && (
          <>
            <h2 className="mb-4 text-center text-xl font-bold text-slate-900">
              {t("createHousing.address.enterAddress")}
            </h2>

            {/* Country search */}
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder={t("createHousing.address.country")}
                autoFocus
                autoComplete="off"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            {/* Current location */}
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isLocating}
              className="mt-3 flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-wait disabled:opacity-60"
            >
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z"
                />
                <circle cx="12" cy="9" r="2.5" />
              </svg>

              <span>
                {isLocating
                  ? t("createHousing.address.detectingLocation")
                  : t("createHousing.address.useCurrentLocation")}
              </span>
            </button>

            <button
              type="button"
              onClick={handleOpenMap}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span>{t("createHousing.address.chooseOnMap", "Обрати на карті")}</span>
            </button>

            {/* Geolocation error */}
            {locationError && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {locationError}
              </p>
            )}

            {/* Country list */}
            <div className="mt-3 max-h-[320px] overflow-y-auto pr-1">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 text-slate-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z"
                      />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>

                    {getCountryName(country.code)}
                  </button>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-slate-400">
                  {t("createHousing.address.countryNotFound")}
                </p>
              )}
            </div>
          </>
        )}

        {/* ─────────────────────────────────── */}
        {/* STEP 2 — ADDRESS */}
        {/* ─────────────────────────────────── */}

        {step === 2 && selectedCountry && (
          <>
            <div className="mb-5 flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                aria-label={t("common.back")}
                className="text-2xl text-slate-400 transition hover:text-slate-700"
              >
                ‹
              </button>

              <h2 className="text-xl font-bold text-slate-900">
                {t("createHousing.address.confirmTitle")}
              </h2>
            </div>

            <div className="space-y-3">
              {/* Selected country */}
              <input
                type="text"
                value={getCountryName(selectedCountry.code)}
                readOnly
                className="w-full cursor-default rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
              />

              {/* Address autocomplete */}
              <div className="relative">
                <input
                  type="text"
                  value={addressSearch}
                  onFocus={() => setShowAddressSuggestions(true)}
                  onChange={(e) => {
                    setAddressSearch(e.target.value);
                    setShowAddressSuggestions(true);
                  }}
                  placeholder={t("createHousing.address.searchAddress")}
                  autoComplete="off"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-slate-500"
                />

                {addressLoading && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    {t("common.searching")}
                  </span>
                )}

                {showAddressSuggestions &&
                  addressSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[240px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                      {addressSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.placeId}
                          type="button"
                          onClick={() => handleAddressSelect(suggestion)}
                          className="flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                        >
                          <span className="mt-0.5 text-slate-400">⌖</span>
                          <span>{suggestion.formatted}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder={t("createHousing.address.region")}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              />

              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("createHousing.address.city")}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              />

              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder={t("createHousing.address.postalCode")}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              />

              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder={t("createHousing.address.street")}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              />

              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder={t("createHousing.address.apartment")}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <button
              type="button"
              onClick={handleAddressContinue}
              disabled={
                !city.trim() ||
                !street.trim() ||
                latitude === undefined ||
                longitude === undefined
              }
              className="mt-4 w-full rounded-lg bg-[#29465B] py-3 text-sm font-medium text-white transition hover:bg-[#223B4D] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("common.next")}
            </button>
          </>
        )}

        {/* ─────────────────────────────────── */}
        {/* STEP 3 — MAP */}
        {/* ─────────────────────────────────── */}

        {step === 3 && (
          <>
              <div className="mb-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  aria-label={t("common.back")}
                  className="text-2xl text-slate-400 transition hover:text-slate-700"
                >
                  ‹
                </button>

                <h2 className="text-xl font-bold text-slate-900">
                  {t("createHousing.map.title")}
                </h2>
              </div>

              <p className="mb-4 text-sm text-slate-500">
                {t("createHousing.map.description")}
              </p>

              {/* Map */}
              <div
                className={
                  isMapFullscreen
                    ? "fixed inset-0 z-[3000] bg-white"
                    : "relative h-[360px] w-full overflow-hidden rounded-xl border border-slate-200"
                }
              >
                <MapContainer
                  key={isMapFullscreen ? "map-fullscreen" : "map-inline"}
                  center={DEFAULT_MAP_CENTER}
                  zoom={DEFAULT_MAP_ZOOM}
                  scrollWheelZoom
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapRecenter
                    latitude={latitude}
                    longitude={longitude}
                    zoom={mapZoom}
                  />

                  <MapClickHandler
                    onPositionChange={(newLatitude, newLongitude) => {
                      setLatitude(newLatitude);
                      setLongitude(newLongitude);
                      setMapZoom(16);
                    }}
                  />

                  {latitude !== undefined && longitude !== undefined && (
                    <Marker
                      position={[latitude, longitude] as LatLngExpression}
                      icon={markerIcon}
                      draggable
                      eventHandlers={{
                        dragend(event) {
                          const position = event.target.getLatLng();
                          setLatitude(position.lat);
                          setLongitude(position.lng);
                          setMapZoom(16);
                        },
                      }}
                    />
                  )}
                </MapContainer>

                <button
                  type="button"
                  onClick={() => setIsMapFullscreen((current) => !current)}
                  aria-label={isMapFullscreen ? "Згорнути карту" : "Розгорнути карту"}
                  className="absolute right-3 top-3 z-[1000] flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-700 shadow-md transition hover:bg-slate-50"
                >
                  {isMapFullscreen ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 9H4V4" />
                      <path d="M15 9h5V4" />
                      <path d="M9 15H4v5" />
                      <path d="M15 15h5v5" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 4H4v5" />
                      <path d="M15 4h5v5" />
                      <path d="M9 20H4v-5" />
                      <path d="M15 20h5v-5" />
                    </svg>
                  )}
                </button>

                {isMapLocating && (
                  <div className="pointer-events-none absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-lg bg-white px-4 py-2 text-sm text-slate-600 shadow-md">
                    Визначаємо країну...
                  </div>
                )}

                {!isMapLocating &&
                  latitude === undefined &&
                  longitude === undefined && (
                    <div className="pointer-events-none absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-lg bg-white px-4 py-2 text-sm text-slate-600 shadow-md">
                      Оберіть місце на карті
                    </div>
                  )}

                {isMapFullscreen && (
                  <button
                    type="button"
                    onClick={handleMapContinue}
                    disabled={latitude === undefined || longitude === undefined}
                    className="absolute bottom-8 right-8 z-[1000] min-w-[140px] rounded-lg bg-[#243C4E] px-8 py-3.5 text-[16px] font-semibold text-white shadow-lg transition hover:bg-[#1D3342] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("common.next")}
                  </button>
                )}
              </div>

              {/* Address preview */}
              {(street || city || selectedCountry) && (
                <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {street && (
                    <p className="font-medium text-slate-800">
                      {street}
                      {apartment &&
                        `, ${t("createHousing.address.apartmentShort")} ${apartment}`}
                    </p>
                  )}

                  {city && (
                    <p>
                      {city}
                      {region && `, ${region}`}
                      {postalCode && `, ${postalCode}`}
                    </p>
                  )}

                  {selectedCountry && (
                    <p>{getCountryName(selectedCountry.code)}</p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleMapContinue}
                disabled={latitude === undefined || longitude === undefined}
                className="mt-4 w-full rounded-lg bg-[#29465B] py-3 text-sm font-medium text-white transition hover:bg-[#223B4D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("common.next")}
              </button>
            </>
          )}
      </div>
    </div>
  );
};

export default CreateHousingModal;