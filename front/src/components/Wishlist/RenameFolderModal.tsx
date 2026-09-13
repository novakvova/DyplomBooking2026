import { useEffect, useState, type FormEvent } from "react";

interface Props {
  folder: { id: number; name: string } | null;
  onClose: () => void;
  onRename: (data: { id: number; name: string }) => Promise<unknown> | void;
}

const RenameFolderModal = ({ folder, onClose, onRename }: Props) => {
  const [name, setName] = useState("");

  // Заповнюємо input поточною назвою папки.
  useEffect(() => {
    if (folder) setName(folder.name);
  }, [folder]);

  // Escape закриває модалку.
  useEffect(() => {
    if (!folder) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [folder, onClose]);

  if (!folder) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    await onRename({ id: folder.id, name: trimmedName });
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
        <h2 className="text-xl font-semibold text-slate-900">
          Перейменувати список
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            className="mt-5 w-full rounded-xl border-2 border-slate-900 px-4 py-3 outline-none"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              Скасувати
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-xl bg-[#355872] px-5 py-2 text-white hover:bg-[#29475c] disabled:opacity-50"
            >
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameFolderModal;
