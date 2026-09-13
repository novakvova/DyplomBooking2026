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

export type BookingMode = "manual" | "instant";

export type BinaryRule = "forbidden" | "allowed";
export type QuietHoursMode = "disabled" | "enabled";
export type EarlyCheckInOption =
  | "none"
  | "subject_to_availability"
  | "allowed";

export type PreparationTime =
  | "none"
  | "one_day"
  | "manual";

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
  bookingMode: BookingMode | null;
  pricePerNight: number;
  pricePerHour: number;

  weeklyDiscountPercent: number;
  monthlyDiscountPercent: number;
  shortStayDiscountPercent: number;

  securityCameras: boolean;
  noiseMonitor: boolean;
  propertySafetyFeatures: boolean;

  securityCamerasDescription: string;
  noiseMonitorDescription: string;
  propertySafetyFeaturesDescription: string;

  checkInTime: string;
  checkOutTime: string;

  hourlyStartTime: string;
  hourlyEndTime: string;

  earlyCheckIn: EarlyCheckInOption;

  smokingRule: BinaryRule;
  petsRule: BinaryRule;
  partiesRule: BinaryRule;

  quietHoursMode: QuietHoursMode;
  quietHoursFrom: string;
  quietHoursTo: string;

  additionalRules: string;

  minimumStay: number;
  bookingWindowMonths: number;
  preparationTime: PreparationTime;

  amenities: string[];
}

interface HousingRegistrationContextValue {
  data: HousingRegistrationData;
  updateData: (values: Partial<HousingRegistrationData>) => void;
  resetData: () => void;

  photos: HousingRegistrationPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<HousingRegistrationPhoto[]>>;
}

interface HousingRegistrationProviderProps {
  children: ReactNode;
}

export interface HousingRegistrationPhoto {
  id: string;
  file: File;
  previewUrl: string;
  description: string;
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
  bookingMode: null,
  pricePerNight: 0,
  pricePerHour: 0,

  weeklyDiscountPercent: 0,
  monthlyDiscountPercent: 20,
  shortStayDiscountPercent: 5,

  securityCameras: false,
  noiseMonitor: false,
  propertySafetyFeatures: false,

  securityCamerasDescription: "",
  noiseMonitorDescription: "",
  propertySafetyFeaturesDescription: "",

  checkInTime: "14:00",
  checkOutTime: "11:00",

  hourlyStartTime: "09:00",
  hourlyEndTime: "21:00",

  earlyCheckIn: "none",

  smokingRule: "forbidden",
  petsRule: "forbidden",
  partiesRule: "forbidden",

  quietHoursMode: "disabled",
  quietHoursFrom: "22:00",
  quietHoursTo: "08:00",

  additionalRules: "",

  minimumStay: 1,
  bookingWindowMonths: 6,
  preparationTime: "none",

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
    photos.forEach((photo) =>
      URL.revokeObjectURL(photo.previewUrl)
    );

    setPhotos([]);
    setData(initialData);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const [photos, setPhotos] = useState<HousingRegistrationPhoto[]>([]);

  return (
    <HousingRegistrationContext.Provider
      value={{
        data,
        photos,
        setPhotos,
        updateData,
        resetData,
      }}
    >
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
