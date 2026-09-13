import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
import { CircleAlert } from "lucide-react";

const MAX_TITLE_LENGTH = 50;

const Step12Title = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const title = data.title;
  const isTooLong = title.length > MAX_TITLE_LENGTH;
  const isEmpty = title.trim().length === 0;
  const isValid = !isEmpty && !isTooLong;

  const handleBack = () => {
    navigate("/housing/register/photos");
  };

  const handleNext = () => {
    if (!isValid) return;

    navigate("/housing/register/highlights");
  };

  return (
    <HousingRegistrationLayout
      step={2}
      progress={45}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!isValid}
    >
      <section className="w-full max-w-[700px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Придумайте назву для вашого житла
        </h1>

        <p className="mt-2 max-w-[620px] text-[18px] leading-[1.5] text-[#767676]">
          Створіть яскраву назву, яка підкреслить головні переваги вашого
          будинку.
        </p>

        <div className="mt-14">
          <textarea
            value={title}
            onChange={(event) =>
              updateData({
                title: event.target.value,
              })
            }
            rows={6}
            className={`min-h-[220px] w-full resize-none rounded-[8px] border px-4 py-4 text-[20px] text-black outline-none transition ${
              isTooLong
                ? "border-[#D92D20] focus:ring-1 focus:ring-[#D92D20]"
                : "border-[#355872] focus:ring-1 focus:ring-[#243C4E]"
            }`}
          />

          <div className="mt-2">
            <p
              className={`text-[14px] ${
                isTooLong ? "text-[#D92D20]" : "text-black"
              }`}
            >
              {title.length} / {MAX_TITLE_LENGTH}
            </p>

            {isTooLong && (
              <div className="mt-1 flex items-center gap-1 text-[12px] text-[#D92D20]">
                <CircleAlert size={14} strokeWidth={2} />
                <span>Назва перевищує допустиму кількість символів</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step12Title;