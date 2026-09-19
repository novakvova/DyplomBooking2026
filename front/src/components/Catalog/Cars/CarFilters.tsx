import { useCurrency } from "../../../hooks/useCurrency";
import PriceRangeFilter from "../../HousingList/PriceRangeFilter";

interface Filters {
  search: string;
  minPrice: string;
  maxPrice: string;
  brands: string[];
  transmissions: string[];
  fuelTypes: string[];
  seats: string[];
}

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  priceRange: {
    max: number;
    step: number;
    histogram: any[];
  };
  carFilters?: {
    brands: string[];
    transmissions: string[];
    fuelTypes: string[];
    seats: number[];
  };
}


const CarFilters = ({
  filters,
  setFilters,
  priceRange,
  carFilters,
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

      <h3 className="mb-3 text-[15px] font-bold">
        Пошук за назвою
      </h3>

      <input
        value={filters.search}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            search: e.target.value,
          }))
        }
        placeholder="Марка або модель"
        className="mb-6 h-[42px] w-full rounded border px-3"
      />


      <h3 className="mb-3 text-[15px] font-bold">
        Бюджет
      </h3>

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
        title="Марка"
        items={carFilters?.brands ?? []}
        values={filters.brands}
        onChange={(v) =>
          toggle("brands", v)
        }
      />


      <FilterGroup
        title="Коробка передач"
        items={carFilters?.transmissions ?? []}
        values={filters.transmissions}
        onChange={(v) =>
          toggle("transmissions", v)
        }
      />


      <FilterGroup
        title="Паливо"
        items={carFilters?.fuelTypes ?? []}
        values={filters.fuelTypes}
        onChange={(v) =>
          toggle("fuelTypes", v)
        }
      />


      <FilterGroup
        title="Кількість місць"
        items={
          carFilters?.seats.map(String) ?? []
        }
        values={filters.seats}
        onChange={(v) =>
          toggle("seats", v)
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
}: {
  title: string;
  items: string[];
  values: string[];
  onChange: (value: string) => void;
}) => (
  <div className="mb-6">

    <h3 className="mb-3 text-[15px] font-bold">
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


export default CarFilters;