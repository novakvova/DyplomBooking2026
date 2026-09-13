import { BedDouble, Building2, House } from "lucide-react";

import HousingRegistrationLayout from "./HousingRegistrationLayout";
import {
  type HousingPropertyType,
  useHousingRegistration,
} from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

const propertyTypes = [
  {
    id: "entire_place" as const,
    title: "Ціле помешкання",
    description: "Усе помешкання в повному розпорядженні гостей",
    icon: House,
  },
  {
    id: "private_room" as const,
    title: "Кімната",
    description:
      "Гості мають власну кімнату в помешканні, а також доступ до спільних приміщень.",
    icon: Building2,
  },
  {
    id: "shared_room" as const,
    title: "Спільна кімната в хостелі",
    description:
      "Гості сплять у спільній кімнаті в професійно керованому хостелі, де цілодобово присутній персонал.",
    icon: BedDouble,
  },
];

const Step03PropertyType = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const handleSelect = (propertyType: HousingPropertyType) => {
    updateData({
        propertyType,
        bedroomLock: null,
    });
  };

  const handleBack = () => {
    navigate("/housing/register/category");
  };

  const handleNext = () => {
    if (!data.propertyType) return;

    navigate("/housing/register/rental-format");
  };

  return (
    <HousingRegistrationLayout
      step={1}
      progress={30}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!data.propertyType}
    >
      <section className="w-full max-w-[818px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Який тип помешкання ви пропонуєте
          <br />
          гостям?
        </h1>

        <div className="mt-7 flex flex-col gap-7">
          {propertyTypes.map((item) => {
            const Icon = item.icon;
            const selected = data.propertyType === item.id;

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
                  size={32}
                  strokeWidth={1.4}
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

export default Step03PropertyType;