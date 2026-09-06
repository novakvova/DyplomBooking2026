import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import FolderPreviewGrid from "./FolderPreviewGrid";
import WishlistFolderMenu from "./WishlistFolderMenu";

import type { WishlistFolder } from "../../types/wishlist";
import useLocalizedPath from "../../hooks/useLocalizedPath";

interface Props {
  folder: WishlistFolder;
  onRename: () => void;
  onDelete: () => void;
}

const WishlistFolderCard = ({ folder, onRename, onDelete }: Props) => {
  const localizedPath = useLocalizedPath();
  const navigate = useNavigate();
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const folderPath = localizedPath(`/wishlist/${folder.id}`);

  // Очищаємо таймер при демонтажі компонента.
  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, []);

  // Один клік відкриває папку з невеликою затримкою,
  // щоб подвійний клік можна було використати для перейменування.
  const handleNameClick = () => {
    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      navigate(folderPath);
      clickTimer.current = null;
    }, 250);
  };

  // Подвійний клік по назві відкриває перейменування.
  const handleNameDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }

    onRename();
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">
      {/* Прев'ю папки */}
      <div
        className="relative h-64 cursor-pointer"
        onClick={() => navigate(folderPath)}
      >
        <FolderPreviewGrid images={folder.previewImages} />
        <WishlistFolderMenu onRename={onRename} onDelete={onDelete} />
      </div>

      {/* Назва та кількість */}
      <div className="p-4">
        <h3
          onClick={handleNameClick}
          onDoubleClick={handleNameDoubleClick}
          title="Подвійний клік для перейменування"
          className="cursor-text text-lg font-semibold text-slate-800"
        >
          {folder.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {folder.count} помешкань
        </p>
      </div>
    </div>
  );
};

export default WishlistFolderCard;
