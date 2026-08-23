import { useTranslation } from "react-i18next";

interface Guests {
  adults: number;
  children: number;
  babies: number;
  pets: number;
  rooms: number;
}

interface Props {
  guests: Guests;
  setGuests: React.Dispatch<
    React.SetStateAction<Guests>
  >;
}

const GuestsDropdown = ({
  guests,
  setGuests,
}: Props) => {
  const { t } = useTranslation();

  const updateCount = (
    key: keyof Guests,
    value: number
  ) => {
    setGuests((prev) => {
      const newValue =
        prev[key] + value;

      // Дорослих має бути мінімум 1.
      if (
        key === "adults" &&
        newValue < 1
      ) {
        return prev;
      }

      return {
        ...prev,
        [key]: Math.max(
          0,
          newValue
        ),
      };
    });
  };

  const items: {
    key: keyof Guests;
    titleKey: string;
    subtitleKey?: string;
  }[] = [
    {
      key: "adults",
      titleKey:
        "guestsDropdown.adults.title",
      subtitleKey:
        "guestsDropdown.adults.subtitle",
    },
    {
      key: "children",
      titleKey:
        "guestsDropdown.children.title",
      subtitleKey:
        "guestsDropdown.children.subtitle",
    },
    {
      key: "babies",
      titleKey:
        "guestsDropdown.babies.title",
      subtitleKey:
        "guestsDropdown.babies.subtitle",
    },
    {
      key: "pets",
      titleKey:
        "guestsDropdown.pets.title",
      subtitleKey:
        "guestsDropdown.pets.subtitle",
    },
    {
      key: "rooms",
      titleKey:
        "guestsDropdown.rooms.title",
    },
  ];

  return (
    <div
      className="
        absolute
        right-0
        top-full
        z-50
        mt-3
        w-[360px]
        rounded-2xl
        bg-white
        p-6
        shadow-2xl
      "
    >
      {items.map((item) => (
        <div
          key={item.key}
          className="
            mb-6
            flex
            items-center
            justify-between
            last:mb-0
          "
        >
          <div>
            <h3
              className="
                text-lg
                font-medium
                text-slate-900
              "
            >
              {t(item.titleKey)}
            </h3>

            {item.subtitleKey && (
              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                {t(
                  item.subtitleKey
                )}
              </p>
            )}
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-lg
              border
              border-slate-300
              px-2
              py-1
            "
          >
            <button
              type="button"
              onClick={() =>
                updateCount(
                  item.key,
                  -1
                )
              }
              className="
                text-lg
                text-slate-700
                transition
                hover:text-slate-950
              "
              aria-label={t(
                "guestsDropdown.decrease"
              )}
            >
              −
            </button>

            <span className="w-5 text-center">
              {guests[item.key]}
            </span>

            <button
              type="button"
              onClick={() =>
                updateCount(
                  item.key,
                  1
                )
              }
              className="
                text-lg
                text-slate-700
                transition
                hover:text-slate-950
              "
              aria-label={t(
                "guestsDropdown.increase"
              )}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuestsDropdown;