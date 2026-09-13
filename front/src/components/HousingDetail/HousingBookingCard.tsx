import { useState } from "react";
import type {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import DateDropdown from "../DateSearch/DateDropdown";

import type { BookingForm } from "./housingDetail.types";
import { getNightLabel } from "./housingDetail.utils";

interface Props {
  price: number;
  totalPrice: number;
  currency: string;
  nights: number;
  maxGuests: number;
  checkIn: string;
  checkOut: string;
  register: UseFormRegister<BookingForm>;
  setValue: UseFormSetValue<BookingForm>;
  handleSubmit: UseFormHandleSubmit<BookingForm>;
  onBook: (data: BookingForm) => void;
}

const HousingBookingCard = ({
  price,
  totalPrice,
  currency,
  nights,
  maxGuests,
  checkIn,
  checkOut,
  register,
  setValue,
  handleSubmit,
  onBook,
}: Props) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const formatDate = (value: string) => {
    if (!value) return "";

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) return "";

    return `${day}.${month}.${year}`;
  };

  const datesLabel =
    checkIn && checkOut
      ? `${formatDate(checkIn)} – ${formatDate(checkOut)}`
      : "Дата заїзду – Дата виїзду";

  const handleCheckInChange = (value: string) => {
    setValue("checkIn", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCheckOutChange = (value: string) => {
    setValue("checkOut", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <aside className="lg:sticky lg:top-24">
      <form
        onSubmit={handleSubmit(onBook)}
        className="rounded-[8px] border border-[#7894A7] bg-white p-4"
      >
        <div className="mb-4 flex items-end gap-2">
          <span className="rounded-[5px] bg-[#355872] px-2 py-1 text-[17px] font-semibold text-white">
            {price.toLocaleString()} {currency.toUpperCase()}
          </span>

          <span className="pb-1 text-[11px] font-medium text-[#414B52]">
            за 1 ніч
          </span>
        </div>

        <div className="overflow-visible rounded-[7px] border border-[#C5CED4]">
          <div className="relative border-b border-[#C5CED4]">
            <button
              type="button"
              onClick={() => setCalendarOpen((current) => !current)}
              className="block w-full px-4 py-3 text-left"
            >
              <span className="block text-[10px] font-medium text-[#202A31]">
                Введіть дати
              </span>

              <span
                className={`mt-1 block text-[12px] ${
                  checkIn && checkOut
                    ? "text-[#355872]"
                    : "text-[#87939B]"
                }`}
              >
                {datesLabel}
              </span>
            </button>

            <input
              type="hidden"
              {...register("checkIn", {
                required: true,
              })}
            />

            <input
              type="hidden"
              {...register("checkOut", {
                required: true,
              })}
            />

            {calendarOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-[100] w-[680px] max-w-[calc(100vw-32px)]">
                <DateDropdown
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={handleCheckInChange}
                  onCheckOutChange={handleCheckOutChange}
                  onClose={() => setCalendarOpen(false)}
                />
              </div>
            )}
          </div>

          <label className="block px-4 py-3">
            <span className="block text-[10px] font-medium text-[#202A31]">
              Гості
            </span>

            <input
              type="number"
              min={1}
              max={maxGuests}
              {...register("guestsCount", {
                required: true,
                min: 1,
                max: maxGuests,
                valueAsNumber: true,
              })}
              className="mt-1 w-full bg-transparent text-[12px] text-[#202A31] outline-none"
            />
          </label>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[#56636C]">
          <span>
            {nights} {getNightLabel(nights)}
          </span>

          <span className="font-semibold text-[#202A31]">
            {totalPrice.toLocaleString()} {currency.toUpperCase()}
          </span>
        </div>

        <button
          type="submit"
          className="mt-4 h-[48px] w-full rounded-[6px] bg-[#243C4E] text-[13px] font-semibold text-white transition hover:bg-[#1D3241]"
        >
          Перевірити дати
        </button>
      </form>
    </aside>
  );
};

export default HousingBookingCard;