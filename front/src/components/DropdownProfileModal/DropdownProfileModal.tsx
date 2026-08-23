import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
  key: string;
  title: string;
  icon: string;
}

interface DropdownProfileModalProps {
  title?: string;
  options: DropdownOption[];
  onSelect: (item: DropdownOption) => void;
  variant?: "hero" | "light";
}

const DropdownProfileModal = ({
  title = "Оберіть",
  options,
  onSelect,
  variant = "light",
}: DropdownProfileModalProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закриваємо меню при кліку поза dropdown.
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Закриваємо меню та виконуємо дію.
  const handleSelect = (option: DropdownOption) => {
    setOpen(false);
    onSelect(option);
  };

  // Стиль кнопки залежить від типу Header.
  const buttonStyle =
    variant === "hero"
      ? open
        ? "border border-[#355872] bg-[#355872] text-white"
        : "border border-white bg-white/10 text-white hover:bg-white/20"
      : open
        ? "border border-[#355872] bg-[#355872] text-white"
        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <div ref={dropdownRef} className="relative z-[1000]">
      {/* Profile button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`
          flex h-[45px] min-w-[107px] items-center justify-center
          rounded-[10px] px-[10px] text-[18px] font-semibold
          transition-all duration-300
          ${buttonStyle}
        `}
      >
        {title}
      </button>

      {/* Profile dropdown */}
      {open && (
        <div
          className="
            absolute right-0 top-full z-[1100] mt-5
            flex w-[313px] flex-col gap-5
            rounded-[20px] border border-white/20
            bg-[#ADB3B7]/20 px-7 py-7
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            backdrop-blur-xl
          "
        >
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => handleSelect(option)}
              className="
                flex w-full items-center gap-4 rounded-lg
                px-2 py-2 text-left text-[18px]
                font-medium text-white
                transition hover:bg-white/10
              "
            >
              <img
                src={option.icon}
                alt=""
                className="
                  pointer-events-none h-6 w-6 shrink-0
                  brightness-0 invert
                "
              />

              <span className="pointer-events-none">
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