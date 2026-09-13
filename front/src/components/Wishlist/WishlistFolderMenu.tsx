import { useEffect, useRef, useState } from "react";

interface Props {
  onRename: () => void;
  onDelete: () => void;
}

const WishlistFolderMenu = ({ onRename, onDelete }: Props) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закриваємо меню при кліку поза ним.
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleRename = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    onRename();
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    onDelete();
  };

  return (
    <div ref={menuRef} className="absolute right-3 top-3 z-20">
      {/* Кнопка меню */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Меню папки"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition hover:bg-slate-50"
      >
        <span className="text-xl leading-none text-slate-700">⋮</span>
      </button>

      {/* Дії папки */}
      {open && (
        <div
          className="absolute right-0 top-12 w-44 overflow-hidden rounded-xl bg-white py-2 shadow-lg"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <button
            type="button"
            onClick={handleRename}
            className="block w-full px-5 py-3 text-left text-slate-800 hover:bg-slate-50"
          >
            Перейменувати
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="block w-full px-5 py-3 text-left text-red-500 hover:bg-slate-50"
          >
            Видалити
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistFolderMenu;
