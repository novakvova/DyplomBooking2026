import { useEffect } from "react";

interface Props {
  open: boolean;
  folderName: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteFolderModal = ({
  open,
  folderName,
  isPending = false,
  onClose,
  onConfirm,
}: Props) => {
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

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[400px] rounded-xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute right-3 top-3 text-2xl leading-none text-slate-400 hover:text-slate-700 disabled:opacity-50"
          aria-label="Закрити"
        >
          ×
        </button>

        <h2 className="pr-6 text-center text-lg font-semibold text-slate-900">
          Видалити цей список обраного?
        </h2>

        <p className="mx-auto mt-2 max-w-[280px] text-center text-xs leading-4 text-slate-500">
          Список обраного буде остаточно видалено разом із помешканнями в ньому.
        </p>

        <p className="mt-2 text-center text-sm font-medium text-slate-700">
          «{folderName}»
        </p>

        <div className="mt-5 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg bg-[#355872] px-4 py-2 text-sm font-medium text-white hover:bg-[#29475c] disabled:opacity-60"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300 disabled:opacity-60"
          >
            {isPending ? "Видалення..." : "Видалити"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderModal;
