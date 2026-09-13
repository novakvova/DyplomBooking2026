import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "../../api/api";
import apiClient from "../../api/client";

export interface WishlistFolder {
  id: number;
  name: string;
  count: number;
  previewImages: string[];
}

interface Props {
  open: boolean;
  housingId: number;
  onClose: () => void;
  onSaved: () => void;
}

const WishlistSaveModal = ({ open, housingId, onClose, onSaved }: Props) => {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const { data: folders = [], isLoading } = useQuery<WishlistFolder[]>({
    queryKey: ["wishlist-folders"],
    queryFn: async () => {
      const { data } = await apiClient.get("/wishlistfolder");
      return data;
    },
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;
    setSelectedIds([]);
    setCreateOpen(false);
    setNewFolderName("");
  }, [open]);

  const addMutation = useMutation({
    mutationFn: () => wishlistApi.add(housingId, selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
      onSaved();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const name = newFolderName.trim();
      if (!name) throw new Error("Назва не може бути пустою.");

      const { data } = await apiClient.post("/wishlistfolder", { name });
      return data as WishlistFolder;
    },
    onSuccess: (folder) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-folders"] });
      setSelectedIds((current) => [...current, folder.id]);
      setNewFolderName("");
      setCreateOpen(false);
    },
  });

  if (!open) return null;

  const toggleFolder = (folderId: number) => {
    setSelectedIds((current) =>
      current.includes(folderId)
        ? current.filter((id) => id !== folderId)
        : [...current, folderId]
    );
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[430px] rounded-xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-700"
          aria-label="Закрити"
        >
          <X size={20} />
        </button>

        <h2 className="pr-8 text-xl font-semibold text-[#111820]">
          Зберегти в список
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Оберіть один або кілька списків для цього помешкання.
        </p>

        <div className="mt-5 max-h-[300px] space-y-2 overflow-y-auto">
          {isLoading ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Завантаження...
            </p>
          ) : folders.length > 0 ? (
            folders.map((folder) => {
              const selected = selectedIds.includes(folder.id);

              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => toggleFolder(folder.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                    selected
                      ? "border-[#355872] bg-[#F1F5F7]"
                      : "border-slate-200 hover:border-[#7894A7]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      selected
                        ? "border-[#355872] bg-[#355872] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">
                      {folder.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {folder.count} {getItemLabel(folder.count)}
                    </span>
                  </span>
                </button>
              );
            })
          ) : (
            <div className="rounded-lg bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
              У вас ще немає списків.
            </div>
          )}
        </div>

        {createOpen ? (
          <div className="mt-4 flex gap-2">
            <input
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") createMutation.mutate();
              }}
              autoFocus
              placeholder="Назва списку"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#355872]"
            />
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !newFolderName.trim()}
              className="rounded-lg bg-[#355872] px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              {createMutation.isPending ? "..." : "Створити"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-[#355872] hover:underline"
          >
            <Plus size={17} />
            Створити новий список
          </button>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={() => addMutation.mutate()}
            disabled={selectedIds.length === 0 || addMutation.isPending}
            className="rounded-lg bg-[#355872] px-5 py-2 text-sm font-medium text-white hover:bg-[#29475c] disabled:opacity-50"
          >
            {addMutation.isPending ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      </div>
    </div>
  );
};

const getItemLabel = (count: number) => {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return "помешкань";
  if (last === 1) return "помешкання";
  if (last >= 2 && last <= 4) return "помешкання";
  return "помешкань";
};

export default WishlistSaveModal;
