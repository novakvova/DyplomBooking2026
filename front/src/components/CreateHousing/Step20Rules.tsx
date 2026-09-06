import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
import {
  Cigarette,
  Clock3,
  Edit3,
  House,
  MoonStar,
  PawPrint,
  PartyPopper,
} from "lucide-react";

type BinaryRule = "forbidden" | "allowed";
type EarlyCheckInOption = "none" | "subject_to_availability" | "allowed";

const timeOptions = Array.from({ length: 24 }, (_, hour) => {
  const value = `${hour.toString().padStart(2, "0")}:00`;
  return { value, label: value };
});

interface RadioOptionProps {
  checked: boolean;
  label: string;
  onClick: () => void;
}

const RadioOption = ({ checked, label, onClick }: RadioOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2 whitespace-nowrap text-[14px] text-black"
  >
    <span
      className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border ${
        checked ? "border-[#243C4E]" : "border-[#7D8790]"
      }`}
    >
      {checked && <span className="h-[7px] w-[7px] rounded-full bg-[#243C4E]" />}
    </span>
    {label}
  </button>
);

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  prefix?: string;
}

const TimeSelect = ({
  value,
  onChange,
  disabled = false,
  prefix,
}: TimeSelectProps) => (
  <label
    className={`flex h-[38px] items-center gap-1 rounded-[7px] border px-3 ${
      disabled
        ? "border-[#D9DDE0] bg-[#FAFAFA] text-[#B5BEC4]"
        : "border-[#A8B0B5] bg-white text-black"
    }`}
  >
    {prefix && (
      <span className="shrink-0 text-[12px] text-[#616D75]">{prefix}</span>
    )}

    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-[68px] bg-transparent text-[13px] outline-none disabled:text-[#B5BEC4]"
    >
      {timeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const Step20Rules = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const rentalFormat =
    data.rentalFormat === "daily" ||
    data.rentalFormat === "hourly" ||
    data.rentalFormat === "flexible"
      ? data.rentalFormat
      : "daily";

  const isDaily = rentalFormat === "daily";
  const isHourly = rentalFormat === "hourly";
  const isFlexible = rentalFormat === "flexible";

  const showDailyRules = isDaily || isFlexible;
  const showHourlyRules = isHourly || isFlexible;
  const quietHoursEnabled = data.quietHoursMode === "enabled";

  const updateBinaryRule = (
    key: "smokingRule" | "petsRule" | "partiesRule",
    value: BinaryRule
  ) => {
    updateData({ [key]: value });
  };

  const handleBack = () => {
    navigate("/housing/register/safety");
  };

  const handleNext = () => {
    navigate("/housing/register/calendar");
  };

  return (
    <HousingRegistrationLayout
      step={3}
      progress={85}
      onBack={handleBack}
      onNext={handleNext}
    >
      <section className="w-full max-w-[700px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Встановіть правила дому
        </h1>

        <p className="mt-2 max-w-[600px] text-[16px] leading-[1.5] text-[#616D75]">
          Гості мають погодитися з цими правилами перед тим, як зробити
          бронювання.
        </p>

        <div className="mt-6">
          {showDailyRules && (
            <div className="grid min-h-[64px] grid-cols-[1fr_auto] items-center gap-5 border-b border-[#D9DDE0]">
              <div className="flex items-center gap-3">
                <Clock3 size={19} strokeWidth={1.7} className="text-[#243C4E]" />
                <span className="text-[16px] text-black">
                  Час заїзду та виїзду
                </span>
              </div>

              <div className="flex items-center gap-3">
                <TimeSelect
                  prefix="Заїзд:"
                  value={data.checkInTime}
                  onChange={(checkInTime) => updateData({ checkInTime })}
                />

                <TimeSelect
                  prefix="Виїзд:"
                  value={data.checkOutTime}
                  onChange={(checkOutTime) => updateData({ checkOutTime })}
                />
              </div>
            </div>
          )}

          {showDailyRules && (
            <div className="grid min-h-[64px] grid-cols-[1fr_260px] items-center gap-5 border-b border-[#D9DDE0]">
              <div className="flex items-center gap-3">
                <House size={19} strokeWidth={1.7} className="text-[#243C4E]" />
                <span className="text-[16px] text-black">
                  Можливість раннього заїзду
                </span>
              </div>

              <select
                value={data.earlyCheckIn}
                onChange={(e) =>
                  updateData({
                    earlyCheckIn: e.target.value as EarlyCheckInOption,
                  })
                }
                className="h-[38px] rounded-[7px] border border-[#A8B0B5] bg-white px-3 text-[13px] text-black outline-none"
              >
                <option value="none">Без раннього заїзду</option>
                <option value="subject_to_availability">За можливості</option>
                <option value="allowed">Дозволено</option>
              </select>
            </div>
          )}

          {showHourlyRules && (
            <div className="grid min-h-[64px] grid-cols-[1fr_auto] items-center gap-5 border-b border-[#D9DDE0]">
              <div className="flex items-center gap-3">
                <Clock3 size={19} strokeWidth={1.7} className="text-[#243C4E]" />
                <span className="text-[16px] text-black">Час заїзду</span>
              </div>

              <div className="flex items-center gap-3">
                <TimeSelect
                  prefix="З:"
                  value={data.hourlyStartTime}
                  onChange={(hourlyStartTime) =>
                    updateData({ hourlyStartTime })
                  }
                />

                <TimeSelect
                  prefix="До:"
                  value={data.hourlyEndTime}
                  onChange={(hourlyEndTime) => updateData({ hourlyEndTime })}
                />
              </div>
            </div>
          )}

          <div className="grid min-h-[64px] grid-cols-[1fr_auto] items-center gap-5 border-b border-[#D9DDE0]">
            <div className="flex items-center gap-3">
              <Cigarette size={19} strokeWidth={1.7} className="text-[#243C4E]" />
              <span className="text-[16px] text-black">Куріння та вейпінг</span>
            </div>

            <div className="flex items-center gap-5">
              <RadioOption
                checked={data.smokingRule === "forbidden"}
                label="Заборонено"
                onClick={() => updateBinaryRule("smokingRule", "forbidden")}
              />
              <RadioOption
                checked={data.smokingRule === "allowed"}
                label="Дозволено"
                onClick={() => updateBinaryRule("smokingRule", "allowed")}
              />
            </div>
          </div>

          <div className="grid min-h-[64px] grid-cols-[1fr_auto] items-center gap-5 border-b border-[#D9DDE0]">
            <div className="flex items-center gap-3">
              <PawPrint size={19} strokeWidth={1.7} className="text-[#243C4E]" />
              <span className="text-[16px] text-black">
                Проживання з тваринами
              </span>
            </div>

            <div className="flex items-center gap-5">
              <RadioOption
                checked={data.petsRule === "forbidden"}
                label="Заборонено"
                onClick={() => updateBinaryRule("petsRule", "forbidden")}
              />
              <RadioOption
                checked={data.petsRule === "allowed"}
                label="Дозволено"
                onClick={() => updateBinaryRule("petsRule", "allowed")}
              />
            </div>
          </div>

          <div className="grid min-h-[70px] grid-cols-[1fr_auto] items-center gap-5 border-b border-[#D9DDE0]">
            <div className="flex items-center gap-3">
              <MoonStar size={19} strokeWidth={1.7} className="text-[#243C4E]" />
              <span className="text-[16px] text-black">Дотримання тиші</span>
            </div>

            <div className="flex items-center gap-3">
              <RadioOption
                checked={quietHoursEnabled}
                label="Увімкнути тихі години"
                onClick={() =>
                  updateData({
                    quietHoursMode: quietHoursEnabled ? "disabled" : "enabled",
                  })
                }
              />

              <TimeSelect
                value={data.quietHoursFrom}
                disabled={!quietHoursEnabled}
                onChange={(quietHoursFrom) => updateData({ quietHoursFrom })}
              />

              <span className="text-[13px] text-[#616D75]">—</span>

              <TimeSelect
                value={data.quietHoursTo}
                disabled={!quietHoursEnabled}
                onChange={(quietHoursTo) => updateData({ quietHoursTo })}
              />
            </div>
          </div>

          <div className="grid min-h-[64px] grid-cols-[1fr_auto] items-center gap-5 border-b border-[#D9DDE0]">
            <div className="flex items-center gap-3">
              <PartyPopper size={19} strokeWidth={1.7} className="text-[#243C4E]" />
              <span className="text-[16px] text-black">Заходи та вечірки</span>
            </div>

            <div className="flex items-center gap-5">
              <RadioOption
                checked={data.partiesRule === "forbidden"}
                label="Заборонено"
                onClick={() => updateBinaryRule("partiesRule", "forbidden")}
              />
              <RadioOption
                checked={data.partiesRule === "allowed"}
                label="Дозволено"
                onClick={() => updateBinaryRule("partiesRule", "allowed")}
              />
            </div>
          </div>

          <div className="pt-4">
            <div className="mb-2 flex items-center gap-3">
              <Edit3 size={18} strokeWidth={1.7} className="text-[#243C4E]" />
              <span className="text-[16px] text-black">Додаткові правила</span>
            </div>

            <textarea
              value={data.additionalRules}
              onChange={(e) =>
                updateData({
                  additionalRules: e.target.value.slice(0, 500),
                })
              }
              rows={4}
              maxLength={500}
              placeholder="Додаткові правила"
              className="min-h-[115px] w-full resize-none rounded-[8px] border border-[#A8B0B5] px-4 py-3 text-[15px] text-black outline-none transition placeholder:text-[#B5BEC4] focus:border-[#243C4E] focus:ring-1 focus:ring-[#243C4E]"
            />
          </div>
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step20Rules;
