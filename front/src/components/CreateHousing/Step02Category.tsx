import { Building, Building2, Hotel, TentTree } from "lucide-react";

import HousingRegistrationLayout from "./HousingRegistrationLayout";
import {
  type HousingCategory,
  useHousingRegistration,
} from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

const categories = [
  {
    id: "apartment" as const,
    title: "Апартаменти та квартири",
    description:
      "Квартири, апартаменти в житлових комплексах, студії або пентхауси.",
    icon: Building2,
  },
  {
    id: "house" as const,
    title: "Будинки та вілли",
    description:
      "Окремі будинки, котеджі, таунхауси, таун-вілли чи заміські маєтки.",
    icon: Building,
  },
  {
    id: "hotel" as const,
    title: "Готелі та хостели",
    description:
      "Номери в готелях, міні-готелях, мотелях, хостелах чи апарт-готелях.",
    icon: Hotel,
  },
  {
    id: "alternative" as const,
    title: "Альтернативне житло",
    description:
      "Глемпінги, еко-будиночки, кемпи, барнхауси, шале чи купольні дома.",
    icon: TentTree,
  },
];

const Step02Category = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const handleSelect = (category: HousingCategory) => {
    updateData({
      category,
      accommodationType: null,
    });
  };

  const handleBack = () => {
    navigate("/housing/register");
  };

  const handleNext = () => {
    if (!data.category) return;
    navigate("/housing/register/property-type");
  };

  return (
    <HousingRegistrationLayout
      step={1}
      progress={15}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!data.category}
    >
      <section className="w-full max-w-[818px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Додайте своє помешкання на WayGo та
          <br />
          починайте приймати гостей!
        </h1>

        <p className="mt-2 text-[22px] font-medium leading-[35px] text-[#616D75]">
          Виберіть категорію, яка найкраще описує ваше помешкання. Це
          допоможе гостям швидше його знайти.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {categories.map((item) => {
            const Icon = item.icon;
            const selected = data.category === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`min-h-[180px] rounded-[10px] border p-6 text-left transition ${
                  selected
                    ? "border-[#243C4E] bg-[#F7FAFC] ring-1 ring-[#243C4E]"
                    : "border-[#616D75] bg-white hover:border-[#243C4E]"
                }`}
              >
                <Icon size={24} strokeWidth={1.5} />

                <h2 className="mt-2 text-[20px] font-medium leading-tight text-black">
                  {item.title}
                </h2>

                <p className="mt-1 text-[13px] leading-[1.35] text-black">
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

export default Step02Category;