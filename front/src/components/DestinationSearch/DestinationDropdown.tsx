import DestinationCard from "../Destinations/DestinationCard";
import type { Destination } from "../../types/destionation";


interface Props {
    destinations: Destination[];
    recent: Destination[];
}

const DestinationDropdown = ({
    destinations,
    recent
}: Props) => {


    return (

        <div
            className="
            absolute
            top-full
            left-0
            mt-3
            w-[607px]
            bg-white
            rounded-2xl
            shadow-2xl
            p-5
            z-50
            "
        >

            {
                recent.length > 0 && (

                    <>
                        <h2 className="
                        font-bold
                        text-lg
                        mb-4
                        ">
                            Ви нещодавно шукали:
                        </h2>

                        <div className="mb-6">
                            {
                                recent.map(item => (
                                    <DestinationCard
                                        key={item.id}
                                        destination={item}
                                    />
                                ))
                            }
                        </div>
                    </>
                )
            }

            <h2 className="
            font-bold
            text-lg
            mb-4
            ">
                Популярні напрямки:
            </h2>

            <div>
                {
                    destinations.map(item => (
                        <DestinationCard
                            key={item.id}
                            destination={item}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default DestinationDropdown;