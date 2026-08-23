export interface AddressSuggestion {
  placeId: string;
  formatted: string;

  country: string;
  countryCode: string;

  state?: string;
  county?: string;
  city?: string;
  postcode?: string;
  street?: string;
  housenumber?: string;

  lat?: number;
  lon?: number;
}

interface GeoapifyFeature {
  properties: {
    place_id?: string;
    formatted?: string;

    country?: string;
    country_code?: string;

    state?: string;
    county?: string;

    city?: string;
    town?: string;
    village?: string;

    postcode?: string;
    street?: string;
    housenumber?: string;

    lat?: number;
    lon?: number;
  };
}

interface GeoapifyResponse {
  features: GeoapifyFeature[];
}

export interface UserCountry {
  countryCode: string | null;
}

// ─────────────────────────────────────────────
// API KEY
// ─────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const ensureApiKey = () => {
  if (!API_KEY) {
    throw new Error(
      "VITE_GEOAPIFY_API_KEY не знайдено. Перевір frontend/.env"
    );
  }
};

// ─────────────────────────────────────────────
// MAPPER
// Geoapify feature → AddressSuggestion
// ─────────────────────────────────────────────

const mapFeature = (
  feature: GeoapifyFeature,
  fallbackLat?: number,
  fallbackLon?: number
): AddressSuggestion => {
  const p = feature.properties;

  return {
    placeId: p.place_id ?? crypto.randomUUID(),
    formatted: p.formatted ?? "",

    country: p.country ?? "",
    countryCode: p.country_code ?? "",

    state: p.state,
    county: p.county,

    city: p.city ?? p.town ?? p.village,

    postcode: p.postcode,
    street: p.street,
    housenumber: p.housenumber,

    lat: p.lat ?? fallbackLat,
    lon: p.lon ?? fallbackLon,
  };
};

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

export const addressApi = {
  // ─────────────────────────────────────────────
  // ADDRESS AUTOCOMPLETE
  // ─────────────────────────────────────────────

  autocomplete: async (
    text: string,
    countryCode?: string,
    language = "uk"
  ): Promise<AddressSuggestion[]> => {
    ensureApiKey();

    const query = text.trim();

    if (!query) return [];

    const params = new URLSearchParams({
      text: query,
      apiKey: API_KEY,
      limit: "8",
      format: "geojson",
      lang: language,
    });

    if (countryCode) {
      params.set(
        "filter",
        `countrycode:${countryCode.toLowerCase()}`
      );
    }

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Geoapify autocomplete error: ${response.status}`
      );
    }

    const data: GeoapifyResponse = await response.json();

    return data.features.map((feature) =>
      mapFeature(feature)
    );
  },

  // ─────────────────────────────────────────────
  // REVERSE GEOCODING
  // ─────────────────────────────────────────────

  reverse: async (
    latitude: number,
    longitude: number,
    language = "uk"
  ): Promise<AddressSuggestion | null> => {
    ensureApiKey();

    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      apiKey: API_KEY,
      format: "geojson",
      lang: language,
    });

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Geoapify reverse error: ${response.status}`
      );
    }

    const data: GeoapifyResponse = await response.json();
    const feature = data.features[0];

    if (!feature) return null;

    return mapFeature(
      feature,
      latitude,
      longitude
    );
  },

  // ─────────────────────────────────────────────
  // USER COUNTRY BY IP
  // Backend → GeoLite2 Country
  // ─────────────────────────────────────────────

  getUserCountry: async (): Promise<UserCountry> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/location/country`
    );

    if (!response.ok) {
      throw new Error(
        `User country detection error: ${response.status}`
      );
    }

    return response.json();
  },
};