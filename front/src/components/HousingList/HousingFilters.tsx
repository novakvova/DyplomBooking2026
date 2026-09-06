import type {
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";

import { useCurrency } from "../../hooks/useCurrency";
import {
  AMENITIES,
  POPULAR_FILTERS,
  PROPERTY_TYPES,
} from "./housingList.constants";
import type {
  HousingFilterArrayField,
  HousingFiltersState,
} from "./housingList.types";
import PriceRangeFilter, {
  type PriceHistogramBar,
} from "./PriceRangeFilter";

interface HousingFiltersProps {
  filters: HousingFiltersState;
  setFilters: Dispatch<
    SetStateAction<HousingFiltersState>
  >;
  toggleArrayFilter: (
    field: HousingFilterArrayField,
    value: string
  ) => void;
  onClear: () => void;
  priceRange: {
    max: number;
    step: number;
    histogram: PriceHistogramBar[];
  };
}

const HousingFilters = ({
  filters,
  setFilters,
  toggleArrayFilter,
  onClear,
  priceRange,
}: HousingFiltersProps) => {
  const { currencyCode } = useCurrency();

  return (
    <aside>
      <div className="mb-6 overflow-hidden rounded-[14px]">
        <div className="relative h-[220px]">
          <iframe
            title="Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=18.5%2C49.0%2C24.5%2C54.9&layer=mapnik"
            className="h-full w-full border-0"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
            <span className="rounded bg-white px-4 py-2 text-[13px] font-semibold text-[#355F7D] shadow">
              Показати на карті
            </span>
          </div>
        </div>
      </div>

      <FilterTitle>Пошук за назвою</FilterTitle>

      <input
        type="text"
        value={filters.search}
        onChange={(event) =>
          setFilters((current) => ({
            ...current,
            search: event.target.value,
          }))
        }
        placeholder="Назва"
        className="mb-7 h-[42px] w-full rounded-[5px] border border-slate-300 px-3 text-[14px] outline-none focus:border-[#355F7D]"
      />

      <FilterTitle>
        Фільтрувати за бюджетом:
      </FilterTitle>

      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        rangeMax={priceRange.max}
        step={priceRange.step}
        histogram={priceRange.histogram}
        currencyCode={currencyCode}
        onMinChange={(value) =>
          setFilters((current) => ({
            ...current,
            minPrice: value,
          }))
        }
        onMaxChange={(value) =>
          setFilters((current) => ({
            ...current,
            maxPrice: value,
          }))
        }
      />

      <FilterTitle>
        Популярні фільтри:
      </FilterTitle>

      <div className="mb-8 space-y-2">
        {POPULAR_FILTERS.map((item) => (
          <Checkbox
            key={item}
            label={item}
            checked={
              filters.amenities.includes(item)
            }
            onChange={() =>
              toggleArrayFilter(
                "amenities",
                item
              )
            }
          />
        ))}
      </div>

      <FilterTitle>
        Тип помешкання:
      </FilterTitle>

      <div className="mb-8 space-y-2">
        {PROPERTY_TYPES.map((item) => (
          <Checkbox
            key={item}
            label={item}
            checked={
              filters.types.includes(item)
            }
            onChange={() =>
              toggleArrayFilter(
                "types",
                item
              )
            }
          />
        ))}
      </div>

      <FilterTitle>Зручності:</FilterTitle>

      <div className="mb-8 space-y-2">
        {AMENITIES.map((item) => (
          <Checkbox
            key={item}
            label={item}
            checked={
              filters.amenities.includes(item)
            }
            onChange={() =>
              toggleArrayFilter(
                "amenities",
                item
              )
            }
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-[7px] border border-[#355F7D] px-4 py-2.5 text-[14px] font-semibold text-[#355F7D] transition hover:bg-[#355F7D] hover:text-white"
      >
        Очистити фільтри
      </button>
    </aside>
  );
};

const FilterTitle = ({
  children,
}: {
  children: ReactNode;
}) => (
  <h3 className="mb-3 text-[15px] font-bold text-[#202A31]">
    {children}
  </h3>
);

const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex cursor-pointer items-start gap-2 text-[13px] leading-[18px] text-[#39434A]">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="mt-[2px] h-[14px] w-[14px] accent-[#355F7D]"
    />
    <span>{label}</span>
  </label>
);

export default HousingFilters;
