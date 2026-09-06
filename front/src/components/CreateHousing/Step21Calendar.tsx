import { Minus, Plus } from "lucide-react";

import HousingRegistrationLayout from "./HousingRegistrationLayout";
import {
  type PreparationTime,
  useHousingRegistration,
} from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

interface RadioCardProps {
  checked: boolean;
  title: string;
  description: string;
  onClick: () => void;
}

const RadioCard = ({
  checked,
  title,
  description,
  onClick,
}: RadioCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-4 rounded-[8px] border px-4 py-3 text-left transition ${
      checked
        ? "border-[#243C4E] bg-[#F7FAFC]"
        : "border-[#A8B0B5] bg-white hover:border-[#243C4E]"
    }`}
  >
    <span
      className={`flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border ${
        checked ? "border-[#243C4E]" : "border-[#7D8790]"
      }`}
    >
      {checked && (
        <span className="h-[8px] w-[8px] rounded-full bg-[#243C4E]" />
      )}
    </span>

    <div>
      <p className="text-[15px] font-medium text-black">
        {title}
      </p>

      <p className="mt-1 text-[11px] leading-[1.35] text-[#7D8790]">
        {description}
      </p>
    </div>
  </button>
);

const Step21Calendar = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const updateMinimumStay = (delta: number) => {
    updateData({
      minimumStay: Math.max(
        1,
        Math.min(365, data.minimumStay + delta)
      ),
    });
  };

  const handlePreparationTime = (
    preparationTime: PreparationTime
  ) => {
    updateData({ preparationTime });
  };

  const handleBack = () => {
    navigate("/housing/register/rules");
  };

  const handleNext = () => {
     navigate("/housing/register/review");
  };

  return (
    <HousingRegistrationLayout
      step={3}
      progress={100}
      onBack={handleBack}
      onNext={handleNext}
      nextLabel="Створити оголошення"
    >
      <section className="w-full max-w-[700px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Налаштуйте доступність календаря
        </h1>

        <p className="mt-2 text-[16px] leading-[1.5] text-[#616D75]">
          Визначте, коли та на скільки днів гості можуть бронювати ваше житло.
        </p>

        <div className="mt-6">
          <div className="flex min-h-[68px] items-center justify-between border-b border-[#D9DDE0]">
            <div>
              <h2 className="text-[16px] font-medium text-black">
                Мінімальна тривалість проживання
              </h2>

              <p className="mt-1 text-[11px] text-[#7D8790]">
                Скільки ночей щонайменше має забронювати гість?
              </p>
            </div>

            <div className="flex h-[42px] w-[150px] items-center rounded-[8px] border border-[#8D9AA3] bg-white">
              <button
                type="button"
                onClick={() => updateMinimumStay(-1)}
                disabled={data.minimumStay <= 1}
                className="flex h-full w-[48px] items-center justify-center text-[#616D75] disabled:opacity-30"
              >
                <Minus size={16} />
              </button>

              <span className="flex-1 text-center text-[15px] text-black">
                {data.minimumStay}
              </span>

              <button
                type="button"
                onClick={() => updateMinimumStay(1)}
                className="flex h-full w-[48px] items-center justify-center text-[#355872]"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex min-h-[68px] items-center justify-between border-b border-[#D9DDE0]">
            <div>
              <h2 className="text-[16px] font-medium text-black">
                Вікно бронювання наперед
              </h2>

              <p className="mt-1 text-[11px] text-[#7D8790]">
                Наскільки далеко в майбутнє гості можуть бронювати дати?
              </p>
            </div>

            <select
              value={data.bookingWindowMonths}
              onChange={(event) =>
                updateData({
                  bookingWindowMonths: Number(event.target.value),
                })
              }
              className="h-[42px] min-w-[150px] rounded-[8px] border border-[#8D9AA3] bg-white px-4 text-[14px] text-black outline-none"
            >
              <option value={1}>На 1 місяць</option>
              <option value={3}>На 3 місяці</option>
              <option value={6}>На 6 місяців</option>
              <option value={9}>На 9 місяців</option>
              <option value={12}>На 12 місяців</option>
              <option value={24}>На 24 місяці</option>
            </select>
          </div>

          <div className="pt-5">
            <h2 className="text-[16px] font-medium text-black">
              Час на підготовку
            </h2>

            <p className="mt-1 text-[11px] text-[#7D8790]">
              Чи потрібна перерва між виїздом одного гостя та заїздом наступного?
            </p>

            <div className="mt-4 space-y-3">
              <RadioCard
                checked={data.preparationTime === "none"}
                title="Без перерви"
                description="Гості можуть заїхати у день виїзду попередніх"
                onClick={() => handlePreparationTime("none")}
              />

              <RadioCard
                checked={data.preparationTime === "one_day"}
                title="1 день між бронюваннями"
                description="Календар автоматично закриє наступну добу для клінінгу"
                onClick={() => handlePreparationTime("one_day")}
              />

              <RadioCard
                checked={data.preparationTime === "manual"}
                title="Налаштовувати вручну в календарі"
                description="Ви самі закриватимете дні після дат чи складних бронювань"
                onClick={() => handlePreparationTime("manual")}
              />
            </div>
          </div>
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step21Calendar;