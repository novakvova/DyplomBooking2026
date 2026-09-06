import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  Bell,
  CircleUserRound,
  CreditCard,
  FilePenLine,
  Headphones,
  History,
  LockKeyhole,
  LogOut,
  MessageCircleQuestion,
  MessagesSquare,
  Phone,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { useAuthStore } from "../store/authStore";
import {
  paymentsApi,
  PaymentStatus,
  PaymentStatusColor,
  PaymentStatusLabel,
  profileApi,
} from "../api/api";
import apiClient from "../api/client";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import useLocalizedPath from "../hooks/useLocalizedPath";

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

const ProfilePage = () => {
  const {
    isAuthenticated,
    _hasHydrated,
    user,
    setAuth,
    logout,
  } = useAuthStore();

  const { t } = useTranslation();
  const localizedNavigate = useLocalizedNavigate();
  const localizedPath = useLocalizedPath();
  const queryClient = useQueryClient();

  const [section, setSection] =
    useState<Section>("personal");

  const [editField, setEditField] =
    useState<EditField | null>(null);

  const [editValue, setEditValue] =
    useState("");

  const { data: payments, isLoading: loadingPayments } =
    useQuery({
      queryKey: ["my-payments"],
      queryFn: paymentsApi.getMy,
      enabled:
        isAuthenticated &&
        section === "transactions",
    });

  const { data: bookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: profileApi.getMyBookings,
    enabled:
      isAuthenticated &&
      section === "payment",
  });

  const updateMutation = useMutation({
    mutationFn: async (
      data: { fullName?: string }
    ) => {
      const { data: updated } =
        await apiClient.put(
          "/profile",
          data
        );

      return updated;
    },

    onSuccess: (updated) => {
      setAuth(
        localStorage.getItem(
          "waygo_token"
        ) ?? "",
        {
          email: updated.email,
          fullName: updated.fullName,
          roles: updated.roles,
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      toast.success(
        t("profile.toast.saved")
      );

      setEditField(null);
    },

    onError: () =>
      toast.error(
        t("profile.toast.saveError")
      ),
  });

  const changePasswordMutation =
    useMutation({
      mutationFn: async (data: {
        currentPassword: string;
        newPassword: string;
      }) => {
        await apiClient.post(
          "/profile/change-password",
          data
        );
      },

      onSuccess: () => {
        toast.success(
          "Пароль змінено"
        );

        pwForm.reset();
      },

      onError: () =>
        toast.error(
          "Невірний поточний пароль"
        ),
    });

  const pwForm = useForm<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>();

  if (!_hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#355F7D]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={localizedPath()}
        replace
      />
    );
  }

  const menuItems = [
    {
      group: t(
        "profile.menu.personalSecurity"
      ),
      icon: CircleUserRound,
      items: [
        {
          key: "personal",
          label: t(
            "profile.menu.personal"
          ),
          icon: Settings,
        },
        {
          key: "security",
          label: t(
            "profile.menu.security"
          ),
          icon: ShieldCheck,
        },
        {
          key: "travelers",
          label: t(
            "profile.menu.travelers"
          ),
          icon: UsersRound,
        },
      ],
    },
    {
      group: t(
        "profile.menu.paymentInfo"
      ),
      icon: CreditCard,
      items: [
        {
          key: "payment",
          label: t(
            "profile.menu.bookings"
          ),
          icon: WalletCards,
        },
        {
          key: "transactions",
          label: t(
            "profile.menu.transactions"
          ),
          icon: History,
        },
      ],
    },
    {
      group: t(
        "profile.menu.notificationsGroup"
      ),
      icon: Bell,
      items: [
        {
          key: "notifications",
          label: t(
            "profile.menu.notifications"
          ),
          icon: MessagesSquare,
        },
        {
          key: "privacy",
          label: t(
            "profile.menu.privacy"
          ),
          icon: LockKeyhole,
        },
      ],
    },
    {
      group: t(
        "profile.menu.help"
      ),
      icon: Phone,
      items: [
        {
          key: "support",
          label: t(
            "profile.menu.support"
          ),
          icon: Headphones,
        },
        {
          key: "complaint",
          label: t(
            "profile.menu.complaint"
          ),
          icon: FilePenLine,
        },
        {
          key: "requests",
          label: t(
            "profile.menu.requests"
          ),
          icon: MessageCircleQuestion,
        },
      ],
    },
  ] as const;

  const personalFields = [
    {
      field: "fullName",
      label: t(
        "profile.fields.fullName"
      ),
      value:
        user?.fullName ?? "",
      type: "text",
    },
    {
      field: "email",
      label: t(
        "profile.fields.email"
      ),
      value:
        user?.email ?? "",
      type: "email",
    },
    {
      field: "phone",
      label: t(
        "profile.fields.phone"
      ),
      value: "",
      type: "tel",
    },
    {
      field: "birthday",
      label: t(
        "profile.fields.birthday"
      ),
      value: "",
      type: "date",
    },
    {
      field: "citizenship",
      label: t(
        "profile.fields.citizenship"
      ),
      value: "",
      type: "text",
    },
    {
      field: "address",
      label: t(
        "profile.fields.address"
      ),
      value: "",
      type: "text",
    },
  ];

  const handleEdit = (
    field: (typeof personalFields)[0]
  ) => {
    setEditField(field);
    setEditValue(field.value);
  };

  const handleSave = () => {
    if (!editField) return;

    if (
      editField.field ===
      "fullName"
    ) {
      updateMutation.mutate({
        fullName: editValue,
      });

      return;
    }

    toast(
      "Це поле поки не підтримується API",
      {
        icon: "ℹ️",
      }
    );

    setEditField(null);
  };

  const handleLogout = () => {
    logout();
    localizedNavigate("");
  };

  return (
    <div className="min-h-screen bg-white text-[#111820]">
      <div className="mx-auto max-w-[1440px] px-6 pb-6 pt-10 lg:px-10 xl:px-16">
        <h1 className="mb-8 text-[30px] font-bold">
          Мій акаунт
        </h1>

        <div className="grid items-start gap-12 lg:grid-cols-[390px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="overflow-hidden rounded-[7px] border border-[#355F7D] bg-white">
            <div className="flex items-center gap-4 px-5 py-5">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[#8EA4B4] bg-[#F6F8F9]">
                <UserRound
                  size={34}
                  strokeWidth={1.4}
                  className="text-[#9AA5AD]"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[16px] font-medium text-[#222A2F]">
                  {user?.fullName ??
                    "Користувач"}
                </p>

                <p className="truncate text-[13px] text-[#616D75]">
                  {user?.email}
                </p>
              </div>
            </div>

            <nav className="pb-4">
              {menuItems.map(
                (group) => {
                  const GroupIcon =
                    group.icon;

                  return (
                    <div
                      key={group.group}
                    >
                      <div className="flex h-[44px] items-center justify-between bg-[#355F7D] px-5 text-white">
                        <span className="text-[13px] font-medium">
                          {group.group}
                        </span>

                        <GroupIcon
                          size={21}
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="px-5 py-1">
                        {group.items.map(
                          (item) => {
                            const ItemIcon =
                              item.icon;

                            const active =
                              section ===
                              item.key;

                            return (
                              <button
                                key={
                                  item.key
                                }
                                type="button"
                                onClick={() =>
                                  setSection(
                                    item.key as Section
                                  )
                                }
                                className={`flex w-full items-center gap-3 border-b px-2 py-3 text-left text-[13px] transition last:border-b-0 ${
                                  active
                                    ? "border-[#AFC0CC] font-semibold text-[#355F7D]"
                                    : "border-transparent text-[#616D75] hover:text-[#355F7D]"
                                }`}
                              >
                                <ItemIcon
                                  size={18}
                                  strokeWidth={
                                    1.5
                                  }
                                />

                                {
                                  item.label
                                }
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                }
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="mx-5 mt-2 flex items-center gap-3 px-2 py-3 text-[13px] font-medium text-[#616D75] transition hover:text-red-600"
              >
                <LogOut
                  size={19}
                  strokeWidth={1.5}
                />
                Вийти
              </button>
            </nav>
          </aside>

          {/* CONTENT */}
          <main className="min-w-0">
            {section ===
              "personal" && (
              <section className="pt-3">
                <h2 className="text-[22px] font-semibold">
                  Персональні дані
                </h2>

                <p className="mt-1 text-[13px] text-[#858F96]">
                  Керуйте вашою особистою
                  інформацією, контактами
                  та статусом
                  підтвердження профілю.
                </p>

                <div className="mt-8 grid gap-9 md:grid-cols-[170px_minmax(0,1fr)] md:items-start">
                  <div className="flex flex-col items-center">
                    <div className="flex h-[118px] w-[118px] items-center justify-center rounded-full border border-[#355F7D]">
                      <UserRound
                        size={82}
                        strokeWidth={0.9}
                        className="text-[#B7B9BC]"
                      />
                    </div>

                    <button
                      type="button"
                      className="-mt-2 rounded-[5px] bg-[#355F7D] px-4 py-2 text-[12px] font-medium text-white"
                    >
                      Змінити
                    </button>
                  </div>

                  <div className="pt-5">
                    <div className="flex items-center justify-between border-b border-[#D2D8DC] pb-3">
                      <span className="text-[14px] font-medium">
                        Верифікація
                        особи:
                      </span>

                      <span className="text-[14px] text-[#AFB6BB]">
                        Не верифіковано
                      </span>
                    </div>

                    <button
                      type="button"
                      className="mt-5 h-[48px] w-full rounded-[5px] bg-[#355F7D] text-[13px] font-semibold text-white transition hover:bg-[#2E536D]"
                    >
                      Розпочати
                      верифікацію особи
                    </button>
                  </div>
                </div>

                <div className="mt-11 max-w-[760px]">
                  {personalFields.map(
                    (field) => (
                      <div
                        key={
                          field.field
                        }
                        className="grid min-h-[58px] grid-cols-[220px_minmax(0,1fr)] items-center border-b border-[#D2D8DC]"
                      >
                        <div className="text-[14px] font-medium text-[#222A2F]">
                          {field.label}:
                        </div>

                        {editField?.field ===
                        field.field ? (
                          <div className="flex items-center gap-2 py-2">
                            <input
                              type={
                                field.type
                              }
                              value={
                                editValue
                              }
                              onChange={(
                                event
                              ) =>
                                setEditValue(
                                  event.target
                                    .value
                                )
                              }
                              autoFocus
                              className="h-[38px] min-w-0 flex-1 border-b border-[#355F7D] bg-transparent px-2 text-[14px] outline-none"
                            />

                            <button
                              type="button"
                              onClick={
                                handleSave
                              }
                              disabled={
                                updateMutation.isPending
                              }
                              className="rounded-[4px] bg-[#355F7D] px-3 py-2 text-[12px] text-white disabled:opacity-50"
                            >
                              Зберегти
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setEditField(
                                  null
                                )
                              }
                              className="px-2 py-2 text-[12px] text-[#616D75]"
                            >
                              Скасувати
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                field
                              )
                            }
                            className="text-left text-[14px] text-[#89949C] transition hover:text-[#355F7D]"
                          >
                            {field.value ||
                              field.label}
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {section ===
              "security" && (
              <section className="pt-3">
                <h2 className="text-[22px] font-semibold">
                  Налаштування безпеки
                </h2>

                <p className="mt-1 text-[13px] text-[#858F96]">
                  Змінити пароль або
                  налаштування входу.
                </p>

                <form
                  onSubmit={pwForm.handleSubmit(
                    (data) => {
                      if (
                        data.newPassword !==
                        data.confirmPassword
                      ) {
                        toast.error(
                          "Паролі не співпадають"
                        );

                        return;
                      }

                      changePasswordMutation.mutate(
                        data
                      );
                    }
                  )}
                  className="mt-8 max-w-[620px] space-y-5"
                >
                  {[
                    {
                      label:
                        "Поточний пароль",
                      field:
                        "currentPassword" as const,
                    },
                    {
                      label:
                        "Новий пароль",
                      field:
                        "newPassword" as const,
                    },
                    {
                      label:
                        "Підтвердіть пароль",
                      field:
                        "confirmPassword" as const,
                    },
                  ].map(
                    (item) => (
                      <label
                        key={
                          item.field
                        }
                        className="block"
                      >
                        <span className="mb-2 block text-[13px] font-medium">
                          {item.label}
                        </span>

                        <input
                          type="password"
                          {...pwForm.register(
                            item.field,
                            {
                              required:
                                true,
                            }
                          )}
                          className="h-[46px] w-full rounded-[5px] border border-[#C6D0D6] px-4 outline-none focus:border-[#355F7D]"
                        />
                      </label>
                    )
                  )}

                  <button
                    type="submit"
                    disabled={
                      changePasswordMutation.isPending
                    }
                    className="h-[48px] w-full rounded-[5px] bg-[#355F7D] text-[13px] font-semibold text-white disabled:opacity-50"
                  >
                    {changePasswordMutation.isPending
                      ? "Збереження..."
                      : "Змінити пароль"}
                  </button>
                </form>
              </section>
            )}

            {section ===
              "transactions" && (
              <section className="pt-3">
                <h2 className="text-[22px] font-semibold">
                  Історія транзакцій
                </h2>

                <p className="mt-1 text-[13px] text-[#858F96]">
                  Всі ваші платежі та
                  повернення коштів.
                </p>

                {loadingPayments && (
                  <div className="mt-7 space-y-3">
                    {Array.from({
                      length: 3,
                    }).map(
                      (_, index) => (
                        <div
                          key={
                            index
                          }
                          className="h-16 animate-pulse bg-slate-100"
                        />
                      )
                    )}
                  </div>
                )}

                {payments?.length ===
                  0 && (
                  <div className="mt-8 border-t border-[#D2D8DC] py-12 text-center text-[#8A949B]">
                    Транзакцій ще немає
                  </div>
                )}

                {payments &&
                  payments.length >
                    0 && (
                    <div className="mt-7 divide-y divide-[#D2D8DC]">
                      {payments.map(
                        (payment: any) => (
                          <div
                            key={
                              payment.id
                            }
                            className="flex items-center justify-between py-4"
                          >
                            <div>
                              <p className="font-mono text-[13px] font-medium">
                                {
                                  payment.transactionId
                                }
                              </p>

                              <p className="mt-1 text-[12px] text-[#8A949B]">
                                {new Date(
                                  payment.createdAt
                                ).toLocaleDateString(
                                  "uk"
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <span
                                className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                                  PaymentStatusColor[
                                    payment.status as PaymentStatus
                                  ]
                                }`}
                              >
                                {
                                  PaymentStatusLabel[
                                    payment.status as PaymentStatus
                                  ]
                                }
                              </span>

                              <strong className="text-[14px]">
                                {payment.amount?.toLocaleString()}{" "}
                                ₴
                              </strong>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </section>
            )}

            {section ===
              "payment" && (
              <section className="pt-3">
                <h2 className="text-[22px] font-semibold">
                  Мої бронювання
                </h2>

                <p className="mt-1 text-[13px] text-[#858F96]">
                  Всі ваші активні та
                  минулі бронювання.
                </p>

                {bookings?.length ===
                  0 && (
                  <div className="mt-8 border-t border-[#D2D8DC] py-12 text-center text-[#8A949B]">
                    Бронювань ще немає
                  </div>
                )}

                {bookings &&
                  bookings.length >
                    0 && (
                    <div className="mt-7 divide-y divide-[#D2D8DC]">
                      {bookings.map(
                        (
                          booking: any
                        ) => (
                          <div
                            key={
                              booking.id
                            }
                            className="flex items-start justify-between py-4"
                          >
                            <div>
                              <p className="font-semibold">
                                {
                                  booking.housingTitle
                                }
                              </p>

                              <p className="mt-1 text-[13px] text-[#616D75]">
                                {new Date(
                                  booking.checkIn
                                ).toLocaleDateString(
                                  "uk"
                                )}{" "}
                                →{" "}
                                {new Date(
                                  booking.checkOut
                                ).toLocaleDateString(
                                  "uk"
                                )}
                              </p>

                              <p className="mt-1 text-[13px] text-[#616D75]">
                                {
                                  booking.guestsCount
                                }{" "}
                                гостей
                              </p>
                            </div>

                            <strong>
                              {booking.totalPrice?.toLocaleString()}{" "}
                              ₴
                            </strong>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </section>
            )}

            {[
              "travelers",
              "notifications",
              "privacy",
              "support",
              "complaint",
              "requests",
            ].includes(
              section
            ) && (
              <section className="pt-3">
                <h2 className="text-[22px] font-semibold">
                  Розділ у розробці
                </h2>

                <p className="mt-2 text-[13px] text-[#858F96]">
                  Цей функціонал буде
                  доступний незабаром.
                </p>
              </section>
            )}
          </main>
        </div>

        {/* COMPACT DESIGN FOOTER */}
        <footer className="mt-20 border-t border-[#355F7D] pb-2 pt-5 text-center text-[9px] leading-[1.5] text-[#355F7D]">
          <p>
            Всі матеріали тут ©
            2005–2026 WayGo Company
            Pte. Ltd. Усі права
            захищені.
          </p>

          <p>
            WayGo є частиною Booking
            Holdings Inc., світового
            лідера у сфері онлайн-подорожей
            та пов’язаних послуг.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ProfilePage;
