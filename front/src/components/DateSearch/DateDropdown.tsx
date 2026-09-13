import { forwardRef, useMemo, useState } from "react";
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

const DateDropdown = forwardRef<HTMLDivElement, Props>(
(
  {
    checkIn,
    checkOut,
    onCheckInChange,
    onCheckOutChange,
    onClose,
  },
  ref
) => {
  const { t, i18n } = useTranslation();

  const [tab, setTab] = useState<Tab>("calendar");
  const [duration, setDuration] = useState<Duration>("weekend");
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [flexibleOffset, setFlexibleOffset] = useState(0);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const formatValue = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

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

  const handleDateSelect = (date: Date) => {
    if (isBeforeToday(date)) return;

    const value = formatValue(date);
    const start = parseValue(checkIn);

    if (!start || checkOut) {
      onCheckInChange(value);
      onCheckOutChange("");
      return;
    }

    if (date < start) {
      onCheckInChange(value);
      onCheckOutChange("");
      return;
    }

    if (sameDate(date, start)) return;

    onCheckOutChange(value);
  };


  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const monthName = new Intl.DateTimeFormat(i18n.language, {
      month: "long",
      year: "numeric",
    }).format(monthDate);

    const daysCount = new Date(year, month + 1, 0).getDate();

    const firstWeekDay =
      (new Date(year, month, 1).getDay() + 6) % 7;

    const cells = [
      ...Array(firstWeekDay).fill(null),
      ...Array.from(
        { length: daysCount },
        (_, index) => new Date(year, month, index + 1)
      ),
    ];

    return (
      <div className="flex-1">
        <h3 className="mb-3 text-lg font-bold">
          {monthName}
        </h3>

        <div className="grid grid-cols-7">
          {cells.map((date, index) =>
            !date ? (
              <div key={index} className="h-12" />
            ) : (
              <button
                key={date.toISOString()}
                type="button"
                disabled={isBeforeToday(date)}
                onClick={() => handleDateSelect(date)}
                className={`
                  h-12 w-12 rounded-lg
                  ${
                    parseValue(checkIn) &&
                    sameDate(date, parseValue(checkIn)!)
                      ? "bg-[#355872] text-white"
                      : "hover:bg-slate-100"
                  }
                  ${
                    isBetween(date)
                      ? "bg-[#768D9F]/20"
                      : ""
                  }
                `}
              >
                {date.getDate()}
              </button>
            )
          )}
        </div>
      </div>
    );
  };


  return (
    <div
      ref={ref}
      className="
        absolute left-1/2 top-full z-[3000]
        mt-3 -translate-x-1/2
        w-[1018px]
        rounded-2xl
        bg-white
        p-5
        shadow-xl
      "
    >
      <div className="mx-auto mb-6 flex h-[60px] max-w-[626px] rounded-xl bg-[#355872] p-1">
        <button
          type="button"
          onClick={() => setTab("calendar")}
          className={`flex-1 rounded-lg text-white ${
            tab === "calendar" ? "bg-[#768D9F]" : ""
          }`}
        >
          {t("datePicker.calendar")}
        </button>

        <button
          type="button"
          onClick={() => setTab("flexible")}
          className={`flex-1 rounded-lg text-white ${
            tab === "flexible" ? "bg-[#768D9F]" : ""
          }`}
        >
          {t("datePicker.flexible")}
        </button>
      </div>


      {tab === "calendar" && (
        <>
          <div className="grid grid-cols-2 gap-10">
            {renderMonth(firstMonth)}
            {renderMonth(secondMonth)}
          </div>

          <div className="mt-5 flex justify-between">
            <button
              onClick={() =>
                setCalendarOffset((v) => Math.max(0, v - 1))
              }
            >
              ‹
            </button>

            <button onClick={onClose}>
              {t("datePicker.select")}
            </button>

            <button
              onClick={() =>
                setCalendarOffset((v) => v + 1)
              }
            >
              ›
            </button>
          </div>
        </>
      )}
    </div>
  );
});


DateDropdown.displayName = "DateDropdown";

export default DateDropdown;