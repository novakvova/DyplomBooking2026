import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getMediaUrl } from "../../api/client";

export interface LightboxPhoto {
  id: number;
  filePath: string;
  originalName?: string;
  isMain?: boolean;
}

interface HousingPhotoLightboxProps {
  photos: LightboxPhoto[];
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onChange: (index: number) => void;
}

const HousingPhotoLightbox = ({
  photos,
  activeIndex,
  isOpen,
  onClose,
  onChange,
}: HousingPhotoLightboxProps) => {
  const photosCount = photos.length;

  const previous = () => {
    if (!photosCount) return;

    onChange(
      activeIndex === 0
        ? photosCount - 1
        : activeIndex - 1
    );
  };

  const next = () => {
    if (!photosCount) return;

    onChange(
      activeIndex === photosCount - 1
        ? 0
        : activeIndex + 1
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        previous();
      }

      if (event.key === "ArrowRight") {
        next();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isOpen,
    activeIndex,
    photosCount,
    onClose,
    onChange,
  ]);

  if (
    !isOpen ||
    !photosCount ||
    !photos[activeIndex]
  ) {
    return null;
  }

  const activePhoto = photos[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Галерея фотографій житла"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex h-[72px] shrink-0 items-center justify-between px-4 sm:px-8">
        <div className="rounded-full bg-white/10 px-4 py-2 text-[14px] font-medium text-white">
          {activeIndex + 1} / {photosCount}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Закрити галерею"
        >
          <X
            size={25}
            strokeWidth={1.8}
          />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 py-4 sm:px-24">
        {photosCount > 1 && (
          <button
            type="button"
            onClick={previous}
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#243C4E] shadow transition hover:bg-white sm:left-8"
            aria-label="Попереднє фото"
          >
            <ChevronLeft
              size={28}
              strokeWidth={1.8}
            />
          </button>
        )}

        <img
          src={getMediaUrl(
            activePhoto.filePath
          )}
          alt={
            activePhoto.originalName ||
            `Фото помешкання ${activeIndex + 1}`
          }
          className="max-h-full max-w-full select-none object-contain"
          draggable={false}
        />

        {photosCount > 1 && (
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#243C4E] shadow transition hover:bg-white sm:right-8"
            aria-label="Наступне фото"
          >
            <ChevronRight
              size={28}
              strokeWidth={1.8}
            />
          </button>
        )}
      </div>

      {photosCount > 1 && (
        <div className="shrink-0 border-t border-white/10 px-4 py-4 sm:px-8">
          <div className="mx-auto flex max-w-[1100px] gap-2 overflow-x-auto pb-1">
            {photos.map(
              (photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() =>
                    onChange(index)
                  }
                  className={`h-[70px] w-[96px] shrink-0 overflow-hidden rounded-[7px] border-2 transition ${
                    activeIndex === index
                      ? "border-white opacity-100"
                      : "border-transparent opacity-55 hover:opacity-90"
                  }`}
                  aria-label={`Відкрити фото ${index + 1}`}
                >
                  <img
                    src={getMediaUrl(
                      photo.filePath
                    )}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HousingPhotoLightbox;
