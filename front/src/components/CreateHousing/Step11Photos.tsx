import {
  type ChangeEvent,
  type DragEvent,
  useRef,
  useState,
} from "react";
import { ImagePlus, MoreHorizontal, Upload, X } from "lucide-react";

import HousingRegistrationLayout from "./HousingRegistrationLayout";
import {
  type HousingRegistrationPhoto,
  useHousingRegistration,
} from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

const MIN_PHOTOS = 5;
const MAX_PHOTOS = 15;

const Step11Photos = () => {
  const navigate = useLocalizedNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { photos, setPhotos } = useHousingRegistration();

  const [isDragging, setIsDragging] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState("");

  const editingPhoto =
    photos.find((photo) => photo.id === editingPhotoId) ?? null;

  const canContinue = photos.length >= MIN_PHOTOS;

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (!imageFiles.length) return;

    setPhotos((current) => {
      const remaining = MAX_PHOTOS - current.length;

      if (remaining <= 0) return current;

      const nextPhotos: HousingRegistrationPhoto[] = imageFiles
        .slice(0, remaining)
        .map((file) => ({
          id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
          file,
          previewUrl: URL.createObjectURL(file),
          description: "",
        }));

      return [...current, ...nextPhotos];
    });
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    if (
      event.relatedTarget &&
      event.currentTarget.contains(event.relatedTarget as Node)
    ) {
      return;
    }

    setIsDragging(false);
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setIsDragging(false);

    addFiles(Array.from(event.dataTransfer.files));
  };

  const handleRemove = (id: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);

      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((photo) => photo.id !== id);
    });

    if (editingPhotoId === id) {
      setEditingPhotoId(null);
      setDraftDescription("");
    }
  };

  const openPhotoEditor = (
    photo: HousingRegistrationPhoto
  ) => {
    setEditingPhotoId(photo.id);
    setDraftDescription(photo.description);
  };

  const closePhotoEditor = () => {
    setEditingPhotoId(null);
    setDraftDescription("");
  };

  const savePhotoDescription = () => {
    if (!editingPhotoId) return;

    setPhotos((current) =>
      current.map((photo) =>
        photo.id === editingPhotoId
          ? {
              ...photo,
              description: draftDescription.trim(),
            }
          : photo
      )
    );

    closePhotoEditor();
  };

  const handleBack = () => {
    navigate("/housing/register/amenities");
  };

  const handleNext = () => {
    if (!canContinue) return;

    navigate("/housing/register/title");
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const UploadTile = ({
    large = false,
  }: {
    large?: boolean;
  }) => (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center rounded-[10px] border border-dashed transition ${
        isDragging
          ? "border-[#243C4E] bg-[#F2F7FA]"
          : "border-[#9AA6AE] bg-white"
      } ${
        large
          ? "min-h-[330px] w-full px-6 py-10"
          : "min-h-[220px] w-full px-5 py-6"
      }`}
    >
      <ImagePlus
        size={large ? 46 : 34}
        strokeWidth={1.6}
        className="text-[#243C4E]"
      />

      <p
        className={`mt-4 text-center font-medium text-black ${
          large ? "text-[20px]" : "text-[16px]"
        }`}
      >
        Перетягніть файли сюди
      </p>

      <p className="mt-1 text-center text-[13px] text-[#7D8790]">
        або виберіть фото з пристрою
      </p>

      <button
        type="button"
        onClick={openFilePicker}
        className="mt-5 flex items-center gap-2 rounded-[7px] bg-[#243C4E] px-5 py-3 text-[14px] font-medium text-white transition hover:bg-[#1D3241]"
      >
        <Upload size={17} strokeWidth={2} />
        Вибрати з пристрою
      </button>
    </div>
  );

  const PhotoMenuButton = ({
    photo,
    large = false,
  }: {
    photo: HousingRegistrationPhoto;
    large?: boolean;
  }) => (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        openPhotoEditor(photo);
      }}
      className={`absolute flex items-center justify-center rounded-full border border-white/60 bg-[#65747D]/70 text-white backdrop-blur-sm transition hover:bg-[#53626B]/85 ${
        large
          ? "right-4 top-4 h-[46px] w-[46px]"
          : "right-3 top-3 h-9 w-9"
      }`}
      aria-label="Редагувати фото"
    >
      <MoreHorizontal
        size={large ? 24 : 19}
        strokeWidth={1.8}
      />
    </button>
  );

  return (
    <>
      <HousingRegistrationLayout
        step={2}
        progress={30}
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!canContinue}
      >
        <section className="w-full max-w-[818px]">
          <div className="mb-6">
            <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
              {photos.length
                ? "Галерея вашого помешкання"
                : "Додайте фотографії вашого помешкання"}
            </h1>

            <p className="mt-2 max-w-[760px] text-[16px] leading-[1.5] text-[#616D75]">
              Завантажте щонайменше {MIN_PHOTOS} фотографій, щоб
              продовжити. Перше фото у списку стане головною
              обкладинкою.
            </p>

            <p className="mt-1 text-[13px] text-[#7D8790]">
              {photos.length} / {MAX_PHOTOS} фото
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {photos.length === 0 ? (
            <UploadTile large />
          ) : (
            <div className="space-y-3">
              <div
                className="relative cursor-pointer overflow-hidden rounded-[10px]"
                onClick={() => openPhotoEditor(photos[0])}
              >
                <img
                  src={photos[0].previewUrl}
                  alt="Головне фото помешкання"
                  className="h-[420px] w-full object-cover"
                />

                <span className="absolute left-4 top-4 rounded-[10px] border border-white/60 bg-[#ADB3B7]/50 px-[10px] py-[8px] text-[18px] font-normal text-white backdrop-blur-sm">
                  Обкладинка
                </span>

                <PhotoMenuButton
                  photo={photos[0]}
                  large
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {photos.slice(1).map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative cursor-pointer overflow-hidden rounded-[10px]"
                    onClick={() => openPhotoEditor(photo)}
                  >
                    <img
                      src={photo.previewUrl}
                      alt={`Фото помешкання ${index + 2}`}
                      className="h-[220px] w-full object-cover"
                    />

                    <PhotoMenuButton photo={photo} />
                  </div>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <UploadTile />
                )}
              </div>
            </div>
          )}

          {!canContinue && photos.length > 0 && (
            <p className="mt-4 text-[13px] text-[#7D8790]">
              Додайте ще {MIN_PHOTOS - photos.length} фото, щоб
              перейти далі.
            </p>
          )}
        </section>
      </HousingRegistrationLayout>

      {editingPhoto && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePhotoEditor();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-editor-title"
            className="w-full max-w-[900px] overflow-hidden rounded-[12px] bg-white shadow-2xl"
          >
            <div className="relative px-7 pb-5 pt-6 text-center">
              <h2
                id="photo-editor-title"
                className="text-[20px] font-medium text-black"
              >
                Редагування фото
              </h2>

              <button
                type="button"
                onClick={closePhotoEditor}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-[#9AA3A9] transition hover:bg-[#F3F5F6] hover:text-black"
                aria-label="Закрити"
              >
                <X size={22} strokeWidth={1.7} />
              </button>
            </div>

            <div className="grid gap-8 px-7 pb-7 md:grid-cols-[1.15fr_0.85fr]">
              <img
                src={editingPhoto.previewUrl}
                alt="Фото для редагування"
                className="h-[330px] w-full rounded-[10px] object-cover"
              />

              <div>
                <h3 className="text-[18px] font-medium text-black">
                  Опис фотографії
                </h3>

                <p className="mt-1 text-[13px] leading-[1.4] text-[#616D75]">
                  Коротко розкажіть, що зображено на фото та чим це
                  місце особливе.
                </p>

                <textarea
                  value={draftDescription}
                  onChange={(event) =>
                    setDraftDescription(
                      event.target.value.slice(0, 300)
                    )
                  }
                  rows={7}
                  maxLength={300}
                  className="mt-5 w-full resize-none rounded-[8px] border border-[#7D8790] px-4 py-3 text-[16px] text-black outline-none transition focus:border-[#243C4E] focus:ring-1 focus:ring-[#243C4E]"
                />

                <p className="mt-1 text-right text-[12px] text-[#8A949B]">
                  {draftDescription.length}/300
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#D9DDE0] px-7 py-5">
              <button
                type="button"
                onClick={() =>
                  handleRemove(editingPhoto.id)
                }
                className="rounded-[7px] px-2 py-2 text-[16px] font-medium text-[#616D75] transition hover:text-[#B42318]"
              >
                Видалити фото
              </button>

              <button
                type="button"
                onClick={savePhotoDescription}
                className="min-w-[140px] rounded-[7px] bg-[#243C4E] px-6 py-3 text-[16px] font-semibold text-white transition hover:bg-[#1D3241]"
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step11Photos;
