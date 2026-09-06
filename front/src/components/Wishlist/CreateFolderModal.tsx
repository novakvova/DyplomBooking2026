import { useEffect, useState, type FormEvent } from "react";

import type { CreateWishlistFolderRequest } from "../../types/wishlist";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateWishlistFolderRequest) => Promise<unknown>;
}

const CreateFolderModal = ({ open, onClose, onCreate }: Props) => {
  const [name, setName] = useState("");

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    await onCreate({ name: trimmedName });
    setName("");
    onClose();
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
        <h2 className="text-xl font-semibold text-slate-900">Новий список</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Назва списку"
            autoFocus
            className="mt-5 w-full rounded-xl border-2 border-slate-900 px-4 py-3 text-base outline-none"
          />

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-700"
            >
              Скасувати
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-xl bg-[#355872] px-5 py-3 font-medium text-white hover:bg-[#29475c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Створити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
