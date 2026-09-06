interface SearchFieldProps {
  title: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

interface HousingSearchBarProps {
  destination: string;
  dates: string;
  guests: string;
  onDestinationChange: (value: string) => void;
  onDatesChange: (value: string) => void;
  onGuestsChange: (value: string) => void;
}

const SearchField = ({
  title,
  value,
  placeholder,
  onChange,
}: SearchFieldProps) => (
  <label className="flex min-h-[78px] min-w-0 flex-1 flex-col justify-center px-6 py-3">
    <span className="text-[15px] font-semibold text-white">{title}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full bg-transparent text-[15px] text-white/85 outline-none placeholder:text-white/55"
    />
  </label>
);

const Divider = () => (
  <div className="hidden h-[54px] w-px self-center bg-white/70 lg:block" />
);

const SearchIcon = () => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.3-4.3" />
  </svg>
);

const HousingSearchBar = ({
  destination,
  dates,
  guests,
  onDestinationChange,
  onDatesChange,
  onGuestsChange,
}: HousingSearchBarProps) => (
  <section className="bg-[#355872] pb-[36px] pt-[98px]">
    <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col overflow-visible rounded-[18px] bg-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.12)] backdrop-blur-md lg:h-[84px] lg:flex-row">
        <SearchField
          title="Куди?"
          value={destination}
          placeholder="Напрямок маршруту"
          onChange={onDestinationChange}
        />

        <Divider />

        <SearchField
          title="Коли?"
          value={dates}
          placeholder="Дата заїзду – Дата виїзду"
          onChange={onDatesChange}
        />

        <Divider />

        <SearchField
          title="Хто?"
          value={guests}
          placeholder="Кількість осіб"
          onChange={onGuestsChange}
        />

        <div className="flex items-center p-3 lg:px-4">
          <button
            type="button"
            aria-label="Пошук"
            className="flex h-[54px] w-full items-center justify-center rounded-[10px] bg-[#2C4A60] text-white transition hover:bg-[#243C4E] lg:w-[82px]"
          >
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default HousingSearchBar;
