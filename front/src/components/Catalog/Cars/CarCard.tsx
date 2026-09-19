import { getMediaUrl } from "../../../api/client";
import { useCurrency } from "../../../hooks/useCurrency";

import type { Car } from "../../../types/car";

interface Props {
  car: Car;
  onOpen: () => void;
}

const CarCard = ({ car, onOpen }: Props) => {
  const { convert, currencyCode } = useCurrency();

  const price = convert(car.pricePerDay);

  return (
    <article className="overflow-hidden rounded-[16px] border border-[#6D7B85] bg-white transition hover:shadow-xl">

      <button
        type="button"
        onClick={onOpen}
        className="block h-[220px] w-full overflow-hidden"
      >
        {car.imagePath ? (
          <img
            src={getMediaUrl(car.imagePath)}
            alt={car.title}
            className="h-full w-full object-cover transition hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Немає фото
          </div>
        )}
      </button>


      <div className="p-4">

        <h3 className="truncate text-xl font-semibold text-[#101820]">
          {car.brand} {car.model}
        </h3>


        <p className="mt-1 text-sm text-[#355F7D]">
          📍 {car.city}
        </p>


        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">

          <span>
            🚗 {car.transmission}
          </span>

          <span>
            ⛽ {car.fuelType}
          </span>

          <span>
            👥 {car.seats} місць
          </span>

          <span>
            📅 {car.year}
          </span>

        </div>


        <div className="mt-5 text-xl font-bold text-[#253C4D]">
          {price} {currencyCode}
          <span className="ml-1 text-sm font-normal">
            / день
          </span>
        </div>


        <button
          onClick={onOpen}
          className="
            mt-4
            h-[42px]
            w-full
            rounded-[7px]
            bg-[#355F7D]
            text-white
            transition
            hover:bg-[#294E68]
          "
        >
          Забронювати
        </button>

      </div>

    </article>
  );
};

export default CarCard;