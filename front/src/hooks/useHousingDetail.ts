import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
  housingApi,
  reviewApi,
  wishlistApi,
  type HousingPhoto,
} from "../api/api";

import type { Housing } from "../types/housing";
import type {
  BookingForm,
  HousingDetails,
} from "../components/HousingDetail/housingDetail.types";
import type { Review } from "../types/review";

import { useAuthStore } from "../store/authStore";
import { useCurrency } from "./useCurrency";
import useLocalizedNavigate from "./useLocalizedNavigate";

import {
  getAverageRating,
  getRatingMetrics,
  getReviewCount,
} from "../components/HousingDetail/housingDetail.utils";

export const useHousingDetail = (housingId: number) => {
  const localizedNavigate = useLocalizedNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();
  const { convert, currency } = useCurrency();

  const [authOpen, setAuthOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [wishlistSaveOpen, setWishlistSaveOpen] = useState(false);

  const valid = Number.isFinite(housingId);

  const { data: housingData, isLoading } = useQuery<Housing>({
    queryKey: ["housing", housingId],
    queryFn: () => housingApi.getById(housingId),
    enabled: valid,
  });

  const housing = housingData as HousingDetails | undefined;

  const { data: photos = [] } = useQuery<HousingPhoto[]>({
    queryKey: ["housing-photos", housingId],
    queryFn: () => housingApi.getPhotos(housingId),
    enabled: valid,
  });

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
  } = useQuery<Review[]>({
    queryKey: ["housing-reviews", housingId],
    queryFn: () => reviewApi.getByHousing(housingId),
    enabled: valid,
  });

  const { data: wishlist = [] } = useQuery<Housing[]>({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getAll,
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  const isFavorite =
    !!housing && wishlist.some((item) => item.id === housing.id);

  const remove = useMutation({
    mutationFn: () => wishlistApi.remove(housingId),
    onSuccess: () => {
      queryClient.setQueryData<Housing[]>(
        ["wishlist"],
        (old) => (old ?? []).filter((item) => item.id !== housingId)
      );
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
    },
  });

  const form = useForm<BookingForm>({
    defaultValues: {
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      guestsCount: 1,
    },
  });

  const checkIn = form.watch("checkIn");
  const checkOut = form.watch("checkOut");
  const guestsCount = Number(form.watch("guestsCount") || 1);

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              86400000
          )
        )
      : 1;

  const onBook = (data: BookingForm) => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }

    if (!housing) return;

    localizedNavigate("/booking", {
      state: {
        housing,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guestsCount: Number(data.guestsCount),
        nights,
        total: housing.pricePerNight * nights,
      },
    });
  };

  const toggleWishlist = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }

    if (remove.isPending) return;

    if (isFavorite) {
      remove.mutate();
      return;
    }

    setWishlistSaveOpen(true);
  };

  const saveToWishlist = () => {
    queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    setWishlistSaveOpen(false);
  };

  const share = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: housing?.title ?? "WayGo",
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Користувач міг просто закрити системне меню share.
    }
  };

  const averageRating = getAverageRating(housing);
  const reviewCount = getReviewCount(housing);
  const ratingMetrics = getRatingMetrics(housing);

  return {
    housing,
    photos,
    reviews,
    reviewsLoading,

    isLoading,
    isAuthenticated,

    authOpen,
    setAuthOpen,

    activePhoto,
    setActivePhoto,

    galleryOpen,
    setGalleryOpen,

    reviewsOpen,
    setReviewsOpen,

    wishlistSaveOpen,
    setWishlistSaveOpen,

    copied,
    isFavorite,

    toggleWishlist,
    saveToWishlist,
    wishlistPending: remove.isPending,

    share,

    form,
    checkIn,
    checkOut,
    guestsCount,
    nights,

    price: housing ? convert(housing.pricePerNight) : 0,
    totalPrice: housing ? convert(housing.pricePerNight * nights) : 0,
    currency,

    averageRating,
    reviewCount,
    ratingMetrics,

    onBook,
  };
};
