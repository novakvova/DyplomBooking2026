import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

interface DiscountOptionProps {
  percent: number;
  defaultPercent: number;
  title: string;
  description: string;
  onChange: (percent: number) => void;
}

const DiscountOption = ({
  percent,
  defaultPercent,
  title,
  description,
  onChange,
}: DiscountOptionProps) => {
  const enabled = percent > 0;

  const handleToggle = () => {
    onChange(enabled ? 0 : defaultPercent);
  };

  const handlePercentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();

    const value = Number(event.target.value);

    if (!Number.isFinite(value)) return;

    // Не дозволяємо знижку більше 90%.
    onChange(Math.min(Math.max(value, 1), 90));
  };

  return (
    <div
      className={`flex min-h-[92px] w-full items-center gap-5 rounded-[10px] border px-4 py-3 transition ${
        enabled
          ? "border-[#8D9AA3] bg-white"
          : "border-[#A8B0B5] bg-white"
      }`}
    >
      <div
        className={`flex h-[46px] w-[78px] shrink-0 items-center rounded-[8px] border transition ${
          enabled
            ? "border-[#7695A5] bg-[#EAF4F4]"
            : "border-[#B5BEC4] bg-[#F4F6F7]"
        }`}
      >
        {enabled ? (
          <div className="relative flex h-full w-full items-center">
            <div className="flex flex-1 items-center justify-center pl-2">
                <input
                type="number"
                min={1}
                max={90}
                value={percent}
                onChange={handlePercentChange}
                className="w-[30px] appearance-none bg-transparent text-right text-[20px] font-semibold text-black outline-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none"
                aria-label={`Відсоток: ${title}`}
                />

                <span className="text-[20px] font-semibold text-black">
                %
                </span>
            </div>

            <div className="mr-2 flex flex-col">
                <button
                type="button"
                onClick={() => onChange(Math.min(percent + 1, 90))}
                className="flex h-[14px] w-[14px] items-center justify-center text-[9px] leading-none text-[#7D8790] hover:text-black"
                aria-label="Збільшити знижку"
                >
                ▲
                </button>

                <button
                type="button"
                onClick={() => onChange(Math.max(percent - 1, 1))}
                className="flex h-[14px] w-[14px] items-center justify-center text-[9px] leading-none text-[#7D8790] hover:text-black"
                aria-label="Зменшити знижку"
                >
                ▼
                </button>
            </div>
          </div>
        ) : (
          <span className="text-[20px] font-semibold text-[#7D8790]">
            {defaultPercent}%
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className="flex min-w-0 flex-1 items-center text-left"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-medium leading-tight text-black">
            {title}
          </h2>

          <p className="mt-1 text-[12px] leading-[1.35] text-[#616D75]">
            {description}
          </p>
        </div>

        <div
          className={`relative ml-5 h-[32px] w-[58px] shrink-0 rounded-full transition ${
            enabled ? "bg-[#355F78]" : "bg-[#BDD0DB]"
          }`}
        >
          <span
            className={`absolute top-[4px] h-[24px] w-[24px] rounded-full transition-all ${
              enabled
                ? "left-[30px] bg-[#163D55]"
                : "left-[4px] bg-[#7895A6]"
            }`}
          />
        </div>
      </button>
    </div>
  );
};

const Step18Discounts = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const handleBack = () => {
    navigate("/housing/register/price");
  };

  const handleNext = () => {
    navigate("/housing/register/safety");
  };

  return (
    <HousingRegistrationLayout
      step={3}
      progress={50}
      onBack={handleBack}
      onNext={handleNext}
    >
      <section className="w-full max-w-[700px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Знижки за тривале проживання
        </h1>

        <p className="mt-2 text-[16px] leading-[1.5] text-[#616D75]">
          Налаштуйте спеціальні ціни для бронювань від 7 та 28 днів.
        </p>

        <div className="mt-8 space-y-4">
          <DiscountOption
            percent={data.weeklyDiscountPercent}
            defaultPercent={10}
            title="Знижка за тиждень"
            description="Застосовується до бронювань від 7 ночей"
            onChange={(weeklyDiscountPercent) =>
              updateData({ weeklyDiscountPercent })
            }
          />

          <DiscountOption
            percent={data.monthlyDiscountPercent}
            defaultPercent={20}
            title="Знижка за місяць"
            description="Застосовується до бронювань від 28 ночей (4 тижні)"
            onChange={(monthlyDiscountPercent) =>
              updateData({ monthlyDiscountPercent })
            }
          />

          <DiscountOption
            percent={data.shortStayDiscountPercent}
            defaultPercent={5}
            title="Знижка від 3–5 днів (Опціонально)"
            description="Для середньострокових заїздів на вихідні чи робочий тиждень"
            onChange={(shortStayDiscountPercent) =>
              updateData({ shortStayDiscountPercent })
            }
          />
        </div>

        <p className="mt-4 text-[12px] text-[#7D8790]">
          Ви можете встановити знижку від 1% до 90%.
        </p>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step18Discounts;