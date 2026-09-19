import { useCurrency } from "../../../hooks/useCurrency";
import PriceRangeFilter from "../../HousingList/PriceRangeFilter";

interface Filters {
  search: string;
  minPrice: string;
  maxPrice: string;
  categories: string[];
  duration: string[];
}

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  priceRange: {
    max: number;
    step: number;
    histogram: any[];
  };
  excursionFilters?: {
    categories: string[];
    durations: string[];
  };
}

interface FilterGroupProps {
  title: string;
  items: string[];
  values: string[];
  onChange: (value: string) => void;
}

const ExcursionFilters = ({
  filters,
  setFilters,
  priceRange,
  excursionFilters,
}: Props) => {
  const { currencyCode } = useCurrency();

  const toggle = (
    field: keyof Filters,
    value: string
  ) => {
    setFilters((prev) => {
      const current = prev[field] as string[];

      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((x) => x !== value)
          : [...current, value],
      };
    });
  };

  return (
    <aside>
      <h3 className="mb-3 font-bold">
        Пошук
      </h3>

      <input
        value={filters.search}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            search: e.target.value,
          }))
        }
        placeholder="Назва екскурсії"
        className="mb-6 h-[42px] w-full rounded border px-3"
      />

      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        rangeMax={priceRange.max}
        step={priceRange.step}
        histogram={priceRange.histogram}
        currencyCode={currencyCode}
        onMinChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            minPrice: value,
          }))
        }
        onMaxChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            maxPrice: value,
          }))
        }
      />

      <FilterGroup
        title="Категорія"
        items={excursionFilters?.categories ?? []}
        values={filters.categories}
        onChange={(v) =>
          toggle("categories", v)
        }
      />

      <FilterGroup
        title="Тривалість"
        items={excursionFilters?.durations ?? []}
        values={filters.duration}
        onChange={(v) =>
          toggle("duration", v)
        }
      />
    </aside>
  );
};


const FilterGroup = ({
  title,
  items,
  values,
  onChange,
}: FilterGroupProps) => (
  <div className="mb-6">
    <h3 className="mb-3 font-bold">
      {title}
    </h3>

    <div className="space-y-2">
      {items.map((item) => (
        <label
          key={item}
          className="flex gap-2 text-sm"
        >
          <input
            type="checkbox"
            checked={values.includes(item)}
            onChange={() => onChange(item)}
          />

          {item}
        </label>
      ))}
    </div>
  </div>
);


export default ExcursionFilters;