import type { Destination } from "../../types/destination";

interface DestinationDropdownProps {
  destinations: Destination[];
  recent?: Destination[];
  onSelect: (destination: Destination) => void;
}

const DestinationDropdown = ({
  destinations,
  recent = [],
  onSelect,
}: DestinationDropdownProps) => {
  return (
    <div
      className="
        absolute
        left-0
        top-full
        z-[9999]
        mt-3
        w-[607px]
        max-h-[520px]
        overflow-y-auto
        rounded-2xl
        bg-white
        p-5
        text-slate-900
        shadow-xl
      "
    >
      {/* ───────────────────────────────────── */}
      {/* Нещодавно шукали */}
      {/* ───────────────────────────────────── */}

      {recent.length > 0 && (
        <>
          <h2 className="mb-5 text-xl font-bold">
            Ви нещодавно шукали:
          </h2>

          <div className="mb-6 space-y-2">
            {recent.map((item) => (
              <button
                key={`recent-${item.id}`}
                type="button"
                onClick={() => onSelect(item)}
                className="
                  flex
                  w-full
                  items-center
                  gap-4
                  rounded-xl
                  p-2
                  text-left
                  transition
                  hover:bg-slate-100
                "
              >
                {/* Фото напрямку */}
                <img
                  src={item.imagePath}
                  alt={`${item.city}, ${item.country}`}
                  className="
                    h-20
                    w-20
                    shrink-0
                    rounded-lg
                    object-cover
                  "
                />

                {/* Інформація про напрямок */}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold">
                    {item.city}, {item.country}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ───────────────────────────────────── */}
      {/* Популярні напрямки / результати пошуку */}
      {/* ───────────────────────────────────── */}

      <h2 className="mb-5 text-xl font-bold">
        Популярні напрямки:
      </h2>

      {/* Якщо пошук нічого не повернув */}
      {destinations.length === 0 && (
        <p className="py-5 text-center text-slate-500">
          Нічого не знайдено
        </p>
      )}

      {/* Список напрямків */}
      <div className="space-y-2">
        {destinations.map((item) => (
          <button
            key={`destination-${item.id}`}
            type="button"
            onClick={() => onSelect(item)}
            className="
              flex
              w-full
              items-center
              gap-4
              rounded-xl
              p-2
              text-left
              transition
              hover:bg-slate-100
            "
          >
            {/* Фото напрямку */}
            <img
              src={item.imagePath}
              alt={`${item.city}, ${item.country}`}
              className="
                h-20
                w-20
                shrink-0
                rounded-lg
                object-cover
              "
            />

            {/* Інформація про напрямок */}
            <div className="min-w-0">
              <h3 className="text-lg font-bold">
                {item.city}, {item.country}
              </h3>

              <p className="text-sm text-slate-600">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DestinationDropdown;