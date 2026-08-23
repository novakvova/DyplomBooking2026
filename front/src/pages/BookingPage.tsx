import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  housingApi,
  paymentsApi,
  PaymentMethod,
  PaymentStatus,
  type HousingBooking,
} from "../api/api";

import { useCurrency } from "../hooks/useCurrency";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import useLocalizedPath from "../hooks/useLocalizedPath";

import type { Housing } from "../types/housing";
import { getMediaUrl } from "../api/client";

interface LocationState {
  housing: Housing;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nights: number;
  total: number;
}

interface PaymentForm {
  method: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

const BookingPage = () => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const localizedNavigate = useLocalizedNavigate();
  const localizedPath = useLocalizedPath();

  const location = useLocation();
  const state = location.state as LocationState | null;

  const { convert, currency } = useCurrency();

  const [step, setStep] = useState<
    "payment" | "processing" | "success" | "failed"
  >("payment");

  const [payment, setPayment] = useState<{
    transactionId: string;
    amount: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentForm>({
    defaultValues: {
      method: "0",
    },
  });

  const selectedMethod = watch("method");
  const isCard = selectedMethod === "0" || selectedMethod === "1";

  // Якщо сторінка відкрита напряму без booking state —
  // повертаємо користувача на локалізовану головну.
  if (!state) {
    return <Navigate to={localizedPath()} replace />;
  }

  const {
    housing,
    checkIn,
    checkOut,
    guestsCount,
    nights,
    total,
  } = state;

  // ─────────────────────────────────────────────
  // Localized formatting
  // ─────────────────────────────────────────────

  const formatPrice = (value: number) =>
    convert(value).toLocaleString(i18n.language);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(i18n.language);

  const methodLabels: Record<string, string> = {
    "0": t("booking.paymentMethods.creditCard"),
    "1": t("booking.paymentMethods.debitCard"),
    "2": t("booking.paymentMethods.paypal"),
    "3": t("booking.paymentMethods.bankTransfer"),
  };

  // ─────────────────────────────────────────────
  // Payment
  // ─────────────────────────────────────────────

  const onSubmit = async (formData: PaymentForm) => {
    setStep("processing");

    try {
      // Крок 1: створюємо бронювання.
      const booking: HousingBooking = await housingApi.book(housing.id, {
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guestsCount,
      });

      // Крок 2: проводимо оплату.
      const cardLastFour = isCard
        ? formData.cardNumber.replace(/\s/g, "").slice(-4)
        : undefined;

      const result = await paymentsApi.payHousingBooking({
        housingBookingId: booking.id,
        method: Number(formData.method) as PaymentMethod,
        cardLastFour,
      });

      if (result.status === PaymentStatus.Paid) {
        setPayment({
          transactionId: result.transactionId,
          amount: result.amount,
        });

        setStep("success");
        toast.success(t("booking.toast.success"));
      } else {
        setStep("failed");

        toast.error(
          result.failureReason ||
            t("booking.toast.paymentDeclined")
        );
      }
    } catch (err: any) {
      setStep("failed");

      toast.error(
        typeof err.response?.data === "string"
          ? err.response.data
          : t("booking.toast.bookingError")
      );
    }
  };

  // ─────────────────────────────────────────────
  // Processing
  // ─────────────────────────────────────────────

  if (step === "processing") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

        <p className="text-slate-600">
          {t("booking.processing")}
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Success
  // ─────────────────────────────────────────────

  if (step === "success") {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="mb-6 text-6xl">🎉</div>

        <h1 className="text-2xl font-bold text-slate-800">
          {t("booking.success.title")}
        </h1>

        <p className="mt-2 text-slate-500">
          {housing.title}
        </p>

        <div className="my-8 space-y-3 rounded-2xl bg-green-50 p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              {t("booking.success.transaction")}
            </span>

            <span className="font-mono font-medium text-slate-800">
              {payment?.transactionId}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              {t("booking.checkIn")}
            </span>

            <span className="font-medium text-slate-800">
              {formatDate(checkIn)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              {t("booking.checkOut")}
            </span>

            <span className="font-medium text-slate-800">
              {formatDate(checkOut)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              {t("booking.guests")}
            </span>

            <span className="font-medium text-slate-800">
              {guestsCount}
            </span>
          </div>

          <div className="flex justify-between border-t border-green-200 pt-3 text-base font-bold">
            <span className="text-slate-700">
              {t("booking.success.paid")}
            </span>

            <span className="text-green-600">
              {formatPrice(payment?.amount ?? 0)}{" "}
              {currency.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => localizedNavigate("/profile")}
            className="flex-1 rounded-xl bg-slate-800 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            {t("booking.success.myBookings")}
          </button>

          <button
            type="button"
            onClick={() => localizedNavigate("")}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {t("booking.success.home")}
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Failed
  // ─────────────────────────────────────────────

  if (step === "failed") {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="mb-6 text-6xl">😞</div>

        <h1 className="text-2xl font-bold text-slate-800">
          {t("booking.failed.title")}
        </h1>

        <p className="mt-2 text-slate-500">
          {t("booking.failed.description")}
        </p>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => setStep("payment")}
            className="flex-1 rounded-xl bg-slate-800 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            {t("booking.failed.tryAgain")}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Payment form
  // ─────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
      >
        ← {t("common.back")}
      </button>

      <h1 className="mb-8 text-2xl font-bold text-slate-800">
        {t("booking.title")}
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Payment form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Payment method */}
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-800">
                {t("booking.paymentMethod")}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(methodLabels).map(([value, label]) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                      selectedMethod === value
                        ? "border-slate-800 bg-slate-50 font-medium"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register("method")}
                      className="accent-slate-800"
                    />

                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Card details */}
            {isCard && (
              <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-semibold text-slate-800">
                  {t("booking.card.title")}
                </h2>

                {/* Card number */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    {t("booking.card.number")}
                  </label>

                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    {...register("cardNumber", {
                      required: isCard
                        ? t("booking.validation.cardNumberRequired")
                        : false,
                      minLength: {
                        value: 19,
                        message: t("booking.validation.cardNumberFull"),
                      },
                    })}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16);

                      e.target.value = value
                        .replace(/(.{4})/g, "$1 ")
                        .trim();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-slate-400"
                  />

                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                {/* Card holder */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    {t("booking.card.holder")}
                  </label>

                  <input
                    type="text"
                    placeholder={t("booking.card.holderPlaceholder")}
                    {...register("cardName", {
                      required: isCard
                        ? t("booking.validation.cardNameRequired")
                        : false,
                    })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none focus:border-slate-400"
                  />

                  {errors.cardName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.cardName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      {t("booking.card.expiry")}
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      {...register("cardExpiry", {
                        required: isCard
                          ? t("booking.validation.expiryRequired")
                          : false,
                      })}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);

                        e.target.value =
                          value.length > 2
                            ? `${value.slice(0, 2)}/${value.slice(2)}`
                            : value;
                      }}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-slate-400"
                    />

                    {errors.cardExpiry && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.cardExpiry.message}
                      </p>
                    )}
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      {t("booking.card.cvv")}
                    </label>

                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      {...register("cardCvv", {
                        required: isCard
                          ? t("booking.validation.cvvRequired")
                          : false,
                      })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-slate-400"
                    />

                    {errors.cardCvv && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.cardCvv.message}
                      </p>
                    )}
                  </div>
                </div>

                <p className="flex items-center gap-2 text-xs text-slate-400">
                  🔒 {t("booking.card.secure")}
                </p>
              </div>
            )}

            {/* PayPal / bank transfer */}
            {!isCard && (
              <div className="rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-500">
                {selectedMethod === "2"
                  ? t("booking.paypalInfo")
                  : t("booking.bankInfo")}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-800 py-4 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {t("booking.payButton", {
                amount: `${formatPrice(total)} ${currency.toUpperCase()}`,
              })}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              {t("booking.summary.title")}
            </h2>

            {housing.mainPhotoPath && (
              <img
                src={getMediaUrl(housing.mainPhotoPath)}
                alt={housing.title}
                className="mb-4 h-36 w-full rounded-xl object-cover"
              />
            )}

            <h3 className="font-medium text-slate-800">
              {housing.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              📍 {housing.city}
            </p>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{t("booking.checkIn")}</span>
                <span className="font-medium">{formatDate(checkIn)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{t("booking.checkOut")}</span>
                <span className="font-medium">{formatDate(checkOut)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{t("booking.guests")}</span>
                <span className="font-medium">{guestsCount}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>
                  {formatPrice(housing.pricePerNight)}{" "}
                  {currency.toUpperCase()} ×{" "}
                  {t("booking.nights", { count: nights })}
                </span>

                <span className="font-medium">
                  {formatPrice(total)} {currency.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-800">
                <span>{t("booking.total")}</span>

                <span>
                  {formatPrice(total)} {currency.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;