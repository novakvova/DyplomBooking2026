import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onClose: () => void;
}

type Tab = "calendar" | "flexible";
type Duration = "weekend" | "week" | "month";

const DateDropdown = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  onClose,
}: Props) => {
  const { t, i18n } = useTranslation();

  const [tab, setTab] = useState<Tab>("calendar");
  const [duration, setDuration] = useState<Duration>("weekend");
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [flexibleOffset, setFlexibleOffset] = useState(0);

  // ─────────────────────────────────────────────
  // DATE HELPERS
  // ─────────────────────────────────────────────

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const formatValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const parseValue = (value: string) => {
    if (!value) return null;

    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
  };

  const sameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isBeforeToday = (date: Date) => date < today;

  const isBetween = (date: Date) => {
    const start = parseValue(checkIn);
    const end = parseValue(checkOut);

    return !!start && !!end && date > start && date < end;
  };

  // ─────────────────────────────────────────────
  // MONTHS
  // ─────────────────────────────────────────────

  const firstMonth = new Date(
    today.getFullYear(),
    today.getMonth() + calendarOffset,
    1
  );

  const secondMonth = new Date(
    firstMonth.getFullYear(),
    firstMonth.getMonth() + 1,
    1
  );

  const flexibleMonths = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() + flexibleOffset + index,
      1
    );

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      date,
    };
  });

  // ─────────────────────────────────────────────
  // DATE SELECT
  // ─────────────────────────────────────────────

  const handleDateSelect = (date: Date) => {
    if (isBeforeToday(date)) return;

    const value = formatValue(date);
    const start = parseValue(checkIn);

    // Перший клік або початок нового діапазону.
    if (!start || checkOut) {
      onCheckInChange(value);
      onCheckOutChange("");
      return;
    }

    // Раніша дата стає новим check-in.
    if (date < start) {
      onCheckInChange(value);
      onCheckOutChange("");
      return;
    }

    // Один день не використовуємо як діапазон.
    if (sameDate(date, start)) return;

    onCheckOutChange(value);
  };

  // ─────────────────────────────────────────────
  // MONTH RENDER
  // ─────────────────────────────────────────────

  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const monthName = new Intl.DateTimeFormat(i18n.language, {
      month: "long",
      year: "numeric",
    }).format(monthDate);

    // Monday first.
    const firstWeekDay =
      (new Date(year, month, 1).getDay() + 6) % 7;

    const daysCount = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [
      ...Array(firstWeekDay).fill(null),
      ...Array.from(
        { length: daysCount },
        (_, index) => new Date(year, month, index + 1)
      ),
    ];

    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(2026, 0, 5 + index);

      return new Intl.DateTimeFormat(i18n.language, {
        weekday: "short",
      })
        .format(date)
        .replace(".", "");
    });

    return (
      <div className="min-w-0 flex-1">
        <h3 className="
            mb-1 text-sm font-bold leading-5 text-black
            min-[1024px]:text-base
            min-[1500px]:mb-2
            min-[1500px]:text-[20px]
            min-[1500px]:leading-6
        "
        >
          {monthName}
        </h3>

        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div key={day} className="
                flex h-8 items-center justify-center
                text-xs text-black

                min-[1024px]:h-9
                min-[1024px]:text-sm

                min-[1500px]:h-12
                min-[1500px]:text-[20px]
            "
            >
              {day}
            </div>
          ))}

          {cells.map((date, index) => {
            if (!date) {
              return (
                <div key={`empty-${index}`}
                className="
                    h-8
                    min-[1024px]:h-9
                    min-[1500px]:h-12
                "
                />
              );
            }

            const start = parseValue(checkIn);
            const end = parseValue(checkOut);

            const isStart = !!start && sameDate(date, start);
            const isEnd = !!end && sameDate(date, end);
            const inRange = isBetween(date);
            const disabled = isBeforeToday(date);
            const isToday = sameDate(date, today);

            return (
              <div
                key={date.toISOString()}
                className={`
                    flex h-8 items-center justify-center
                    min-[1024px]:h-9
                    min-[1500px]:h-12
                    ${inRange ? "bg-[#768D9F]/20" : ""}
                `}
                >
                <button
                type="button"
                disabled={disabled}
                onClick={() => handleDateSelect(date)}
                className={`
                    flex h-8 w-8 items-center justify-center
                    text-xs transition

                    min-[1024px]:h-9
                    min-[1024px]:w-9
                    min-[1024px]:text-sm

                    min-[1500px]:h-12
                    min-[1500px]:w-12
                    min-[1500px]:text-[20px]

                    ${
                    isStart || isEnd
                        ? "rounded-[8px] bg-[#355872] font-semibold text-white"
                        : disabled
                        ? "cursor-not-allowed text-black/25"
                        : isToday
                            ? "rounded-[8px] border-2 border-[#355872] font-semibold"
                            : "text-black hover:rounded-[8px] hover:bg-slate-100"
                    }
                `}
                >
                {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────
  // FLEXIBLE MONTHS
  // ─────────────────────────────────────────────

  const toggleMonth = (key: string) => {
    setSelectedMonths((current) => {
      if (current.includes(key)) {
        return current.filter((item) => item !== key);
      }

      if (current.length >= 3) return current;

      return [...current, key];
    });
  };

  return (
    <div className="
        absolute left-1/2 top-full z-[3000]
        mt-3 w-[calc(100vw-24px)]
        max-w-[1018px]
        -translate-x-1/2
        rounded-[16px]
        bg-white p-3 text-black
        shadow-[8px_10px_14px_rgba(0,0,0,0.25)]

        min-[1024px]:mt-5
        min-[1024px]:w-[min(82vw,850px)]
        min-[1024px]:rounded-[20px]
        min-[1024px]:p-4

        min-[1500px]:w-[1018px]
        min-[1500px]:p-5
    "
    >
      {/* Tabs */}
      <div
        className="
            mx-auto mb-3 flex h-[42px]
            w-full max-w-[626px]
            rounded-[10px]
            bg-[#355872] p-[5px]

            min-[1024px]:mb-4
            min-[1024px]:h-[48px]

            min-[1500px]:mb-6
            min-[1500px]:h-[60px]
            min-[1500px]:p-[7px]
        "
        >
        <button
          type="button"
          onClick={() => setTab("calendar")}
          className={`flex-1 rounded-[8px] text-sm font-medium text-white transition min-[1024px]:text-base min-[1500px]:text-[20px] ${
            tab === "calendar" ? "bg-[#768D9F]" : ""
          }`}
        >
          {t("datePicker.calendar")}
        </button>

        <button
          type="button"
          onClick={() => setTab("flexible")}
          className={`flex-1 rounded-[8px] text-sm font-medium text-white transition min-[1024px]:text-base min-[1500px]:text-[20px] ${
            tab === "flexible" ? "bg-[#768D9F]" : ""
          }`}
        >
          {t("datePicker.flexible")}
        </button>
      </div>

      {/* Calendar */}
      {tab === "calendar" && (
        <>
          <div className="
              grid w-full grid-cols-1 gap-4
              min-[1024px]:grid-cols-2
              min-[1024px]:gap-6
              min-[1500px]:gap-10
          "
          >
            {renderMonth(firstMonth)}
            {renderMonth(secondMonth)}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={calendarOffset === 0}
              onClick={() =>
                setCalendarOffset((current) => Math.max(0, current - 1))
              }
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-[10px] text-[30px] leading-none transition
                hover:bg-slate-100 disabled:cursor-not-allowed
                disabled:opacity-20
                min-[1500px]:h-12 min-[1500px]:w-12 min-[1500px]:text-[36px]
              "
            >
              ‹
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={!checkIn || !checkOut}
              className="
                h-10 w-full max-w-[220px]
                rounded-[10px] bg-[#355872]
                px-5 text-sm font-semibold text-white
                transition hover:bg-[#2d4b62]
                disabled:cursor-not-allowed disabled:opacity-40

                min-[1024px]:h-12
                min-[1024px]:text-base

                min-[1500px]:h-[61px]
                min-[1500px]:max-w-[260px]
                min-[1500px]:text-[20px]
                "
            >
              {t("datePicker.select")}
            </button>

            <button
              type="button"
              onClick={() =>
                setCalendarOffset((current) => current + 1)
              }
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-[10px] text-[30px] leading-none transition
                hover:bg-slate-100
                min-[1500px]:h-12 min-[1500px]:w-12 min-[1500px]:text-[36px]
              "
            >
              ›
            </button>
          </div>
        </>
      )}

      {/* Flexible */}
      {tab === "flexible" && (
        <div className="flex flex-col">
          {/* Duration */}
          <div>
            <h3
              className="
                mb-3 text-base font-bold
                min-[1500px]:text-[20px]
              "
            >
              {t("datePicker.duration.title")}
            </h3>

            <div
              className="
                flex flex-wrap gap-2
                min-[1024px]:gap-3
                min-[1500px]:gap-5
              "
            >
              {(
                [
                  ["weekend", "datePicker.duration.weekend"],
                  ["week", "datePicker.duration.week"],
                  ["month", "datePicker.duration.month"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDuration(key)}
                  className={`
                    flex h-10 flex-1 items-center justify-center
                    rounded-[10px] border-2 px-3
                    text-sm transition

                    min-[1024px]:min-w-[120px] min-[1024px]:flex-none
                    min-[1500px]:h-[49px] min-[1500px]:min-w-[145px]
                    min-[1500px]:px-[22px] min-[1500px]:text-[20px]

                    ${
                      duration === key
                        ? "border-[#355872]"
                        : "border-black"
                    }
                  `}
                >
                  {t(label)}
                </button>
              ))}
            </div>
          </div>

          {/* Months */}
          <div className="mt-5">
            <h3 className="text-base font-bold min-[1500px]:text-[20px]">
              {t("datePicker.months.title")}
            </h3>

            <p
              className="
                mt-1 text-sm font-medium text-[#4C4C4C]
                min-[1500px]:text-[16px]
              "
            >
              {t("datePicker.months.description")}
            </p>

            <div
              className="
                mt-3 grid grid-cols-2 gap-2
                sm:grid-cols-3
                min-[1024px]:flex min-[1024px]:items-center min-[1024px]:gap-[6px]
              "
            >
              {flexibleMonths.map(({ key, date }) => {
                const selected = selectedMonths.includes(key);

                const month = new Intl.DateTimeFormat(i18n.language, {
                  month: "short",
                })
                  .format(date)
                  .replace(".", "");

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleMonth(key)}
                    className={`
                      flex h-[96px] w-full
                      flex-col items-center justify-center
                      gap-1 rounded-[10px]
                      bg-[#768D9F] transition

                      min-[1024px]:h-[110px]
                      min-[1024px]:w-[105px]

                      min-[1500px]:h-[146px]
                      min-[1500px]:w-[133px]
                      min-[1500px]:gap-[10px]

                      ${
                        selected
                          ? "ring-2 ring-[#355872] ring-offset-2"
                          : ""
                      }
                    `}
                  >
                    <svg
                      className="
                        h-7 w-7
                        min-[1500px]:h-[32px] min-[1500px]:w-[32px]
                      "
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M7 3v4M17 3v4M3 10h18" />
                    </svg>

                    <span className="text-sm min-[1500px]:text-[16px]">
                      {month}
                    </span>

                    <span className="text-sm min-[1500px]:text-[16px]">
                      {date.getFullYear()}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setFlexibleOffset((current) => current + 6)
                }
                aria-label={t("datePicker.nextMonths")}
                className="
                  col-span-2 flex h-10 items-center justify-center
                  text-[36px] leading-none transition hover:scale-105
                  sm:col-span-3

                  min-[1024px]:ml-1 min-[1024px]:h-[45px]
                  min-[1024px]:w-[45px] min-[1024px]:shrink-0

                  min-[1500px]:ml-2 min-[1500px]:h-[53px]
                  min-[1500px]:w-[53px] min-[1500px]:text-[46px]
                "
              >
                ›
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={selectedMonths.length === 0}
              className="
                mt-4 flex h-12 w-full items-center justify-center
                rounded-[10px] bg-[#355872]
                text-base font-semibold text-white
                transition hover:bg-[#2d4b62]
                disabled:cursor-not-allowed disabled:opacity-40

                min-[1500px]:mt-[18px]
                min-[1500px]:h-[61px]
                min-[1500px]:text-[20px]
              "
            >
              {t("datePicker.select")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateDropdown;