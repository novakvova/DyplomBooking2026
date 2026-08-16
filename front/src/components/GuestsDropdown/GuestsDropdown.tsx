//import { useState } from "react";

interface Guests {
    adults: number;
    children: number;
    babies: number;
    pets: number;
    rooms: number;
}

interface Props {
    guests: Guests;
    setGuests: React.Dispatch<React.SetStateAction<Guests>>;
}

const GuestsDropdown = ({
    guests,
    setGuests
}: Props) => {

    const updateCount = (
    key: keyof Guests,
    value: number
    ) => {

    setGuests(prev => {
        const newValue = prev[key] + value;

        // Дорослі мінімум 1
        if (
        key === "adults" &&
        newValue < 1
        ) {
        return prev;
        }

        return {
        ...prev,
        [key]: Math.max(0, newValue)
        };
    });
    };


    const items = [
        {
            key: "adults",
            title: "Дорослі",
            subtitle: "Вік: від 18р."
        },
        {
            key: "children",
            title: "Діти",
            subtitle: "Вік: 2–12р."
        },
        {
            key: "babies",
            title: "Немовлята",
            subtitle: "До 2"
        },
        {
            key: "pets",
            title: "Домашні тварини",
            subtitle: "Подорожуєте із твариною-помічником?"
        },
        {
            key: "rooms",
            title: "Номери",
            subtitle: ""
        }
    ];


    return (
        <div
            className="
            absolute
            top-full
            right-0
            mt-3
            w-[360px]
            bg-white
            rounded-2xl
            shadow-2xl
            p-6
            z-50
            "
        >

            {
                items.map(item => (

                    <div
                        key={item.key}
                        className="
                        flex
                        justify-between
                        items-center
                        mb-6
                        "
                    >

                        <div>
                            <h3 className="
                                font-medium
                                text-lg
                                text-slate-900
                                ">
                                {item.title}
                            </h3>

                            <p className="
                                text-sm
                                text-slate-500
                                ">
                                {item.subtitle}
                            </p>
                        </div>

                        <div
                            className="
                            flex
                            items-center
                            gap-3
                            border
                            border-slate-300
                            rounded-lg
                            px-2
                            py-1
                            "
                        >

                            <button
                                onClick={() =>
                                    updateCount(
                                        item.key as keyof Guests,
                                        -1
                                    )
                                }
                                className="text-lg"
                            >
                                −
                            </button>

                            <span className="w-5 text-center">
                                {guests[item.key as keyof Guests]}
                            </span>

                            <button
                                onClick={() =>
                                    updateCount(
                                        item.key as keyof Guests,
                                        1
                                    )
                                }
                                className="text-lg"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default GuestsDropdown;