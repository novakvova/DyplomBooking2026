import { PAGE_SIZE_OPTIONS } from "./housingList.constants";

interface HousingToolbarProps {
  pageSize: number;
  sort: string;
  onPageSizeChange: (value: number) => void;
  onSortChange: (value: string) => void;
}

const HousingToolbar = ({
  pageSize,
  sort,
  onPageSizeChange,
  onSortChange,
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
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-[36px] rounded-[7px] border border-[#355F7D] bg-white px-3 font-medium text-[#355F7D] outline-none"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </label>

      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
        className="h-[36px] rounded-[7px] bg-[#355F7D] px-5 text-[13px] font-medium text-white outline-none"
      >
        <option value="popular">Популярні спочатку</option>
        <option value="rating">Найвищий рейтинг</option>
        <option value="price-low">Спочатку дешевші</option>
        <option value="price-high">Спочатку дорожчі</option>
      </select>
    </div>
  </div>
);

export default HousingToolbar;
