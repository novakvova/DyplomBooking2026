import { useEffect, useState } from "react";

import { useWishlistFolders } from "../../hooks/useWishlistFolders";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (folderIds: number[]) => void;
}

const WishlistModal = ({ open, onClose, onSave }: Props) => {
  const { folders, isLoading } = useWishlistFolders();
  const [selected, setSelected] = useState<number[]>([]);

  // При кожному відкритті починаємо з чистого вибору.
  useEffect(() => {
    if (open) setSelected([]);
  }, [open]);

  // Escape закриває модалку.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!selected.length) return;
    onSave(selected);
    setSelected([]);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-slate-900">
          Додати до списку
        </h2>

        <div className="mt-5 space-y-2">
          {isLoading && (
            <p className="py-3 text-sm text-slate-500">Завантаження...</p>
          )}

          {!isLoading && folders.length === 0 && (
            <p className="py-3 text-sm text-slate-500">
              Спочатку створіть список бажань.
            </p>
          )}

          {!isLoading && folders.map((folder) => (
            <label
              key={folder.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(folder.id)}
                onChange={() => toggle(folder.id)}
                className="h-4 w-4"
              />

              <div>
                <p className="font-medium text-slate-800">{folder.name}</p>
                <p className="text-sm text-slate-500">
                  {folder.count} помешкань
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!selected.length || isLoading}
            className="rounded-xl bg-[#355872] px-5 py-2 text-white disabled:opacity-50"
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;
