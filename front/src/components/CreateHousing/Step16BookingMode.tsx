import HousingRegistrationLayout from "./HousingRegistrationLayout";
import {
  type BookingMode,
  useHousingRegistration,
} from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

interface BookingOption {
  id: BookingMode;
  title: string;
  subtitle?: string;
  description: string;
}

const bookingOptions: BookingOption[] = [
  {
    id: "manual",
    title: "Ручне підтвердження",
    subtitle: "Рекомендовано для старту",
    description:
      "Ви самі переглядаєте кожен запит та профіль гостя перед тим, як підтвердити бронювання. Чудово підходить, щоб освоїтися на платформі.",
  },
  {
    id: "instant",
    title: "Миттєве бронювання",
    description:
      "Гості можуть одразу бронювати вільні дати без очікування вашої відповіді. Це підвищує ваше оголошення в пошуку та залучає більше гостей.",
  },
];

const Step16BookingMode = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const handleSelect = (bookingMode: BookingMode) => {
    updateData({ bookingMode });
  };

  const handleBack = () => {
    navigate("/housing/register/publish-intro");
  };

  const handleNext = () => {
    if (!data.bookingMode) return;

    navigate("/housing/register/price");
  };

  return (
    <HousingRegistrationLayout
      step={3}
      progress={15}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!data.bookingMode}
    >
      <section className="w-full max-w-[700px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Як ви хочете приймати бронювання?
        </h1>

        <p className="mt-2 max-w-[620px] text-[18px] leading-[1.5] text-[#767676]">
          Оберіть спосіб підтвердження замовлень. Ви зможете змінити це
          налаштування будь-коли.
        </p>

        <div className="mt-8 space-y-4">
          {bookingOptions.map((item) => {
            const selected = data.bookingMode === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-pressed={selected}
                className={`w-full rounded-[10px] border px-5 py-5 text-left transition ${
                  selected
                    ? "border-2 border-[#243C4E] bg-[#F7FAFC]"
                    : "border border-[#8D9AA3] bg-white hover:border-[#243C4E]"
                }`}
              >
                <p className="text-[20px] font-normal leading-tight text-black">
                  {item.title}
                </p>

                {item.subtitle && (
                  <p className="mt-1 text-[13px] font-medium text-[#616D75]">
                    {item.subtitle}
                  </p>
                )}

                <p className="mt-2 text-[14px] leading-[1.45] text-[#616D75]">
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

export default Step16BookingMode;