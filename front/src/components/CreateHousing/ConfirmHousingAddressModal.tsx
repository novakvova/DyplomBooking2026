interface ConfirmHousingAddressModalProps {
  isOpen: boolean;
  address: string;
  onEdit: () => void;
  onConfirm: () => void;
}

const ConfirmHousingAddressModal = ({
  isOpen,
  address,
  onEdit,
  onConfirm,
}: ConfirmHousingAddressModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-[710px] rounded-[4px] border border-[#1797FF] bg-white px-4 pb-3 pt-7 shadow-xl">
        <button
          type="button"
          onClick={onEdit}
          className="absolute left-4 top-4 text-[24px] leading-none text-slate-400 transition hover:text-slate-700"
        >
          ×
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#355872] text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5.5 10.5V20h13v-9.5" />
            </svg>
          </div>

          <h2 className="mt-4 text-[20px] font-semibold text-black">
            Адресу вказано правильно?
          </h2>

          <p className="mt-1 text-[12px] text-slate-600">
            {address}
          </p>
        </div>

        <div className="mt-4 border-t border-slate-300 pt-3">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onEdit}
              className="px-3 py-2 text-[14px] font-medium text-[#616D75] transition hover:text-black"
            >
              Редагувати адресу
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="rounded-[6px] bg-[#243C4E] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#1d3241]"
            >
              Так, адреса правильна
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmHousingAddressModal;