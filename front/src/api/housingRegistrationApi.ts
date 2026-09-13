import axios from "axios";
import apiClient from "./client";

import type {
  HousingRegistrationData,
  HousingRegistrationPhoto,
} from "../components/CreateHousing/HousingRegistrationContext";

export interface CreateHousingResponse {
  id: number;
  title: string;
  isAvailable: boolean;
}

const getApiErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : "Не вдалося створити оголошення.";
  }

  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors)
      .flatMap((value) => Array.isArray(value) ? value : [value])
      .filter((value): value is string => typeof value === "string");

    if (messages.length) return messages.join("\n");
  }

  return (
    data?.detail ||
    data?.message ||
    data?.title ||
    "Не вдалося створити оголошення."
  );
};

export const housingRegistrationApi = {
  create: async (
    data: HousingRegistrationData,
    photos: HousingRegistrationPhoto[]
  ): Promise<CreateHousingResponse> => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(data));

    photos.forEach((photo) => {
      formData.append("photos", photo.file, photo.file.name);
    });

    try {
      const response = await apiClient.post<CreateHousingResponse>(
        "/housing/register",
        formData
      );

      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
