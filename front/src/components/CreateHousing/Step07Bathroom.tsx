import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
import { Minus, Plus } from "lucide-react";

type BathroomKey =
  | "privateBathroomInside"
  | "privateBathroomOutside"
  | "sharedBathroom";

interface BathroomOption {
  key: BathroomKey;
  title: string;
  description: string;
}

const bathroomOptions: BathroomOption[] = [
  {
    key: "privateBathroomInside",
    title: "Приватна (вхід із кімнати)",
    description:
      "Безпосередній вхід зі спальні, тільки для гостей цієї кімнати.",
  },
  {
    key: "privateBathroomOutside",
    title: "Приватна (вхід із коридору)",
    description:
      "Призначена тільки для гостей, але вхід у неї через спільну зону.",
  },
  {
    key: "sharedBathroom",
    title: "Спільна ванна кімната",
    description:
      "Використовується разом із іншими мешканцями або хостом.",
  },
];

const Step07Bathroom = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const selectedBathrooms =
    data.privateBathroomInside +
    data.privateBathroomOutside +
    data.sharedBathroom;

  const isValid = selectedBathrooms === data.bathrooms;

  const handleChange = (key: BathroomKey, delta: number) => {
    const current = data[key];

    if (delta > 0 && selectedBathrooms >= data.bathrooms) return;

    updateData({
      [key]: Math.max(0, current + delta),
    });
  };

  const handleBack = () => {
    navigate("/housing/register/basic-info");
  };

  const handleNext = () => {
    if (!isValid) return;

    navigate("/housing/register/household");
  };

  return (
    <HousingRegistrationLayout
      step={1}
      progress={90}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!isValid}
    >
      <section className="w-full max-w-[700px]">
        <div className="mb-10">
          <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.02em] text-black">
            Яка ванна кімната доступна гостям?
          </h1>

          <p className="mt-1 text-[16px] font-normal text-[#697780]">
            Вкажіть тип та приватність санвузла.
          </p>
        </div>

        <div>
          {bathroomOptions.map((item) => {
            const value = data[item.key];

            return (
              <div
                key={item.key}
                className="flex min-h-[86px] items-center justify-between gap-8 border-b border-[#9CA8AF]"
              >
                <div className="pr-4">
                  <h2 className="text-[18px] font-normal leading-tight text-black">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-[12px] font-normal leading-tight text-black">
                    {item.description}
                  </p>
                </div>

                <div className="flex h-[42px] w-[144px] shrink-0 items-center rounded-[7px] border border-[#8D9AA3] bg-white">
                  <button
                    type="button"
                    disabled={value === 0}
                    onClick={() => handleChange(item.key, -1)}
                    className="flex h-full w-[48px] items-center justify-center rounded-l-[7px] text-[#616D75] transition hover:bg-[#F3F6F8] disabled:cursor-default disabled:opacity-40"
                    aria-label={`Зменшити: ${item.title}`}
                  >
                    <Minus size={16} strokeWidth={2} />
                  </button>

                  <span className="flex flex-1 items-center justify-center text-[16px] font-normal text-black">
                    {value}
                  </span>

                  <button
                    type="button"
                    disabled={selectedBathrooms >= data.bathrooms}
                    onClick={() => handleChange(item.key, 1)}
                    className="flex h-full w-[48px] items-center justify-center rounded-r-[7px] text-[#52616B] transition hover:bg-[#EAF2F7] disabled:cursor-default disabled:opacity-40"
                    aria-label={`Збільшити: ${item.title}`}
                  >
                    <Plus size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step07Bathroom;
