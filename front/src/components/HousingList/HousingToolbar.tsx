import { PAGE_SIZE_OPTIONS } from "./housingList.constants";
import type { HousingViewMode } from "../../hooks/useHousingList";

interface HousingToolbarProps {
  pageSize: number;
  sort: string;
  viewMode: HousingViewMode;
  onPageSizeChange: (value: number) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (value: HousingViewMode) => void;
}

const HousingToolbar = ({
  pageSize,
  sort,
  viewMode,
  onPageSizeChange,
  onSortChange,
  onViewModeChange,
}: HousingToolbarProps) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#7891A3]">
    <div className="flex gap-8">
      <button
        type="button"
        className="border-b-[3px] border-transparent pb-3 text-[16px] font-medium text-[#5D6870]"
      >
        Перегляд
      </button>

      <button
        type="button"
        className="border-b-[3px] border-[#355F7D] pb-3 text-[16px] font-semibold text-[#355F7D]"
      >
        Повний список помешкань
      </button>
    </div>

    <div className="mb-2 flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-[13px] text-slate-500">
        Показувати:
        <select
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(
              Number(event.target.value)
            )
          }
          className="h-[36px] rounded-[7px] border border-[#355F7D] bg-white px-3 font-medium text-[#355F7D] outline-none"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <select
        value={sort}
        onChange={(event) =>
          onSortChange(event.target.value)
        }
        className="h-[36px] rounded-[7px] bg-[#355F7D] px-5 text-[13px] font-medium text-white outline-none"
      >
        <option value="popular">
          Популярні спочатку
        </option>
        <option value="rating">
          Найвищий рейтинг
        </option>
        <option value="price-low">
          Спочатку дешевші
        </option>
        <option value="price-high">
          Спочатку дорожчі
        </option>
      </select>

      <div className="flex h-[36px] overflow-hidden rounded-[7px] border border-[#355F7D]">
        <button
          type="button"
          onClick={() => onViewModeChange("list")}
          aria-label="Список"
          className={`flex w-[42px] items-center justify-center transition ${
            viewMode === "list"
              ? "bg-[#355F7D] text-white"
              : "bg-white text-[#355F7D] hover:bg-slate-50"
          }`}
        >
          <ListIcon />
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange("grid")}
          aria-label="Плитка"
          className={`flex w-[42px] items-center justify-center transition ${
            viewMode === "grid"
              ? "bg-[#355F7D] text-white"
              : "bg-white text-[#355F7D] hover:bg-slate-50"
          }`}
        >
          <GridIcon />
        </button>
      </div>
    </div>
  </div>
);

const ListIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="4" y="5" width="16" height="3" rx="1" />
    <rect x="4" y="11" width="16" height="3" rx="1" />
    <rect x="4" y="17" width="16" height="3" rx="1" />
  </svg>
);

const GridIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <rect x="14" y="14" width="6" height="6" rx="1" />
  </svg>
);

export default HousingToolbar;