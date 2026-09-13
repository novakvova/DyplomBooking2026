import type { ChangeEvent } from "react";

export interface PriceHistogramBar {
  count: number;
  height: number;
}

interface PriceRangeFilterProps {
  minPrice: string;
  maxPrice: string;
  rangeMax: number;
  step: number;
  histogram: PriceHistogramBar[];
  currencyCode: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

const clamp = (
  value: number,
  min: number,
  max: number
) => Math.min(Math.max(value, min), max);

const getHousingLabel = (count: number) => {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "помешкань";
  }

  if (last === 1) return "помешкання";
  if (last >= 2 && last <= 4) return "помешкання";

  return "помешкань";
};

const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  rangeMax,
  step,
  histogram,
  currencyCode,
  onMinChange,
  onMaxChange,
}: PriceRangeFilterProps) => {
  const safeMax = Math.max(rangeMax, step);

  const currentMin = clamp(
    Number(minPrice || 0),
    0,
    safeMax
  );

  const currentMax = clamp(
    Number(maxPrice || safeMax),
    currentMin,
    safeMax
  );

  const minPercent =
    (currentMin / safeMax) * 100;

  const maxPercent =
    (currentMax / safeMax) * 100;

  const handleMinSlider = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.min(
      Number(event.target.value),
      currentMax - step
    );

    onMinChange(
      String(Math.max(0, value))
    );
  };

  const handleMaxSlider = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.max(
      Number(event.target.value),
      currentMin + step
    );

    onMaxChange(
      value >= safeMax
        ? ""
        : String(value)
    );
  };

  const handleMinInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const raw = event.target.value;

    if (raw === "") {
      onMinChange("");
      return;
    }

    const value = clamp(
      Number(raw),
      0,
      Math.max(0, currentMax - step)
    );

    onMinChange(String(value));
  };

  const handleMaxInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const raw = event.target.value;

    if (raw === "") {
      onMaxChange("");
      return;
    }

    const value = clamp(
      Number(raw),
      currentMin + step,
      safeMax
    );

    onMaxChange(
      value >= safeMax
        ? ""
        : String(value)
    );
  };

  return (
    <div className="mb-8">
      <div className="mb-3 flex h-[76px] items-end gap-[3px]">
        {histogram.map((bar, index) => {
          const binStart =
            Math.round(
              (index / histogram.length) *
                safeMax
            );

          const binEnd =
            Math.round(
              ((index + 1) /
                histogram.length) *
                safeMax
            );

          return (
            <div
              key={index}
              className="group relative flex h-full flex-1 items-end"
            >
              <div
                className="w-full cursor-help rounded-t-[3px] bg-[#7FC7D5] transition-[height,background-color] duration-200 group-hover:bg-[#58B5C7]"
                style={{
                  height: `${Math.max(
                    14,
                    bar.height
                  )}%`,
                }}
                aria-label={`${bar.count} ${getHousingLabel(
                  bar.count
                )}, ${binStart}–${binEnd} ${currencyCode}`}
              />

              <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#253C4D] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg group-hover:block">
                <div>
                  {bar.count}{" "}
                  {getHousingLabel(bar.count)}
                </div>

                <div className="mt-0.5 text-[10px] font-normal text-white/75">
                  {binStart}–{binEnd}{" "}
                  {currencyCode}
                </div>

                <div className="absolute left-1/2 top-full -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-[#253C4D]" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mb-5 h-5">
        <div className="absolute left-0 right-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#D6E8EC]" />

        <div
          className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#69C2D2]"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        <input
          type="range"
          min={0}
          max={safeMax}
          step={step}
          value={currentMin}
          onChange={handleMinSlider}
          aria-label="Мінімальна ціна"
          className="pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent
            [&::-webkit-slider-runnable-track]:h-[4px]
            [&::-webkit-slider-runnable-track]:bg-transparent
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:mt-[-6px]
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#355F7D]
            [&::-webkit-slider-thumb]:bg-white
            [&::-moz-range-track]:h-[4px]
            [&::-moz-range-track]:bg-transparent
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:cursor-grab
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#355F7D]
            [&::-moz-range-thumb]:bg-white"
        />

        <input
          type="range"
          min={0}
          max={safeMax}
          step={step}
          value={currentMax}
          onChange={handleMaxSlider}
          aria-label="Максимальна ціна"
          className="pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent
            [&::-webkit-slider-runnable-track]:h-[4px]
            [&::-webkit-slider-runnable-track]:bg-transparent
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:mt-[-6px]
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#355F7D]
            [&::-webkit-slider-thumb]:bg-white
            [&::-moz-range-track]:h-[4px]
            [&::-moz-range-track]:bg-transparent
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:cursor-grab
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#355F7D]
            [&::-moz-range-thumb]:bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PriceInput
          value={minPrice}
          placeholder="0"
          currencyCode={currencyCode}
          onChange={handleMinInput}
        />

        <PriceInput
          value={maxPrice}
          placeholder={String(safeMax)}
          currencyCode={currencyCode}
          onChange={handleMaxInput}
        />
      </div>
    </div>
  );
};

const PriceInput = ({
  value,
  placeholder,
  currencyCode,
  onChange,
}: {
  value: string;
  placeholder: string;
  currencyCode: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}) => (
  <div className="flex h-[38px] items-center rounded-[5px] border border-slate-300 bg-white focus-within:border-[#355F7D]">
    <input
      type="number"
      min="0"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="min-w-0 flex-1 bg-transparent px-3 text-[13px] outline-none"
    />

    <span className="border-l border-slate-200 px-3 text-[12px] text-slate-500">
      {currencyCode}
    </span>
  </div>
);

export default PriceRangeFilter;
