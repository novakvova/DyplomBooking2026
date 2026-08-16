import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { housingApi, wishlistApi, type HousingPhoto} from "../api/api";
import { useAuthStore } from "../store/authStore";
import AuthModal from "../components/AuthModal/AuthModal";
import type { Housing } from "../types/housing";
import { useCurrency } from "../hooks/useCurrency";


/////////////////////////////////
// Сторінка одного оголошення
/////////////////////////////////

interface BookingForm {
  checkIn: string;
  checkOut: string;
  guestsCount: number;
}


const typeLabels: Record<string | number, string> = {
  0: "Квартира",
  1: "Будинок",
  2: "Кімната",
  3: "Студія",
  4: "Вілла",

  Apartment: "Квартира",
  House: "Будинок",
  Room: "Кімната",
  Studio: "Студія",
  Villa: "Вілла",
};


const HousingDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const queryClient = useQueryClient();

  const { convert, currency } = useCurrency();

  const [authOpen, setAuthOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const housingId = Number(id);


  //////////////////////////////////
  // Housing
  //////////////////////////////////

  const {
    data: housing,
    isLoading,
  } = useQuery<Housing>({
    queryKey: ["housing", housingId],

    queryFn: () =>
      housingApi.getById(housingId),

    enabled:
      !!id &&
      !Number.isNaN(housingId),
  });


  //////////////////////////////////
  // Photos
  //////////////////////////////////

  const {
    data: photos = [],
  } = useQuery<HousingPhoto[]>({
    queryKey: [
      "housing-photos",
      housingId,
    ],

    queryFn: () =>
      housingApi.getPhotos(housingId),

    enabled:
      !!id &&
      !Number.isNaN(housingId),
  });


  //////////////////////////////////
  // Wishlist
  //////////////////////////////////

  const {
    data: wishlist = [],
  } = useQuery<Housing[]>({
    queryKey: ["wishlist"],

    queryFn: wishlistApi.getAll,

    // Wishlist потрібен тільки авторизованому юзеру
    enabled: isAuthenticated,

    retry: false,

    refetchOnWindowFocus: false,

    staleTime:
      1000 * 60 * 5,
  });


  const isFavorite =
    housing !== undefined &&
    wishlist.some(
      (item) =>
        item.id === housing.id
    );


  //////////////////////////////////
  // Add wishlist
  //////////////////////////////////

  const addWishlistMutation =
    useMutation({
      mutationFn: () =>
        wishlistApi.add(housingId),

      onSuccess: () => {
        if (!housing) return;

        queryClient.setQueryData<
          Housing[]
        >(
          ["wishlist"],

          (old = []) => {
            const alreadyExists =
              old.some(
                (item) =>
                  item.id ===
                  housing.id
              );

            if (alreadyExists) {
              return old;
            }

            return [
              ...old,
              housing,
            ];
          }
        );
      },
    });


  //////////////////////////////////
  // Remove wishlist
  //////////////////////////////////

  const removeWishlistMutation =
    useMutation({
      mutationFn: () =>
        wishlistApi.remove(
          housingId
        ),

      onSuccess: () => {
        queryClient.setQueryData<
          Housing[]
        >(
          ["wishlist"],

          (old = []) =>
            old.filter(
              (item) =>
                item.id !==
                housingId
            )
        );
      },
    });


  //////////////////////////////////
  // Wishlist click
  //////////////////////////////////

  const handleWishlist = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }

    if (
      addWishlistMutation.isPending ||
      removeWishlistMutation.isPending
    ) {
      return;
    }

    if (isFavorite) {
      removeWishlistMutation.mutate();
    } else {
      addWishlistMutation.mutate();
    }
  };


  //////////////////////////////////
  // Booking form
  //////////////////////////////////

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<BookingForm>({
    defaultValues: {
      checkIn:
        new Date()
          .toISOString()
          .split("T")[0],

      checkOut:
        new Date(
          Date.now() + 86400000
        )
          .toISOString()
          .split("T")[0],

      guestsCount: 1,
    },
  });


  const checkIn =
    watch("checkIn");

  const checkOut =
    watch("checkOut");


  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (
              new Date(
                checkOut
              ).getTime() -
              new Date(
                checkIn
              ).getTime()
            ) /
              86400000
          )
        )
      : 1;


  //////////////////////////////////
  // Booking
  //////////////////////////////////

  const onBook = (
    data: BookingForm
  ) => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }

    if (!housing) {
      return;
    }

    navigate("/booking", {
      state: {
        housing,

        checkIn:
          data.checkIn,

        checkOut:
          data.checkOut,

        guestsCount:
          Number(
            data.guestsCount
          ),

        nights,

        // На backend передаємо базову ціну
        total:
          housing.pricePerNight *
          nights,
      },
    });
  };


  //////////////////////////////////
  // Photo carousel
  //////////////////////////////////

  const prevPhoto = () => {
    if (photos.length === 0) {
      return;
    }

    setActivePhoto(
      (i) =>
        (
          i -
          1 +
          photos.length
        ) %
        photos.length
    );
  };


  const nextPhoto = () => {
    if (photos.length === 0) {
      return;
    }

    setActivePhoto(
      (i) =>
        (i + 1) %
        photos.length
    );
  };


  //////////////////////////////////
  // Loading
  //////////////////////////////////

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }


  //////////////////////////////////
  // Not found
  //////////////////////////////////

  if (!housing) {
    return (
      <div className="py-20 text-center text-slate-500">
        Житло не знайдено
      </div>
    );
  }


  //////////////////////////////////
  // Render
  //////////////////////////////////

  return (
    <>
      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* Back */}

        <button
          onClick={() =>
            navigate(-1)
          }
          className="
            mb-6
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
            transition
            hover:text-slate-800
          "
        >
          ← Назад
        </button>


        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT */}

          <div className="lg:col-span-2">

            {/* PHOTO CAROUSEL */}

            <div
              className="
                relative
                mb-6
                h-[320px]
                overflow-hidden
                rounded-2xl
                bg-slate-100
              "
            >

              {/* Main photo */}

              {photos.length > 0 ? (
                <img
                  src={
                    photos[
                      activePhoto
                    ]?.filePath
                  }
                  alt={housing.title}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-opacity
                    duration-300
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    items-center
                    justify-center
                  "
                >
                  <img
                    src="/images/logos/Logo_WayGo.png"
                    alt="WayGo"
                    className="h-10 w-auto"
                  />
                </div>
              )}


              {/* Wishlist */}

              <button
                type="button"
                onClick={
                  handleWishlist
                }
                disabled={
                  addWishlistMutation.isPending ||
                  removeWishlistMutation.isPending
                }
                aria-label={
                  isFavorite
                    ? "Видалити зі списку бажань"
                    : "Додати до списку бажань"
                }
                className="
                  absolute
                  right-4
                  top-4
                  z-20
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  shadow-lg
                  transition
                  hover:scale-105
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <span
                  className={`
                    text-[27px]
                    leading-none

                    ${
                      isFavorite
                        ? "text-red-500"
                        : "text-slate-800"
                    }
                  `}
                >
                  {isFavorite
                    ? "♥"
                    : "♡"}
                </span>
              </button>


              {/* Arrows */}

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={
                      prevPhoto
                    }
                    className="
                      absolute
                      left-3
                      top-1/2
                      flex
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      bg-white/90
                      text-xl
                      shadow
                      transition
                      hover:bg-white
                    "
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={
                      nextPhoto
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      bg-white/90
                      text-xl
                      shadow
                      transition
                      hover:bg-white
                    "
                  >
                    ›
                  </button>
                </>
              )}


              {/* Counter */}

              {photos.length > 1 && (
                <div
                  className="
                    absolute
                    bottom-3
                    right-3
                    rounded-full
                    bg-black/50
                    px-2.5
                    py-1
                    text-xs
                    text-white
                  "
                >
                  {activePhoto + 1}
                  {" / "}
                  {photos.length}
                </div>
              )}

            </div>


            {/* THUMBNAILS */}

            {photos.length > 1 && (
              <div
                className="
                  mb-6
                  flex
                  gap-2
                  overflow-x-auto
                  pb-1
                "
              >
                {photos.map(
                  (
                    photo,
                    index
                  ) => (

                    <button
                      type="button"
                      key={
                        photo.id
                      }
                      onClick={() =>
                        setActivePhoto(
                          index
                        )
                      }
                      className={`
                        h-[60px]
                        w-[80px]
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border-2
                        transition

                        ${
                          index ===
                          activePhoto
                            ? "border-slate-800"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }
                      `}
                    >
                      <img
                        src={
                          photo.filePath
                        }
                        alt=""
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    </button>

                  )
                )}
              </div>
            )}


            {/* TITLE + PRICE */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >

              <div>

                <span
                  className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-slate-600
                  "
                >
                  {typeLabels[
                    housing.type
                  ] ??
                    housing.type}
                </span>


                <h1
                  className="
                    mt-2
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >
                  {housing.title}
                </h1>


                <p className="mt-1 text-slate-500">
                  📍 {housing.city},{" "}
                  {housing.address}
                </p>

              </div>


              <div className="text-right">

                <p
                  className="
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >
                  {convert(
                    housing.pricePerNight
                  ).toLocaleString()}{" "}
                  {currency.toUpperCase()}
                </p>

                <p className="text-sm text-slate-400">
                  за ніч
                </p>

              </div>

            </div>


            {/* DETAILS */}

            <div className="mt-6 flex gap-6">

              <div
                className="
                  rounded-xl
                  bg-slate-50
                  px-4
                  py-3
                  text-center
                "
              >
                <p className="text-2xl font-bold text-slate-800">
                  {housing.rooms}
                </p>

                <p className="text-xs text-slate-500">
                  кімнат
                </p>
              </div>


              <div
                className="
                  rounded-xl
                  bg-slate-50
                  px-4
                  py-3
                  text-center
                "
              >
                <p className="text-2xl font-bold text-slate-800">
                  {housing.maxGuests}
                </p>

                <p className="text-xs text-slate-500">
                  гостей макс.
                </p>
              </div>

            </div>


            {/* DESCRIPTION */}

            {housing.description && (
              <div className="mt-6">

                <h2 className="text-lg font-semibold text-slate-800">
                  Опис
                </h2>

                <p
                  className="
                    mt-2
                    leading-relaxed
                    text-slate-600
                  "
                >
                  {housing.description}
                </p>

              </div>
            )}

          </div>


          {/* RIGHT — BOOKING */}

          <div className="lg:col-span-1">

            <div
              className="
                sticky
                top-24
                rounded-2xl
                border
                border-slate-200
                p-6
                shadow-sm
              "
            >

              <h2
                className="
                  mb-4
                  text-lg
                  font-semibold
                  text-slate-800
                "
              >
                Забронювати
              </h2>


              <form
                onSubmit={
                  handleSubmit(
                    onBook
                  )
                }
                className="space-y-4"
              >

                {/* Check in */}

                <div>

                  <label
                    className="
                      mb-1
                      block
                      text-xs
                      font-medium
                      text-slate-600
                    "
                  >
                    Заїзд
                  </label>

                  <input
                    type="date"
                    {...register(
                      "checkIn",
                      {
                        required:
                          true,
                      }
                    )}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-3
                      py-2
                      text-sm
                      outline-none
                      focus:border-slate-400
                    "
                  />

                </div>


                {/* Check out */}

                <div>

                  <label
                    className="
                      mb-1
                      block
                      text-xs
                      font-medium
                      text-slate-600
                    "
                  >
                    Виїзд
                  </label>

                  <input
                    type="date"
                    {...register(
                      "checkOut",
                      {
                        required:
                          true,
                      }
                    )}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-3
                      py-2
                      text-sm
                      outline-none
                      focus:border-slate-400
                    "
                  />

                </div>


                {/* Guests */}

                <div>

                  <label
                    className="
                      mb-1
                      block
                      text-xs
                      font-medium
                      text-slate-600
                    "
                  >
                    Гостей
                  </label>

                  <input
                    type="number"
                    min={1}
                    max={
                      housing.maxGuests
                    }
                    {...register(
                      "guestsCount",
                      {
                        required:
                          true,

                        min: 1,

                        max:
                          housing.maxGuests,
                      }
                    )}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-3
                      py-2
                      text-sm
                      outline-none
                      focus:border-slate-400
                    "
                  />

                </div>


                {/* TOTAL */}

                <div
                  className="
                    space-y-1
                    rounded-xl
                    bg-slate-50
                    p-3
                    text-sm
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                      text-slate-600
                    "
                  >

                    <span>
                      {convert(
                        housing.pricePerNight
                      ).toLocaleString()}{" "}
                      {currency.toUpperCase()}{" "}
                      × {nights} ночей
                    </span>


                    <span>
                      {convert(
                        housing.pricePerNight *
                          nights
                      ).toLocaleString()}{" "}
                      {currency.toUpperCase()}
                    </span>

                  </div>


                  <div
                    className="
                      mt-1
                      flex
                      justify-between
                      border-t
                      border-slate-200
                      pt-1
                      font-semibold
                      text-slate-800
                    "
                  >
                    <span>
                      Разом
                    </span>

                    <span>
                      {convert(
                        housing.pricePerNight *
                          nights
                      ).toLocaleString()}{" "}
                      {currency.toUpperCase()}
                    </span>

                  </div>

                </div>


                {/* BOOK BUTTON */}

                <button
                  type="submit"
                  className="
                    w-full
                    rounded-xl
                    bg-slate-800
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-slate-700
                  "
                >
                  {!isAuthenticated
                    ? "🔐 Увійдіть для бронювання"
                    : "Перейти до оплати →"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>


      <AuthModal
        isOpen={authOpen}
        onClose={() =>
          setAuthOpen(false)
        }
      />

    </>
  );
};


export default HousingDetailPage;