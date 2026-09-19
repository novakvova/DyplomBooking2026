interface Props {
  sort: string;
  onSortChange: (value: string) => void;
}


const CatalogToolbar = ({
  sort,
  onSortChange,
}: Props) => {

  return (
    <select
      value={sort}
      onChange={(e) =>
        onSortChange(e.target.value)
      }
      className="
        rounded-lg
        border
        border-slate-300
        bg-white
        px-4
        py-2
        text-sm
      "
    >

      <option value="popular">
        За популярністю
      </option>

      <option value="rating">
        За рейтингом
      </option>

      <option value="price-low">
        Ціна: від дешевих
      </option>

      <option value="price-high">
        Ціна: від дорогих
      </option>

    </select>
  );
};


export default CatalogToolbar;