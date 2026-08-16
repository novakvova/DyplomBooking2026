import { useState } from "react";

interface DropdownOption {
  title: string;
  icon: string;
}

interface DropdownProfileModalProps {
  title?: string;
  options: DropdownOption[];
  onSelect: (item: DropdownOption) => void;
}

const DropdownProfileModal = ({
  title = "Оберіть",
  options,
  onSelect,
}: DropdownProfileModalProps) => {

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(title);

  const handleSelect = (option: DropdownOption) => {
    //setSelected(option.title); // Uncomment this line if you want to update the selected option in the button text
    setOpen(false);
    onSelect(option);
  };

  return (
    <div className="relative w-64">


      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          justify-between
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          text-sm
          text-slate-700
          hover:bg-slate-50
          transition
          font-bold
        "
      >
        {selected}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            z-50
            mt-2
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-xl
            overflow-hidden
          "
        >

          {options.map((option) => (
            <button
              key={option.title}
              onClick={() => handleSelect(option)}
              className="
                flex
                items-center
                gap-3
                w-full
                px-4
                py-3
                text-left
                text-sm
                text-slate-700
                hover:bg-slate-100
                transition
              "
            >

              <img
                src={option.icon}
                alt=""
                className="w-5 h-5"
              />

              <span>
                {option.title}
              </span>

            </button>
          ))}
        </div>
      )}
    </div>
  );
};


export default DropdownProfileModal;