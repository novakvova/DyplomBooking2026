import HousingRegistrationLayout from "./HousingRegistrationLayout";
import {
  type BedroomLock,
  useHousingRegistration,
} from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
import { Minus, Plus } from "lucide-react";

interface CounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const Counter = ({ label, value, onChange }: CounterProps) => {
  const decrease = () => {
    if (value <= 1) return;
    onChange(value - 1);
  };

  const increase = () => {
    onChange(value + 1);
  };

  return (
    <div className="flex min-h-[72px] items-center justify-between border-b border-[#D9DDE0]">
      <span className="text-[20px] font-medium text-black">
        {label}
      </span>

      <div className="flex h-[48px] w-[188px] items-center rounded-xl border border-[#7D8790] bg-white">
        <button
            type="button"
            onClick={decrease}
            className="flex h-full w-[70px] items-center justify-center rounded-l-xl text-[#616D75] transition hover:bg-[#F3F6F8] active:bg-[#E8EEF2]"
            aria-label="Зменшити"
        >
            <Minus size={20} strokeWidth={2} />
        </button>

        <div className="flex flex-1 items-center justify-center text-[18px] font-medium text-[#1F2933]">
            {value}
        </div>

        <button
            type="button"
            onClick={increase}
            className="flex h-full w-[70px] items-center justify-center rounded-r-xl text-[#355872] transition hover:bg-[#EAF2F7] active:bg-[#DCEAF3]"
            aria-label="Збільшити"
        >
            <Plus size={20} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
};

const Step06BasicInfo = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const isEntirePlace = data.propertyType === "entire_place";
  const isPrivateRoom = data.propertyType === "private_room";

  const handleBedroomLock = (bedroomLock: BedroomLock) => {
    updateData({ bedroomLock });
  };

  const handleBack = () => {
    navigate("/housing/register/accommodation-type");
  };

  const handleNext = () => {
    if (isPrivateRoom && !data.bedroomLock) return;

    // Step07 додамо наступним.
  };

  return (
    <HousingRegistrationLayout
      progress={27}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={isPrivateRoom && !data.bedroomLock}
    >
      <section className="w-full max-w-[818px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Зазначте основні відомості про своє
          <br />
          помешкання
        </h1>

        <p className="mt-2 text-[22px] font-medium leading-[35px] text-[#616D75]">
          Вкажіть базову місткість. Деталі (типи ліжок чи зручності) можна буде
          уточнити пізніше
        </p>

        <div className="mt-5">
          <Counter
            label="Гості"
            value={data.guests}
            onChange={(guests) => updateData({ guests })}
          />

          <Counter
            label="Спальні"
            value={data.bedrooms}
            onChange={(bedrooms) => updateData({ bedrooms })}
          />

          <Counter
            label="Ліжка"
            value={data.beds}
            onChange={(beds) => updateData({ beds })}
          />

          {isEntirePlace && (
            <Counter
              label="Ванні кімнати"
              value={data.bathrooms}
              onChange={(bathrooms) => updateData({ bathrooms })}
            />
          )}
        </div>

        {isPrivateRoom && (
          <div className="mt-5">
            <h2 className="text-[22px] font-medium text-black">
              Чи замикаються двері у спальню?
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => handleBedroomLock("yes")}
                className={`flex min-h-[88px] items-center gap-3 rounded-[10px] border px-4 text-left transition ${
                  data.bedroomLock === "yes"
                    ? "border-2 border-[#243C4E]"
                    : "border border-[#616D75] hover:border-[#243C4E]"
                }`}
              >
                <span
                  className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border ${
                    data.bedroomLock === "yes"
                      ? "border-[#243C4E]"
                      : "border-[#616D75]"
                  }`}
                >
                  {data.bedroomLock === "yes" && (
                    <span className="h-[10px] w-[10px] rounded-full bg-[#243C4E]" />
                  )}
                </span>

                <div>
                  <p className="text-[20px] font-medium leading-none text-black">
                    Так, на ключ або код
                  </p>

                  <p className="mt-1 text-[16px] leading-[1.25] text-[#616D75]">
                    Гість може замикати кімнату зсередини та ззовні
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleBedroomLock("no")}
                className={`flex min-h-[88px] items-center gap-3 rounded-[10px] border px-4 text-left transition ${
                  data.bedroomLock === "no"
                    ? "border-2 border-[#243C4E]"
                    : "border border-[#616D75] hover:border-[#243C4E]"
                }`}
              >
                <span
                  className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border ${
                    data.bedroomLock === "no"
                      ? "border-[#243C4E]"
                      : "border-[#616D75]"
                  }`}
                >
                  {data.bedroomLock === "no" && (
                    <span className="h-[10px] w-[10px] rounded-full bg-[#243C4E]" />
                  )}
                </span>

                <div>
                  <p className="text-[20px] font-medium leading-none text-black">
                    Ні, засувки або замка немає
                  </p>

                  <p className="mt-1 text-[16px] leading-[1.25] text-[#616D75]">
                    Двері зачиняються, але не замикаються на ключ
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-3 rounded-[10px] border border-[#616D75] bg-[#BEDCE0] px-[10px] py-2 text-[14px] font-medium leading-none text-[#616D75]">
              <span className="text-black">Порада: </span>
              Житло із замком на дверях спальні отримує більше бронювань,
              оскільки гості почуваються безпечніше.
            </div>
          </div>
        )}
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step06BasicInfo;