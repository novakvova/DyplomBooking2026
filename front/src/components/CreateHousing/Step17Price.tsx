import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
import { useCurrency } from "../../hooks/useCurrency";

const SERVICE_FEE_PERCENT = 16;

interface PriceInputProps {
  label: string;
  value: number;
  currencySymbol: string;
  currencyCode: string;
  onChange: (value: number) => void;
}

const PriceInput = ({
  label,
  value,
  currencySymbol,
  currencyCode,
  onChange,
}: PriceInputProps) => {
  return (
    <label className="block rounded-[10px] border border-[#8D9AA3] bg-white px-5 py-4 transition focus-within:border-[#243C4E] focus-within:ring-1 focus-within:ring-[#243C4E]">
      <span className="text-[12px] font-normal text-[#616D75]">{label}</span>

      <div className="mt-1 flex items-center gap-1">
        <span className="shrink-0 text-[28px] font-medium text-black">
          {currencySymbol}
        </span>

        <input
          type="number"
          min={0}
          step="0.01"
          value={Number.isFinite(value) && value > 0 ? value : ""}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "") {
              onChange(0);
              return;
            }

            const nextValue = Number(value);
            onChange(Number.isFinite(nextValue) ? Math.max(0, nextValue) : 0);
          }}
          className="min-w-0 flex-1 bg-transparent text-[28px] font-medium text-black outline-none"
          aria-label={`${label}, ${currencyCode}`}
        />
      </div>
    </label>
  );
};

const calculateFee = (price: number) =>
  price * (SERVICE_FEE_PERCENT / 100);

const calculateIncome = (price: number) =>
  price - calculateFee(price);

const Step17Price = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const {
    currencyCode,
    currencySymbol,
    convert,
    toBaseCurrency,
  } = useCurrency();

  /*
    Якщо в sessionStorage залишилося старе/некоректне значення rentalFormat,
    сторінка все одно покаже добову ціну замість порожнього екрану.
  */
  const rentalFormat =
    data.rentalFormat === "hourly" ||
    data.rentalFormat === "flexible" ||
    data.rentalFormat === "daily"
      ? data.rentalFormat
      : "daily";

  const isDaily = rentalFormat === "daily";
  const isHourly = rentalFormat === "hourly";
  const isFlexible = rentalFormat === "flexible";

  const nightPrice = Number(data.pricePerNight) || 0;
  const hourPrice = Number(data.pricePerHour) || 0;

  const displayNightPrice = convert(nightPrice);
  const displayHourPrice = convert(hourPrice);

  const nightlyFee = convert(calculateFee(nightPrice));
  const hourlyFee = convert(calculateFee(hourPrice));

  const nightlyIncome = convert(calculateIncome(nightPrice));
  const hourlyIncome = convert(calculateIncome(hourPrice));

  const isValid =
    (isDaily && nightPrice > 0) ||
    (isHourly && hourPrice > 0) ||
    (isFlexible && nightPrice > 0 && hourPrice > 0);

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("uk-UA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);

  const handleBack = () => {
    navigate("/housing/register/booking-mode");
  };

  const handleNext = () => {
    if (!isValid) return;
    navigate("/housing/register/discounts");
  };

  return (
    <HousingRegistrationLayout
      step={3}
      progress={30}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!isValid}
    >
      <section className="w-full max-w-[700px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          {isDaily
            ? "Встановіть ціну за ніч"
            : isHourly
              ? "Встановіть ціну за годину"
              : "Встановіть ціну"}
        </h1>

        <p className="mt-2 max-w-[620px] text-[16px] font-normal leading-[1.5] text-[#616D75]">
          Ви зможете змінити її або додавати знижки та ціни на вихідні будь-коли
          в налаштуваннях.
        </p>

        <div
          className={`mt-8 grid gap-4 ${
            isFlexible ? "sm:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {(isDaily || isFlexible) && (
            <PriceInput
              label="Базова ціна за ніч"
              value={displayNightPrice}
              currencySymbol={currencySymbol}
              currencyCode={currencyCode}
              onChange={(value) =>
                updateData({
                  pricePerNight: toBaseCurrency(value),
                })
              }
            />
          )}

          {(isHourly || isFlexible) && (
            <PriceInput
              label="Базова ціна за годину"
              value={displayHourPrice}
              currencySymbol={currencySymbol}
              currencyCode={currencyCode}
              onChange={(value) =>
                updateData({
                  pricePerHour: toBaseCurrency(value),
                })
              }
            />
          )}
        </div>

        <div className="mt-10">
          {isFlexible && (
            <div className="mb-2 grid grid-cols-[1fr_110px_110px] text-[12px] text-[#616D75]">
              <span />
              <span className="text-right">Подобово</span>
              <span className="text-right">Погодинно</span>
            </div>
          )}

          <div
            className={`grid items-center border-b border-[#D9DDE0] py-2 text-[14px] ${
              isFlexible
                ? "grid-cols-[1fr_110px_110px]"
                : "grid-cols-[1fr_130px]"
            }`}
          >
            <span className="pr-3 text-black">
              Ціна для гостя до вирахування податків:
            </span>

            {(isDaily || isFlexible) && (
              <span className="text-right text-black">
                {currencySymbol}
                {formatAmount(displayNightPrice)}
              </span>
            )}

            {(isHourly || isFlexible) && (
              <span className="text-right text-black">
                {currencySymbol}
                {formatAmount(displayHourPrice)}
              </span>
            )}
          </div>

          <div
            className={`grid items-center border-b border-[#D9DDE0] py-2 text-[14px] ${
              isFlexible
                ? "grid-cols-[1fr_110px_110px]"
                : "grid-cols-[1fr_130px]"
            }`}
          >
            <span className="pr-3 text-black">
              Сервісний збір із господаря ({SERVICE_FEE_PERCENT}%):
            </span>

            {(isDaily || isFlexible) && (
              <span className="text-right text-black">
                {currencySymbol}
                {formatAmount(nightlyFee)}
              </span>
            )}

            {(isHourly || isFlexible) && (
              <span className="text-right text-black">
                {currencySymbol}
                {formatAmount(hourlyFee)}
              </span>
            )}
          </div>

          <div
            className={`grid items-center py-3 text-[15px] font-medium ${
              isFlexible
                ? "grid-cols-[1fr_110px_110px]"
                : "grid-cols-[1fr_130px]"
            }`}
          >
            <span className="pr-3 text-black">Ви отримаєте:</span>

            {(isDaily || isFlexible) && (
              <span className="text-right text-black">
                {currencySymbol}
                {formatAmount(nightlyIncome)}
              </span>
            )}

            {(isHourly || isFlexible) && (
              <span className="text-right text-black">
                {currencySymbol}
                {formatAmount(hourlyIncome)}
              </span>
            )}
          </div>

          <p className="mt-2 text-right text-[12px] text-[#7D8790]">
            Валюта: {currencyCode}
          </p>
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step17Price;
