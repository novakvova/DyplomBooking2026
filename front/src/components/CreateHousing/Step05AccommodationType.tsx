import HousingRegistrationLayout from "./HousingRegistrationLayout";
import {
  type HousingAccommodationType,
  type HousingCategory,
  useHousingRegistration,
} from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

interface AccommodationOption {
  id: HousingAccommodationType;
  title: string;
  description: string;
}

const accommodationTypes: Record<HousingCategory, AccommodationOption[]> = {
  apartment: [
    {
      id: "apartment",
      title: "Квартира",
      description: "Класичне житло у багатоквартирному будинку.",
    },
    {
      id: "studio",
      title: "Студія",
      description:
        "Компактне житло з об'єднаною спальнею, вітальнею та кухонною зоною.",
    },
    {
      id: "loft",
      title: "Лофт",
      description:
        "Простір у промисловому або урбаністичному стилі з високими стелями та відкритим плануванням.",
    },
    {
      id: "aparthotel",
      title: "Апарт-готель",
      description:
        "Житло в будівлі з готельним обслуговуванням (рецепція, прибирання, консьєрж).",
    },
    {
      id: "penthouse",
      title: "Пентхаус",
      description:
        "Просторі апартаменти на верхньому поверсі з власною терасою чи панорамним видом.",
    },
    {
      id: "duplex",
      title: "Дуплекс",
      description:
        "Апартаменти або квартира, розміщені на двох поверхах.",
    },
  ],

  house: [
    {
      id: "house",
      title: "Будинок",
      description:
        "Приватний будинок із власною територією та подвір'ям.",
    },
    {
      id: "villa",
      title: "Вілла",
      description:
        "Просторий розкішний будинок, зазвичай із басейном, садом та великою ділянкою.",
    },
    {
      id: "townhouse",
      title: "Таунхаус",
      description:
        "Будинок, що ділить спільні бічні стіни з сусідніми секціями.",
    },
    {
      id: "chalet",
      title: "Шале",
      description:
        "Затишний будинок у гірському або альпійському стилі з високим похилим дахом.",
    },
    {
      id: "bungalow",
      title: "Бунгало",
      description:
        "Затишний одноповерховий будинок із просторою верандою чи терасою.",
    },
    {
      id: "estate",
      title: "Садиба",
      description:
        "Великий житловий комплекс із власною великою парковою чи ландшафтною територією.",
    },
  ],

  hotel: [
    {
      id: "hotel",
      title: "Готель",
      description:
        "Класичний готель із номерами та стандартним комплексом послуг.",
    },
    {
      id: "mini_hotel",
      title: "Мініготель",
      description:
        "Невеликий затишний готель із кількома номерами та унікальним інтер'єром.",
    },
    {
      id: "hostel",
      title: "Хостел",
      description:
        "Бюджетне житло з окремими або спільними кімнатами та загальними зонами.",
    },
    {
      id: "guest_house",
      title: "Гостьовий будинок",
      description:
        "Приватне помешкання, де номери здаються як у готелі, нерідко із проживанням хоста.",
    },
    {
      id: "motel",
      title: "Мотель",
      description:
        "Придорожній готель із зручним паркуванням та швидким доступом для автотуристів.",
    },
  ],

  alternative: [
    {
      id: "glamping",
      title: "Глемпінг",
      description:
        "Комфортабельний купол, сферичний намет або тентовий дім серед природи.",
    },
    {
      id: "a_frame",
      title: "A-frame",
      description:
        "Трикутний будиночок із високим дахом до самої землі.",
    },
    {
      id: "barnhouse",
      title: "Барнхаус",
      description:
        "Сучасний мінімалістичний будинок у стилі амбара з екологічних матеріалів.",
    },
    {
      id: "tree_house",
      title: "Будинок на дереві",
      description:
        "Затишне житло, зведене на кронах або стовбурах дерев.",
    },
    {
      id: "houseboat",
      title: "Будинок на воді",
      description:
        "Плавучий будиночок або житло, розташоване безпосередньо над водою.",
    },
    {
      id: "camper",
      title: "Кемпер",
      description:
        "Облаштований для проживання трейлер, бусик або автодім.",
    },
  ],
};

const Step05AccommodationType = () => {
  const navigate = useLocalizedNavigate();
  const { data, updateData } = useHousingRegistration();

  const options = data.category
    ? accommodationTypes[data.category]
    : [];

  const handleSelect = (accommodationType: HousingAccommodationType) => {
    updateData({ accommodationType });
  };

  const handleBack = () => {
    navigate("/housing/register/rental-format");
  };

  const handleNext = () => {
    if (!data.accommodationType) return;

    navigate("/housing/register/basic-info");
  };

  return (
    <HousingRegistrationLayout
      progress={22}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!data.accommodationType}
    >
      <section className="w-full max-w-[818px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Який із наведених варіантів найкраще
          <br />
          описує вашу оселю?
        </h1>

        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((item) => {
            const selected = data.accommodationType === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`min-h-[206px] rounded-[10px] border p-6 text-left transition ${
                  selected
                    ? "border-[#243C4E] bg-[#F7FAFC] ring-1 ring-[#243C4E]"
                    : "border-[#616D75] bg-white hover:border-[#243C4E]"
                }`}
              >
                <h2 className="text-[20px] font-medium leading-none text-black">
                  {item.title}
                </h2>

                <p className="mt-2 text-[16px] leading-none text-black">
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

export default Step05AccommodationType;