import HousingRegistrationLayout from "./HousingRegistrationLayout";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

const Step09ListingIntro = () => {
  const navigate = useLocalizedNavigate();

  const handleBack = () => {
    navigate("/housing/register/household");
  };

  const handleNext = () => {
    navigate("/housing/register/amenities");
  };

  return (
    <HousingRegistrationLayout
      step={2}
      progress={0}
      onBack={handleBack}
      onNext={handleNext}
      showHelp={false}
    >
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_506px] lg:gap-20">
        <section className="max-w-[700px] lg:ml-20">
          <p className="mb-4 text-xs font-medium text-black">
            Крок 2
          </p>

          <h1 className="max-w-[650px] text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-black lg:text-[52px] xl:text-[64px]">
            Наповніть картку
            <br />
            житла
          </h1>

          <p className="mt-6 max-w-[650px] text-[16px] font-semibold leading-[1.6] text-[#767676] lg:text-[18px] xl:text-[22px]">
            Додайте фотографії, вкажіть наявні зручності та складіть яскравий
            опис. Це допоможе вашому оголошенню виділятися в пошуку та
            отримувати більше бронювань.
          </p>
        </section>

        <section className="flex justify-center">
          <img
            src="/images/items/create_housing_2.jpg"
            alt="Заповнення інформації про житло"
            className="aspect-[506/478] w-full max-w-[506px] rounded-[20px] object-cover"
          />
        </section>
      </div>
    </HousingRegistrationLayout>
  );
};

export default Step09ListingIntro;