import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/authStore";
import { useCurrency } from "../hooks/useCurrency";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import useLocalizedPath from "../hooks/useLocalizedPath";

import {
  profileApi,
  paymentsApi,
  PaymentStatus,
  PaymentStatusColor,
} from "../api/api";

import apiClient from "../api/client";
import Footer from "../components/Footer/Footer";

type Section =
  | "personal"
  | "security"
  | "travelers"
  | "payment"
  | "transactions"
  | "notifications"
  | "privacy"
  | "support"
  | "complaint"
  | "requests";

interface EditField {
  field: string;
  label: string;
  value: string;
  type?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const { t, i18n } = useTranslation();

  const {
    isAuthenticated,
    _hasHydrated,
    user,
    setAuth,
    logout,
  } = useAuthStore();

  const { convert, currency } = useCurrency();

  const localizedNavigate = useLocalizedNavigate();
  const localizedPath = useLocalizedPath();
  const queryClient = useQueryClient();

  const [section, setSection] = useState<Section>("personal");
  const [editField, setEditField] = useState<EditField | null>(null);
  const [editValue, setEditValue] = useState("");

  const pwForm = useForm<PasswordForm>();

  // ─────────────────────────────────────────────
  // Payments
  // ─────────────────────────────────────────────

  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ["my-payments"],
    queryFn: paymentsApi.getMy,
    enabled: isAuthenticated && section === "transactions",
  });

  // ─────────────────────────────────────────────
  // Bookings
  // ─────────────────────────────────────────────

  const { data: bookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: profileApi.getMyBookings,
    enabled: isAuthenticated && section === "payment",
  });

  // ─────────────────────────────────────────────
  // Update profile
  // ─────────────────────────────────────────────

  const updateMutation = useMutation({
    mutationFn: async (data: { fullName?: string }) => {
      const { data: updated } = await apiClient.put("/profile", data);
      return updated;
    },

    onSuccess: (updated) => {
      setAuth(localStorage.getItem("waygo_token") ?? "", {
        email: updated.email,
        fullName: updated.fullName,
        roles: updated.roles,
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success(t("profile.toast.saved"));
      setEditField(null);
    },

    onError: () => {
      toast.error(t("profile.toast.saveError"));
    },
  });

  // ─────────────────────────────────────────────
  // Change password
  // ─────────────────────────────────────────────

  const changePasswordMutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      await apiClient.post("/profile/change-password", data);
    },

    onSuccess: () => {
      toast.success(t("profile.toast.passwordChanged"));
      pwForm.reset();
    },

    onError: () => {
      toast.error(t("profile.toast.wrongPassword"));
    },
  });

  // ─────────────────────────────────────────────
  // Loading auth state
  // ─────────────────────────────────────────────

  if (!_hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Auth redirect
  // ─────────────────────────────────────────────

  if (!isAuthenticated) {
    return <Navigate to={localizedPath()} replace />;
  }

  // ─────────────────────────────────────────────
  // Menu
  // ─────────────────────────────────────────────

  const menuItems = [
    {
      group: t("profile.menu.personalSecurity"),
      icon: "👤",
      items: [
        { key: "personal", label: t("profile.menu.personal") },
        { key: "security", label: t("profile.menu.security") },
        { key: "travelers", label: t("profile.menu.travelers") },
      ],
    },
    {
      group: t("profile.menu.paymentInfo"),
      icon: "💳",
      items: [
        { key: "payment", label: t("profile.menu.bookings") },
        { key: "transactions", label: t("profile.menu.transactions") },
      ],
    },
    {
      group: t("profile.menu.notificationsGroup"),
      icon: "🔔",
      items: [
        { key: "notifications", label: t("profile.menu.notifications") },
        { key: "privacy", label: t("profile.menu.privacy") },
      ],
    },
    {
      group: t("profile.menu.help"),
      icon: "📞",
      items: [
        { key: "support", label: t("profile.menu.support") },
        { key: "complaint", label: t("profile.menu.complaint") },
        { key: "requests", label: t("profile.menu.requests") },
      ],
    },
  ];

  // ─────────────────────────────────────────────
  // Personal fields
  // ─────────────────────────────────────────────

  const personalFields: EditField[] = [
    {
      field: "fullName",
      label: t("profile.fields.fullName"),
      value: user?.fullName ?? "",
      type: "text",
    },
    {
      field: "email",
      label: t("profile.fields.email"),
      value: user?.email ?? "",
      type: "email",
    },
    {
      field: "phone",
      label: t("profile.fields.phone"),
      value: "",
      type: "tel",
    },
    {
      field: "birthday",
      label: t("profile.fields.birthday"),
      value: "",
      type: "date",
    },
    {
      field: "citizenship",
      label: t("profile.fields.citizenship"),
      value: "",
      type: "text",
    },
    {
      field: "address",
      label: t("profile.fields.address"),
      value: "",
      type: "text",
    },
  ];

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(i18n.language);

  const formatLongDate = (value: string) =>
    new Date(value).toLocaleDateString(i18n.language, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formatPrice = (value: number) =>
    convert(value).toLocaleString(i18n.language);

  const getPaymentStatusLabel = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Pending:
        return t("profile.paymentStatus.pending");
      case PaymentStatus.Processing:
        return t("profile.paymentStatus.processing");
      case PaymentStatus.Paid:
        return t("profile.paymentStatus.paid");
      case PaymentStatus.Failed:
        return t("profile.paymentStatus.failed");
      case PaymentStatus.Refunded:
        return t("profile.paymentStatus.refunded");
      default:
        return "";
    }
  };

  const getBookingStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return t("profile.bookingStatus.pending");
      case 1:
        return t("profile.bookingStatus.confirmed");
      case 2:
        return t("profile.bookingStatus.cancelled");
      default:
        return t("profile.bookingStatus.completed");
    }
  };

  const getBookingStatusColor = (status: number) => {
    if (status === 1) return "bg-green-100 text-green-700";
    if (status === 2) return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  // ─────────────────────────────────────────────
  // Edit profile
  // ─────────────────────────────────────────────

  const handleEdit = (field: EditField) => {
    setEditField(field);
    setEditValue(field.value);
  };

  const handleSave = () => {
    if (!editField) return;

    if (editField.field === "fullName") {
      updateMutation.mutate({ fullName: editValue });
      return;
    }

    toast(t("profile.toast.fieldNotSupported"), { icon: "ℹ️" });
    setEditField(null);
  };

  // ─────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────

  const handleLogout = () => {
    logout();
    localizedNavigate("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">
          {t("profile.title")}
        </h1>

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="w-72 shrink-0">
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-300 text-xl font-bold text-white">
                {user?.fullName?.[0]?.toUpperCase() ??
                  user?.email?.[0]?.toUpperCase() ??
                  "U"}
              </div>

              <div className="overflow-hidden">
                <p className="truncate font-semibold text-slate-800">
                  {user?.fullName ?? t("profile.user")}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((group) => (
                <div
                  key={group.group}
                  className="overflow-hidden rounded-2xl border border-slate-200"
                >
                  <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-700">
                      {group.group}
                    </span>

                    <span>{group.icon}</span>
                  </div>

                  {group.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSection(item.key as Section)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition ${
                        section === item.key
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                {t("profile.logout")}
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1">
            {/* Personal */}
            {section === "personal" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t("profile.personal.title")}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {t("profile.personal.description")}
                </p>

                <div className="mt-6 flex items-start gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-slate-300 text-4xl font-bold text-white">
                      {user?.fullName?.[0]?.toUpperCase() ?? "U"}
                    </div>

                    <button
                      type="button"
                      className="text-xs font-medium text-slate-600 underline hover:text-slate-900"
                    >
                      {t("profile.personal.change")}
                    </button>
                  </div>

                  <div className="flex flex-1 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <span className="font-medium text-slate-800">
                      {t("profile.personal.verification")}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">
                        {t("profile.personal.notVerified")}
                      </span>

                      <button
                        type="button"
                        className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
                      >
                        {t("profile.personal.start")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 divide-y divide-slate-100">
                  {personalFields.map((field) => (
                    <div
                      key={field.field}
                      className="flex items-center justify-between py-4"
                    >
                      {editField?.field === field.field ? (
                        <div className="flex flex-1 items-center gap-4">
                          <div className="flex-1">
                            <p className="mb-1 text-xs font-medium text-slate-500">
                              {field.label}
                            </p>

                            <input
                              type={field.type}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSave}
                              disabled={updateMutation.isPending}
                              className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-60"
                            >
                              {t("common.save")}
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditField(null)}
                              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                              {t("common.cancel")}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">
                              {field.label}
                            </p>

                            {field.value ? (
                              <p className="mt-0.5 text-sm text-slate-500">
                                {field.value}
                              </p>
                            ) : (
                              <p className="mt-0.5 text-sm italic text-slate-300">
                                {field.label}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleEdit(field)}
                            className="text-sm font-medium text-slate-600 underline hover:text-slate-900"
                          >
                            {t("common.edit")}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {section === "security" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t("profile.security.title")}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {t("profile.security.description")}
                </p>

                <div className="mt-8 max-w-md rounded-2xl border border-slate-200 p-6">
                  <h3 className="mb-4 font-semibold text-slate-800">
                    {t("profile.security.changePassword")}
                  </h3>

                  <form
                    onSubmit={pwForm.handleSubmit((data) => {
                      if (data.newPassword !== data.confirmPassword) {
                        toast.error(t("profile.toast.passwordsDoNotMatch"));
                        return;
                      }

                      changePasswordMutation.mutate({
                        currentPassword: data.currentPassword,
                        newPassword: data.newPassword,
                      });
                    })}
                    className="space-y-4"
                  >
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        {t("profile.security.currentPassword")}
                      </label>

                      <input
                        type="password"
                        {...pwForm.register("currentPassword", {
                          required: true,
                        })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        {t("profile.security.newPassword")}
                      </label>

                      <input
                        type="password"
                        {...pwForm.register("newPassword", {
                          required: true,
                          minLength: 6,
                        })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        {t("profile.security.confirmPassword")}
                      </label>

                      <input
                        type="password"
                        {...pwForm.register("confirmPassword", {
                          required: true,
                        })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      className="w-full rounded-xl bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                    >
                      {changePasswordMutation.isPending
                        ? t("common.saving")
                        : t("profile.security.changePassword")}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Transactions */}
            {section === "transactions" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t("profile.transactions.title")}
                </h2>

                <p className="mb-6 mt-1 text-sm text-slate-500">
                  {t("profile.transactions.description")}
                </p>

                {loadingPayments && (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="h-20 animate-pulse rounded-2xl bg-slate-100"
                      />
                    ))}
                  </div>
                )}

                {payments?.length === 0 && (
                  <div className="rounded-2xl bg-slate-50 p-12 text-center text-slate-400">
                    💳 {t("profile.transactions.empty")}
                  </div>
                )}

                {payments && payments.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between py-4"
                      >
                        <div>
                          <p className="font-mono text-sm font-medium text-slate-800">
                            {payment.transactionId}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {formatLongDate(payment.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              PaymentStatusColor[payment.status]
                            }`}
                          >
                            {getPaymentStatusLabel(payment.status)}
                          </span>

                          <span className="font-bold text-slate-800">
                            {formatPrice(payment.amount)}{" "}
                            {currency.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings */}
            {section === "payment" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t("profile.bookings.title")}
                </h2>

                <p className="mb-6 mt-1 text-sm text-slate-500">
                  {t("profile.bookings.description")}
                </p>

                {bookings?.length === 0 && (
                  <div className="rounded-2xl bg-slate-50 p-12 text-center text-slate-400">
                    🏠 {t("profile.bookings.empty")}
                  </div>
                )}

                {bookings && bookings.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-start justify-between py-4"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            {booking.housingTitle}
                          </p>

                          <p className="mt-0.5 text-sm text-slate-500">
                            📅 {formatDate(booking.checkIn)} →{" "}
                            {formatDate(booking.checkOut)}
                          </p>

                          <p className="text-sm text-slate-500">
                            👥{" "}
                            {t("profile.bookings.guests", {
                              count: booking.guestsCount,
                            })}
                          </p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getBookingStatusColor(
                              booking.status
                            )}`}
                          >
                            {getBookingStatusLabel(booking.status)}
                          </span>

                          <p className="mt-1 font-bold text-slate-800">
                            {formatPrice(booking.totalPrice)}{" "}
                            {currency.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Coming soon */}
            {[
              "travelers",
              "notifications",
              "privacy",
              "support",
              "complaint",
              "requests",
            ].includes(section) && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="mb-4 text-6xl">🚧</div>

                <p className="text-lg font-medium">
                  {t("profile.comingSoon.title")}
                </p>

                <p className="mt-1 text-sm">
                  {t("profile.comingSoon.description")}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;