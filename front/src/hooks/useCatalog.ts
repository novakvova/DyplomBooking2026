import { useMemo, useState } from "react";


interface Params<T> {
  data: T[];
  priceField: keyof T;
  pageSize?: number;
  searchFields?: (keyof T)[];
}

const useCatalog = <T,>({
  data,
  priceField,
  pageSize = 10,
  searchFields = [],
}: Params<T>) => {

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sort, setSort] = useState<
    "popular" | "priceAsc" | "priceDesc"
  >("popular");

  const [priceRange, setPriceRange] =
    useState({
      min: 0,
      max: Infinity,
    });

  const [filters, setFilters] = useState<Record<string,string[]>>({});

  const filtered = useMemo(()=>{
    let result = [...data];

    // SEARCH
    if(search.trim()) {
      const query = search.toLowerCase();

      result =
        result.filter(item =>
          searchFields.some(field =>
            String(item[field])
              .toLowerCase()
              .includes(query)
          )
        );
    }


    // PRICE
    result =
      result.filter(item=>{
        const price = Number(item[priceField]);

        return (
          price >= priceRange.min &&
          price <= priceRange.max
        );
      });


    // CHECKBOX FILTERS
    Object.entries(filters)
      .forEach(([key,values])=>{

        if(values.length===0)
          return;

        result =
          result.filter(item=>
            values.includes(
              String(
                item[key as keyof T]
              )
            )
          );
      });

    // SORT
    if(sort==="priceAsc") {
      result.sort(
        (a,b)=>
          Number(a[priceField]) -
          Number(b[priceField])
      );
    }


    if(sort==="priceDesc") {
      result.sort(
        (a,b)=>
          Number(b[priceField]) -
          Number(a[priceField])
      );
    }

    return result;

  },[
    data,
    search,
    priceRange,
    filters,
    sort,
  ]);


  const totalPages =
    Math.ceil(
      filtered.length / pageSize
    );


  const items =
    filtered.slice(
      (page-1)*pageSize,
      page*pageSize
    );

  return {
    items,
    totalItems:
      filtered.length,

    page,
    totalPages,
    search,
    setSearch,
    sort,
    setSort,

    priceRange,
    setPriceRange,

    filters,
    setFilters,

    setPage,
  };

};


export default useCatalog;