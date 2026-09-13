import { getMediaUrl } from "../../api/client";

interface Props {
  images: string[];
}

const EmptyFolderIcon = () => (
  <svg
    width="150"
    height="150"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-slate-400"
  >
    {/* Задня картка */}
    <rect
      x="10"
      y="18"
      width="31"
      height="31"
      rx="3"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
    />

    {/* Передня картка — білий фон перекриває задню */}
    <rect
      x="21"
      y="10"
      width="31"
      height="31"
      rx="3"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
    />

    {/* Сонце */}
    <circle
      cx="33"
      cy="20"
      r="3.5"
      stroke="currentColor"
      strokeWidth="2"
    />

    {/* Гори */}
    <path
      d="M24 37L33 28L39 34L43 30L51 38"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FolderPreviewGrid = ({ images }: Props) => {
  // Порожня папка.
  if (images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <EmptyFolderIcon />
      </div>
    );
  }

  // Перетворюємо шляхи API на повні URL.
  const mediaImages = images.slice(0, 4).map(getMediaUrl);

  // Одне фото.
  if (mediaImages.length === 1) {
    return (
      <img
        src={mediaImages[0]}
        alt=""
        className="h-full w-full object-cover"
      />
    );
  }

  // Два фото.
  if (mediaImages.length === 2) {
    return (
      <div className="grid h-full w-full grid-cols-2 gap-2">
        {mediaImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt=""
            className="h-full w-full object-cover"
          />
        ))}
      </div>
    );
  }

  // Три фото.
  if (mediaImages.length === 3) {
    return (
      <div className="grid h-full w-full grid-cols-2 gap-2">
        <img
          src={mediaImages[0]}
          alt=""
          className="h-full w-full object-cover"
        />

        <div className="grid grid-rows-2 gap-0.5">
          {mediaImages.slice(1).map((image, index) => (
            <img
              key={index}
              src={image}
              alt=""
              className="h-full w-full object-cover"
            />
          ))}
        </div>
      </div>
    );
  }

  // Чотири або більше фото — показуємо тільки перші 4.
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
      {mediaImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt=""
          className="h-full w-full object-cover"
        />
      ))}
    </div>
  );
};

export default FolderPreviewGrid;