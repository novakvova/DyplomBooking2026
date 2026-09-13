import { useState } from "react";
import { Check, X } from "lucide-react";

import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

type SafetyKey =
  | "securityCameras"
  | "noiseMonitor"
  | "propertySafetyFeatures";

type SafetyDescriptionKey =
  | "securityCamerasDescription"
  | "noiseMonitorDescription"
  | "propertySafetyFeaturesDescription";

interface SafetyOption {
  key: SafetyKey;
  descriptionKey: SafetyDescriptionKey;
  title: string;
  description: string;
}

const safetyOptions: SafetyOption[] = [
  {
    key: "securityCameras",
    descriptionKey: "securityCamerasDescription",
    title: "Камери відеоспостереження",
    description:
      "Камери встановлені виключно на вулиці або у спільній зоні (наприклад, на подвір'ї чи під'їзді)",
  },
  {
    key: "noiseMonitor",
    descriptionKey: "noiseMonitorDescription",
    title: "Датчик рівня шуму",
    description:
      "Пристрій фіксує лише рівень гучності (децибели), без запису звуку чи розмов",
  },
  {
    key: "propertySafetyFeatures",
    descriptionKey: "propertySafetyFeaturesDescription",
    title: "Особливості помешкання (за наявності)",
    description:
      "У будинку є зброя, охоронні собаки або спеціальні заходи безпеки",
  },
];

const Step19Safety = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const [editingOption, setEditingOption] =
    useState<SafetyOption | null>(null);

  const [draftDescription, setDraftDescription] = useState("");

  const handleSelect = (option: SafetyOption) => {
    const selected = data[option.key];

    if (selected) {
      updateData({
        [option.key]: false,
        [option.descriptionKey]: "",
      });

      return;
    }

    setEditingOption(option);
    setDraftDescription(data[option.descriptionKey] ?? "");
  };

  const handleCloseModal = () => {
    setEditingOption(null);
    setDraftDescription("");
  };

  const handleSave = () => {
    if (!editingOption) return;

    const description = draftDescription.trim();

    if (!description) return;

    updateData({
      [editingOption.key]: true,
      [editingOption.descriptionKey]: description,
    });

    handleCloseModal();
  };

  const handleBack = () => {
    navigate("/housing/register/discounts");
  };

  const handleNext = () => {
    navigate("/housing/register/rules");
  };

  return (
    <>
      <HousingRegistrationLayout
        step={3}
        progress={70}
        onBack={handleBack}
        onNext={handleNext}
      >
        <section className="w-full max-w-[700px]">
          <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
            Заходи безпеки та пристрої
          </h1>

          <p className="mt-2 max-w-[650px] text-[16px] leading-[1.5] text-[#616D75]">
            Гості мають знати про наявність пристроїв спостереження або
            особливості помешкання до бронювання.
          </p>

          <div className="mt-8 space-y-4">
            {safetyOptions.map((item) => {
              const selected = data[item.key];

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`flex min-h-[94px] w-full items-center gap-5 rounded-[10px] border px-5 py-4 text-left transition ${
                    selected
                      ? "border-[#243C4E] bg-[#F7FAFC]"
                      : "border-[#8D9AA3] bg-white hover:border-[#243C4E]"
                  }`}
                >
                  <span
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border transition ${
                      selected
                        ? "border-[#243C4E] bg-[#243C4E]"
                        : "border-[#6BA4BA] bg-white"
                    }`}
                  >
                    {selected && (
                      <Check
                        size={15}
                        strokeWidth={2.4}
                        className="text-white"
                      />
                    )}
                  </span>

                  <div>
                    <h2 className="text-[17px] font-normal leading-tight text-black">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-[12px] leading-[1.35] text-[#616D75]">
                      {item.description}
                    </p>

                    {selected && data[item.descriptionKey] && (
                      <p className="mt-2 text-[12px] font-medium text-[#355872]">
                        {data[item.descriptionKey]}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </HousingRegistrationLayout>

      {editingOption && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[620px] overflow-hidden rounded-[10px] bg-white"
          >
            <div className="relative px-5 pb-4 pt-5">
              <h2 className="pr-10 text-[18px] font-medium leading-[1.35] text-black">
                Опишіть, де саме встановлені пристрої та як вони
                використовуються
              </h2>

              <p className="mt-2 text-[12px] text-[#616D75]">
                Наприклад: біля вхідних дверей, на подвір'ї, у під'їзді
              </p>

              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#9AA3A9] transition hover:bg-[#F3F5F6] hover:text-black"
                aria-label="Закрити"
              >
                <X size={20} />
              </button>

              <textarea
                value={draftDescription}
                onChange={(event) =>
                  setDraftDescription(event.target.value.slice(0, 300))
                }
                rows={5}
                maxLength={300}
                autoFocus
                className="mt-4 min-h-[140px] w-full resize-none rounded-[8px] border border-[#7D8790] px-4 py-3 text-[16px] text-black outline-none transition focus:border-[#243C4E] focus:ring-1 focus:ring-[#243C4E]"
              />

              <p className="mt-1 text-right text-[12px] text-[#8A949B]">
                {draftDescription.length}/300
              </p>
            </div>

            <div className="flex justify-end border-t border-[#D9DDE0] px-5 py-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={!draftDescription.trim()}
                className="min-w-[130px] rounded-[7px] bg-[#243C4E] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#1D3241] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Продовжити
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step19Safety;