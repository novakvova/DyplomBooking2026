import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { carApi } from "../api/api";


const INITIAL_FILTERS = {
  search: "",
  minPrice: "",
  maxPrice: "",
  brands: [] as string[],
  transmissions: [] as string[],
  fuelTypes: [] as string[],
  seats: [] as string[],
};


const useCarsList = () => {
  const [filters, setFilters] =
    useState(INITIAL_FILTERS);

  const [sort, setSort] =
    useState("popular");

  const [page, setPage] =
    useState(1);


  const {
    data,
    isLoading,
    error,
  } = useQuery({

    queryKey:[
      "cars",
      filters,
      sort,
      page,
    ],


    queryFn:()=>carApi.getAll({

      search:
        filters.search,

      minPrice:
        filters.minPrice,

      maxPrice:
        filters.maxPrice,

      brands:
        filters.brands,

      transmissions:
        filters.transmissions,

      fuelTypes:
        filters.fuelTypes,

      seats:
        filters.seats,

      sort,
      page,
      pageSize:12,
    }),

  });


  const {
    data: carFilters
  } = useQuery({

    queryKey:[
      "car-filters"
    ],

    queryFn:
      carApi.getFilters,

  });


  useEffect(()=>{
    setPage(1);
  },[
    filters,
    sort,
  ]);

  return {
    items:
      data?.items ?? [],

    totalItems:
      data?.totalItems ?? 0,

    totalPages:
      data?.totalPages ?? 0,

    carFilters,

    filters,
    setFilters,

    sort,
    setSort,

    page,
    setPage,

    priceRange:{
      max:
        data?.priceRange?.max ?? 1000,

      step:
        data?.priceRange?.step ?? 50,

      histogram:
        data?.priceRange?.histogram ?? []
    },

    isLoading,
    error,
  };
};


export default useCarsList;