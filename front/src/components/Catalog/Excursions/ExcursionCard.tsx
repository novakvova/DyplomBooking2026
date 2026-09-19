import { useCurrency } from "../../../hooks/useCurrency";

import type { Excursion } from "../../../types/excursion";


interface Props {
  excursion: Excursion;
  onOpen: () => void;
}


const ExcursionCard = ({
  excursion,
  onOpen,
}: Props) => {

  const { convert, currencyCode } = useCurrency();

  const price = convert(excursion.price);


  return (
    <article className="
      overflow-hidden
      rounded-[16px]
      border
      border-[#6D7B85]
      bg-white
      transition
      hover:shadow-xl
    ">

      <button
        type="button"
        onClick={onOpen}
        className="block h-[220px] w-full overflow-hidden"
      >

        {excursion.imagePath ? (

          <img
            src={excursion.imagePath}
            alt={excursion.title}
            className="
              h-full
              w-full
              object-cover
              transition
              hover:scale-105
            "
          />

        ) : (

          <div className="
            flex
            h-full
            items-center
            justify-center
            text-slate-400
          ">
            Немає фото
          </div>

        )}

      </button>


      <div className="p-4">

        <h3 className="
          truncate
          text-xl
          font-semibold
        ">
          {excursion.title}
        </h3>


        <p className="mt-1 text-sm text-[#355F7D]">
          📍 {excursion.city}
        </p>


        <div className="
          mt-4
          text-sm
          text-slate-600
        ">

          ⏱ {excursion.durationHours} год.

          <br />

          👥 до {excursion.maxGuests} людей

        </div>


        <div className="
          mt-5
          text-xl
          font-bold
          text-[#253C4D]
        ">
          {price} {currencyCode}
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
            hover:bg-[#294E68]
          "
        >
          Детальніше
        </button>


      </div>

    </article>
  );
};


export default ExcursionCard;