import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { uk } from "date-fns/locale";
import "react-day-picker/style.css";


interface DatePickerProps {
  selected: DateRange | undefined;
  setSelected: (range: DateRange | undefined) => void;
  calendarMode: "calendar" | "flexible";
  setCalendarMode: (mode: "calendar" | "flexible") => void;
}


const DatePicker = ({ selected, setSelected, calendarMode, setCalendarMode }: DatePickerProps) => {

  return (
    <div className="
        absolute
        z-50
        bg-white
        rounded-2xl
        shadow-2xl
        p-6
        w-[700px]
      ">

      <div className="
        flex
        bg-[#385b75]
        rounded-lg
        overflow-hidden
        mb-6
      ">

        <button
          onClick={() => setCalendarMode("calendar")}
          className={`
          flex-1
          py-3
          text-white
          ${calendarMode === "calendar"
              ? "bg-[#7892a6]"
              : ""
            }
        `}
        >
          Календар
        </button>


        <button
          onClick={() => setCalendarMode("flexible")}
          className={`
          flex-1
          py-3
          text-white
          ${calendarMode === "flexible"
              ? "bg-[#7892a6]"
              : ""
            }
        `}
        >
          Гнучкий графік
        </button>

      </div>


      <h3 className="font-bold mb-4">
        Коли ви плануєте подорожувати
      </h3>


      {calendarMode === "calendar" && (

        <DayPicker
          mode="range"
          selected={selected}
          onSelect={setSelected}
          locale={uk}
          numberOfMonths={2}
          pagedNavigation
        />

      )}

      {calendarMode === "flexible" && (

        <div>

          <h3 className="font-bold mb-4">
            На який термін ви хочете зупинитися
          </h3>


          <div className="flex gap-3 mb-8">

            {["Вихідні", "Тиждень", "Місяць"].map(item => (

              <button
                key={item}
                className="
          px-6
          py-2
          rounded-lg
          border
          border-slate-400
          hover:bg-slate-100
        "
              >
                {item}
              </button>

            ))}

          </div>



          <h3 className="font-bold">
            Коли ви плануєте подорожувати
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Виберіть до 3 місяців
          </p>


          <div className="flex gap-3 items-center">

            {[
              "лип.\n2026",
              "серп.\n2026",
              "вер.\n2026",
              "жовт.\n2026",
              "лист.\n2026",
              "груд.\n2026"
            ].map(month => (

              <button
                key={month}
                className="
          w-24
          h-24
          bg-[#7892a6]
          rounded-lg
          text-center
          text-sm
          whitespace-pre-line
          hover:bg-[#385b75]
          hover:text-white
          transition
        "
              >

                <div className="text-2xl">
                  🗓
                </div>

                {month}

              </button>

            ))}


            <button className="text-5xl">
              ›
            </button>

          </div>


        </div>

      )}


      <button
        className="
          mt-5
          w-full
          bg-[#385b75]
          text-white
          py-3
          rounded-lg
          font-semibold
          "
        >
        Вибрати
      </button>

    </div>
  );
};


export default DatePicker;