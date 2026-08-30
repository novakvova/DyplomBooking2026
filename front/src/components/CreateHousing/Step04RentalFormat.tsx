import { CalendarDays, Clock3, CalendarClock } from "lucide-react";

import HousingRegistrationLayout from "./HousingRegistrationLayout";
import {
  type HousingRentalFormat,
  useHousingRegistration,
} from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

const rentalFormats = [
  {
    id: "daily" as const,
    title: "Подобово",
    description: "Класична оренда на одну або більше ночей",
    icon: CalendarDays,
  },
  {
    id: "hourly" as const,
    title: "Погодинно",
    description: "Здача на декілька годин (для відпочинку, фотосесій чи роботи)",
    icon: Clock3,
  },
  {
    id: "flexible" as const,
    title: "Гнучкий формат (Подобово та погодинно)",
    description: "Максимальний дохід: гості можуть бронювати як на ночі, так і на години",
    icon: CalendarClock,
  },
];

const Step04RentalFormat = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const handleSelect = (rentalFormat: HousingRentalFormat) => {
    updateData({ rentalFormat });
  };

  const handleBack = () => {
    navigate("/housing/register/property-type");
  };

  const handleNext = () => {
    if (!data.rentalFormat) return;

    navigate("/housing/register/accommodation-type");
  };

  return (
    <HousingRegistrationLayout
      step={1}
      progress={45}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!data.rentalFormat}
    >
      <section className="w-full max-w-[818px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Як ви бажаєте здавати помешкання?
        </h1>

        <div className="mt-7 flex flex-col gap-7">
          {rentalFormats.map((item) => {
            const Icon = item.icon;
            const selected = data.rentalFormat === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`flex min-h-[124px] w-full items-center justify-between gap-8 rounded-[20px] border px-[30px] text-left transition ${
                  selected
                    ? "border-[#243C4E] bg-[#F7FAFC] ring-1 ring-[#243C4E]"
                    : "border-[#616D75] bg-white hover:border-[#243C4E]"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-[24px] font-medium leading-none text-black">
                    {item.title}
                  </h2>

                  <p className="mt-3 max-w-[506px] text-[20px] leading-none text-[#616D75]">
                    {item.description}
                  </p>
                </div>

                <Icon
                  size={30}
                  strokeWidth={1.5}
                  className="shrink-0 text-black"
                />
              </button>
            );
          })}
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step04RentalFormat;