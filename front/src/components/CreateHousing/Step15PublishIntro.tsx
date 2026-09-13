import HousingRegistrationLayout from "./HousingRegistrationLayout";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

const Step15PublishIntro = () => {
  const navigate = useLocalizedNavigate();

  const handleBack = () => {
    navigate("/housing/register/description");
  };

  const handleNext = () => {
    navigate("/housing/register/booking-mode");
  };

  return (
    <HousingRegistrationLayout
      step={3}
      progress={0}
      onBack={handleBack}
      onNext={handleNext}
      showHelp={false}
    >
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
        <section className="max-w-[774px] lg:ml-20">
          <p className="mb-4 text-xs font-medium text-black">
            Крок 3
          </p>

          <h1 className="max-w-[650px] text-[40px] font-semibold leading-[1.08] tracking-[-0.02em] text-black lg:text-[52px] xl:text-[64px]">
            Завершіть
            <br />
            налаштування та
            <br />
            опублікуйте
          </h1>

          <p className="mt-6 max-w-[650px] text-[16px] font-semibold leading-[1.6] text-[#767676] lg:text-[18px] xl:text-[22px]">
            Налаштуйте ціни, правила та календар. Після цього ваше оголошення
            одразу з&apos;явиться в пошуку.
          </p>
        </section>

        <section className="flex justify-center">
          <img
            src="/images/items/create_housing_3.jpg"
            alt="Завершення налаштування оголошення"
            className="h-[240px] w-[276px] rounded-[10px] object-cover lg:h-[300px] lg:w-[345px]"
          />
        </section>
      </div>
    </HousingRegistrationLayout>
  );
};

export default Step15PublishIntro;