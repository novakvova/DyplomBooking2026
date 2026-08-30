import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import type { HousingAddress } from "./CreateHousingModal";

export type HousingCategory =
  | "apartment"
  | "house"
  | "hotel"
  | "alternative";

export type HousingPropertyType =
  | "entire_place"
  | "private_room"
  | "shared_room";

export type HousingRentalFormat =
  | "daily"
  | "hourly"
  | "flexible";

export type HousingAccommodationType =
  | "apartment"
  | "studio"
  | "loft"
  | "aparthotel"
  | "penthouse"
  | "duplex"
  | "house"
  | "villa"
  | "townhouse"
  | "chalet"
  | "bungalow"
  | "estate"
  | "hotel"
  | "mini_hotel"
  | "hostel"
  | "guest_house"
  | "motel"
  | "glamping"
  | "a_frame"
  | "barnhouse"
  | "tree_house"
  | "houseboat"
  | "camper";

export type BedroomLock = "yes" | "no";

export interface HousingRegistrationData {
  address: HousingAddress | null;
  category: HousingCategory | null;
  propertyType: HousingPropertyType | null;
  rentalFormat: HousingRentalFormat | null;
  accommodationType: HousingAccommodationType | null;

  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;

  privateBathroomInside: number;
  privateBathroomOutside: number;
  sharedBathroom: number;

  bedroomLock: BedroomLock | null;

  livesWithHost: boolean;
  livesWithFamily: boolean;
  otherGuestsPresent: boolean;
  petsPresent: boolean;

  title: string;
  highlights: string[];
  description: string;
  amenities: string[];
}

interface HousingRegistrationContextValue {
  data: HousingRegistrationData;
  updateData: (values: Partial<HousingRegistrationData>) => void;
  resetData: () => void;
}

interface HousingRegistrationProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "waygo-housing-registration";

const initialData: HousingRegistrationData = {
  address: null,
  category: null,
  propertyType: null,
  rentalFormat: null,
  accommodationType: null,

  guests: 1,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,

  privateBathroomInside: 1,
  privateBathroomOutside: 0,
  sharedBathroom: 0,

  bedroomLock: null,

  livesWithHost: false,
  livesWithFamily: false,
  otherGuestsPresent: false,
  petsPresent: false,
  
  title: "",
  highlights: [],
  description: "",
  amenities: [],
};

const HousingRegistrationContext =
  createContext<HousingRegistrationContextValue | null>(null);

const getInitialData = (): HousingRegistrationData => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (!saved) return initialData;

    return {
      ...initialData,
      ...JSON.parse(saved),
    };
  } catch {
    return initialData;
  }
};

export const HousingRegistrationProvider = ({
  children,
}: HousingRegistrationProviderProps) => {
  const [data, setData] = useState<HousingRegistrationData>(getInitialData);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (values: Partial<HousingRegistrationData>) => {
    setData((current) => ({
      ...current,
      ...values,
    }));
  };

  const resetData = () => {
    setData(initialData);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <HousingRegistrationContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </HousingRegistrationContext.Provider>
  );
};

export const useHousingRegistration = () => {
  const context = useContext(HousingRegistrationContext);

  if (!context) {
    throw new Error(
      "useHousingRegistration must be used inside HousingRegistrationProvider"
    );
  }

  return context;
};
