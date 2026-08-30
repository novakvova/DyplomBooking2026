import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
import {
  Armchair,
  Bath,
  BedDouble,
  BriefcaseBusiness,
  CookingPot,
  Fan,
  FireExtinguisher,
  Flame,
  Heater,
  Hotel,
  Microwave,
  ParkingCircle,
  Refrigerator,
  ShieldPlus,
  ShowerHead,
  Snowflake,
  Sparkles,
  Sun,
  Tv,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AmenityOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AmenityGroup {
  title: string;
  items: AmenityOption[];
}

const amenityGroups: AmenityGroup[] = [
  {
    title: "Основне",
    items: [
      { id: "wifi", label: "Wi-Fi", icon: Wifi },
      { id: "tv", label: "Телевізор", icon: Tv },
      { id: "air_conditioning", label: "Кондиціонер", icon: Snowflake },
      { id: "heating", label: "Опалення", icon: Heater },
      { id: "workspace", label: "Робоча зона\n(стіл, крісло)", icon: BriefcaseBusiness },
      { id: "parking", label: "Паркування", icon: ParkingCircle },
    ],
  },
  {
    title: "Кухня та обідня зона",
    items: [
      { id: "kitchen", label: "Кухня", icon: UtensilsCrossed },
      { id: "refrigerator", label: "Холодильник", icon: Refrigerator },
      { id: "microwave", label: "Мікрохвильова", icon: Microwave },
      { id: "stove", label: "Плита", icon: CookingPot },
      { id: "kettle", label: "Електрочайник", icon: Hotel },
    ],
  },
  {
    title: "Ванна та комфорт",
    items: [
      { id: "towels_linen", label: "Рушники та\nбілизна", icon: BedDouble },
      { id: "hair_dryer", label: "Фен", icon: Fan },
      { id: "toiletries", label: "Засоби гігієни", icon: ShowerHead },
      { id: "washing_machine", label: "Пральна\nмашина", icon: WashingMachine },
      { id: "iron", label: "Праска", icon: Armchair },
    ],
  },
  {
    title: "Відпочинок та подвір'я",
    items: [
      { id: "pool", label: "Басейн", icon: Waves },
      { id: "jacuzzi_sauna", label: "Джакузі / Сауна", icon: Bath },
      { id: "grill", label: "Гриль/барбекю", icon: Flame },
      { id: "terrace", label: "Тераса /\nБалкон/Патіо", icon: Sun },
    ],
  },
  {
    title: "Безпека",
    items: [
      { id: "fire_extinguisher", label: "Вогнегасник", icon: FireExtinguisher },
      { id: "smoke_detector", label: "Детектор диму", icon: Sparkles },
      { id: "first_aid", label: "Аптечка", icon: ShieldPlus },
    ],
  },
];

const Step10Amenities = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const handleToggle = (amenityId: string) => {
    const selected = data.amenities.includes(amenityId);

    updateData({
      amenities: selected
        ? data.amenities.filter((id) => id !== amenityId)
        : [...data.amenities, amenityId],
    });
  };

  const handleBack = () => {
    navigate("/housing/register/listing-intro");
  };

  const handleNext = () => {
    navigate("/housing/register/photos")
  };

  return (
    <HousingRegistrationLayout
      step={2}
      progress={15}
      onBack={handleBack}
      onNext={handleNext}
    >
      <section className="w-full max-w-[818px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Які зручності є у вашому помешканні?
        </h1>

        <p className="mt-2 max-w-[760px] text-[16px] font-normal leading-[1.5] text-[#616D75]">
          Оберіть усе, що є в наявності. Це допоможе гостям швидше знайти ваше
          житло під час пошуку.
        </p>

        <div className="mt-6 flex flex-col gap-6">
          {amenityGroups.map((group) => (
            <section key={group.title}>
              <h2 className="mb-3 text-[15px] font-medium text-black">
                {group.title}
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => {
                  const selected = data.amenities.includes(item.id);
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggle(item.id)}
                      aria-pressed={selected}
                      className={`flex min-h-[124px] items-center gap-3 rounded-[10px] border px-5 py-[10px] text-left transition ${
                        selected
                          ? "border-2 border-[#243C4E] bg-[#F7FAFC]"
                          : "border border-[#616D75] bg-white hover:border-[#243C4E]"
                      }`}
                    >
                      <Icon
                        size={22}
                        strokeWidth={1.8}
                        className="shrink-0 text-black"
                      />

                      <span className="whitespace-pre-line text-[17px] font-normal leading-[1.15] text-black">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step10Amenities;