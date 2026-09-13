import { useEffect } from "react";

import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

const MAX_DESCRIPTION_LENGTH = 500;

const highlightText: Record<string, string> = {
  bright_spacious: "світлим і просторим інтер'єром",
  designer_renovation: "стильним дизайнерським ремонтом",
  private_yard: "власним затишним двором",
  near_park: "зручним розташуванням поруч із парком",
  private_terrace: "власною терасою для відпочинку",
  authentic_style: "особливим автентичним стилем",
  panoramic_view: "панорамним видом",
  city_center: "розташуванням у самому центрі міста",
  developed_infrastructure: "розвиненою інфраструктурою поруч",
  transport_links: "зручною транспортною розв'язкою",
  compact_cozy: "компактним і затишним простором",
  quiet_peaceful: "тихою та спокійною атмосферою",
};

const generateDescription = (highlights: string[]) => {
  const selected = highlights
    .map((id) => highlightText[id])
    .filter(Boolean);

  if (selected.length === 0) {
    return "Єсть стіл два крєсла ну я не знаю шо нада дітям шоб вони ідеально жили";
  }

  if (selected.length === 1) {
    return `Затишне житло з ${selected[0]}. Тут є все необхідне для комфортного проживання та приємного відпочинку.`;
  }

  return `Затишне житло вирізняється ${selected[0]} та ${selected[1]}. Тут є все необхідне для комфортного проживання, відпочинку та приємного перебування під час подорожі.`;
};

const Step14Description = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const description = data.description;
  const isTooLong = description.length > MAX_DESCRIPTION_LENGTH;
  const isEmpty = description.trim().length === 0;
  const isValid = !isEmpty && !isTooLong;

  useEffect(() => {
    if (data.description.trim()) return;

    updateData({
      description: generateDescription(data.highlights),
    });
  }, []);

  const handleBack = () => {
    navigate("/housing/register/highlights");
  };

  const handleNext = () => {
    if (!isValid) return;

    navigate("/housing/register/publish-intro");
  };

  return (
    <HousingRegistrationLayout
      step={2}
      progress={75}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!isValid}
    >
      <section className="w-full max-w-[700px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Опишіть ваше житло
        </h1>

        <p className="mt-2 max-w-[650px] text-[18px] leading-[1.5] text-[#767676]">
          Поділіться тим, що робить ваш простір особливим. Згадайте про затишні
          куточки, зручності поруч або особливу атмосферу.
        </p>

        <div className="mt-14">
          <textarea
            value={description}
            onChange={(event) =>
              updateData({
                description: event.target.value,
              })
            }
            rows={6}
            className={`min-h-[220px] w-full resize-none rounded-[8px] border px-4 py-4 text-[18px] leading-[1.5] text-black outline-none transition ${
              isTooLong
                ? "border-[#D92D20] focus:ring-1 focus:ring-[#D92D20]"
                : "border-[#355872] focus:ring-1 focus:ring-[#243C4E]"
            }`}
          />

          <p
            className={`mt-2 text-[14px] ${
              isTooLong ? "text-[#D92D20]" : "text-black"
            }`}
          >
            {description.length} / {MAX_DESCRIPTION_LENGTH}
          </p>

          {isTooLong && (
            <p className="mt-1 text-[12px] text-[#D92D20]">
              Опис перевищує допустиму кількість символів
            </p>
          )}
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step14Description;