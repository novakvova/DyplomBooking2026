import type { Destination } from "../../types/destionation";


interface Props {
  destination: Destination;
}


const DestinationCard = ({ destination }: Props) => {

  return (
    <div
      className="
        flex
        gap-4
        items-center
        cursor-pointer
        hover:bg-gray-50
        rounded-xl
        p-2
      "
    >

      <img
        src={destination.imagePath}
        alt={destination.city}
        className="
          w-16
          h-16
          rounded-xl
          object-cover
        "
      />


      <div>

        <h3 className="font-bold text-lg">
          {destination.city}, {destination.country}
        </h3>


        <p className="text-sm text-gray-600">
          {destination.description}
        </p>

      </div>

    </div>
  );
};


export default DestinationCard;