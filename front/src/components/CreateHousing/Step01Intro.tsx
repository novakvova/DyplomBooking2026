import HousingRegistrationLayout from "./HousingRegistrationLayout";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

const Step01Intro = () => {
  const navigate = useLocalizedNavigate();

  const handleBack = () => {
    navigate("/housing/create");
  };

  const handleNext = () => {
    navigate("/housing/register/category");
  };

  return (
    <HousingRegistrationLayout
      progress={0}
      onBack={handleBack}
      onNext={handleNext}
      showHelp={false}
    >
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
        <section className="max-w-[774px] lg:ml-20">
          <p className="mb-4 text-xs font-medium text-black">Крок 1</p>

          <h1 className="max-w-[650px] text-[40px] font-semibold leading-none tracking-[-0.02em] text-black lg:text-[52px] xl:text-[64px]">
            Розкажіть нам про своє помешкання
          </h1>

          <p className="mt-6 max-w-[650px] text-[16px] font-semibold leading-[1.6] text-[#767676] lg:text-[18px] xl:text-[22px]">
            На цьому етапі вам потрібно буде вказати, який у вас тип
            помешкання і чи можуть гості бронювати його цілком чи лише
            окрему кімнату. Потім повідомте нам розташування помешкання
            та кількість гостей, які можуть у ньому перебувати.
          </p>
        </section>

        <section className="flex justify-center">
          <div className="h-[192px] w-[220px] rounded-[10px] bg-[#D9D9D9] lg:h-[240px] lg:w-[276px]" />
        </section>
      </div>
    </HousingRegistrationLayout>
  );
};

export default Step01Intro;