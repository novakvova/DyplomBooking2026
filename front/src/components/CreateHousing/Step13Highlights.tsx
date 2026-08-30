import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

interface HighlightOption {
  id: string;
  label: string;
}

const MAX_HIGHLIGHTS = 2;

const highlightOptions: HighlightOption[] = [
  { id: "bright_spacious", label: "Світле та просторе" },
  { id: "designer_renovation", label: "Дизайнерський ремонт" },
  { id: "private_yard", label: "Власний двір" },
  { id: "near_park", label: "Поруч із парком" },
  { id: "private_terrace", label: "Власна тераса" },
  { id: "authentic_style", label: "Автентичний стиль" },
  { id: "panoramic_view", label: "Панорамний вид" },
  { id: "city_center", label: "У самому центрі" },
  { id: "developed_infrastructure", label: "Розвинена інфраструктура" },
  { id: "transport_links", label: "Зручна розв'язка" },
  { id: "compact_cozy", label: "Компактно та затишно" },
  { id: "quiet_peaceful", label: "Тихо та спокійно" },
];

const Step13Highlights = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const handleToggle = (id: string) => {
    const selected = data.highlights.includes(id);

    if (selected) {
      updateData({
        highlights: data.highlights.filter((item) => item !== id),
      });
      return;
    }

    if (data.highlights.length >= MAX_HIGHLIGHTS) return;

    updateData({
      highlights: [...data.highlights, id],
    });
  };

  const handleBack = () => {
    navigate("/housing/register/title");
  };

  const handleNext = () => {
    navigate("/housing/register/description");
  };

  return (
    <HousingRegistrationLayout
      step={2}
      progress={60}
      onBack={handleBack}
      onNext={handleNext}
    >
      <section className="w-full max-w-[700px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Що найкраще описує ваше житло?
        </h1>

        <p className="mt-2 max-w-[620px] text-[18px] leading-[1.5] text-[#767676]">
          Оберіть до 2 акцентів. Це допоможе сформувати перше враження та
          правильний опис.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          {highlightOptions.map((item) => {
            const selected = data.highlights.includes(item.id);
            const disabled =
              !selected && data.highlights.length >= MAX_HIGHLIGHTS;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggle(item.id)}
                disabled={disabled}
                aria-pressed={selected}
                className={`rounded-[8px] border px-4 py-3 text-[17px] font-normal transition ${
                  selected
                    ? "border-2 border-[#243C4E] bg-[#F2F7FA] text-black"
                    : "border-[#A8B0B5] bg-white text-black hover:border-[#243C4E]"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-[13px] text-[#7D8790]">
          Обрано {data.highlights.length} / {MAX_HIGHLIGHTS}
        </p>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step13Highlights;