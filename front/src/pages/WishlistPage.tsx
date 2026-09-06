import { useState } from "react";
import { Link } from "react-router-dom";

import { useWishlistFolders } from "../hooks/useWishlistFolders";
import useLocalizedPath from "../hooks/useLocalizedPath";

import WishlistFolderCard from "../components/Wishlist/WishlistFolderCard";
import CreateFolderModal from "../components/Wishlist/CreateFolderModal";
import RenameFolderModal from "../components/Wishlist/RenameFolderModal";
import DeleteFolderModal from "../components/Wishlist/DeleteFolderModal";

const WishlistPage = () => {
  const localizedPath = useLocalizedPath();
  const {
    folders,
    isLoading,
    createFolder,
    renameFolder,
    deleteFolder,
    isDeleting,
  } = useWishlistFolders();

  // Стан модалок.
  const [createOpen, setCreateOpen] = useState(false);
  const [renameData, setRenameData] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deleteData, setDeleteData] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Підтвердження видалення папки.
  const handleDelete = async () => {
    if (!deleteData) return;
    await deleteFolder(deleteData.id);
    setDeleteData(null);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Заголовок */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Списки бажань
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Збережені помешкання
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-xl bg-[#355872] px-5 py-3 text-white transition hover:bg-[#29475c]"
          >
            + Новий список
          </button>
        </div>

        {/* Завантаження */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {/* Немає жодної папки */}
        {!isLoading && folders.length === 0 && (
          <div className="mt-8 flex min-h-[450px] flex-col items-center justify-center text-center">
            <img
              src="/images/items/empty_wishlist.png"
              alt="Порожній список бажань"
              className="h-40 w-40 rounded-xl object-cover"
            />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              Поки що тут порожньо
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Додавайте улюблене те, що вам сподобалось
            </p>
            <Link
              to={localizedPath("/housing")}
              className="mt-5 rounded-lg bg-slate-800 px-10 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Знайти житло
            </Link>
          </div>
        )}

        {/* Папки */}
        {!isLoading && folders.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {folders.map((folder) => (
              <WishlistFolderCard
                key={folder.id}
                folder={folder}
                onRename={() =>
                  setRenameData({ id: folder.id, name: folder.name })
                }
                onDelete={() =>
                  setDeleteData({ id: folder.id, name: folder.name })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Створення папки */}
      <CreateFolderModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createFolder}
      />

      {/* Перейменування папки */}
      <RenameFolderModal
        folder={renameData}
        onClose={() => setRenameData(null)}
        onRename={renameFolder}
      />

      {/* Підтвердження видалення папки */}
      <DeleteFolderModal
        open={deleteData !== null}
        folderName={deleteData?.name ?? ""}
        onClose={() => setDeleteData(null)}
        isPending={isDeleting}
        onConfirm={handleDelete}
      />
    </main>
  );
};

export default WishlistPage;
