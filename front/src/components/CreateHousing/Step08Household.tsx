import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
import { PawPrint, UserRound, Users, UsersRound,} from "lucide-react";
import type { LucideIcon } from "lucide-react";


type HouseholdKey =
  | "livesWithHost"
  | "livesWithFamily"
  | "otherGuestsPresent"
  | "petsPresent";

interface HouseholdOption {
  key: HouseholdKey;
  title: string;
  description: string;
  icon: LucideIcon;
}

const householdOptions: HouseholdOption[] = [
  {
    key: "livesWithHost",
    title: "Проживання з господарем",
    description: "Власник житла мешкає в цьому ж помешканні",
    icon: UserRound,
  },
  {
    key: "livesWithFamily",
    title: "Проживання з родиною",
    description: "У будинку мешкає господар разом із сім’єю",
    icon: UsersRound,
  },
  {
    key: "otherGuestsPresent",
    title: "Інші гості у будинку",
    description: "Сусідні кімнати також здаються іншим мандрівникам",
    icon: Users,
  },
  {
    key: "petsPresent",
    title: "Домашні улюбленці",
    description: "У помешканні живуть коти або собаки",
    icon: PawPrint,
  },
];


const Step08Household = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const handleToggle = (key: HouseholdKey) => {
    updateData({
      [key]: !data[key],
    });
  };

  const handleBack = () => {
    navigate("/housing/register/bathroom");
  };

  const handleNext = () => {
    navigate("/housing/register/listing-intro");
  };

  return (
    <HousingRegistrationLayout
      step={1}
      progress={100}
      onBack={handleBack}
      onNext={handleNext}
    >
      <section className="w-full max-w-[700px]">
        <div className="mb-7">
          <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.02em] text-black">
            Співмешканці та сусіди
          </h1>

          <p className="mt-1 text-[16px] font-normal text-[#697780]">
            Хто перебуватиме в будинку під час проживання гостей?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {householdOptions.map((item) => {
            const selected = data[item.key];
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleToggle(item.key)}
                aria-pressed={selected}
                className={`min-h-[142px] rounded-[8px] border px-5 py-4 text-left transition ${
                  selected
                    ? "border-2 border-[#243C4E] bg-[#F7FAFC]"
                    : "border border-[#8D9AA3] bg-white hover:border-[#243C4E]"
                }`}
              >
                <div className="flex justify-center">
                  <Icon
                    size={34}
                    strokeWidth={1.8}
                    className="text-black"
                  />
                </div>

                <p className="mt-3 text-[18px] font-normal leading-tight text-black">
                  {item.title}
                </p>

                <p className="mt-1 text-[12px] font-normal leading-[1.35] text-[#616D75]">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step08Household;
