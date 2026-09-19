import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { excursionApi } from "../api/api";


const INITIAL_FILTERS = {
  search:"",
  minPrice:"",
  maxPrice:"",
  categories:[] as string[],
  duration:[] as string[],
};


const useExcursionsList = () => {
  const [filters,setFilters] =
    useState(INITIAL_FILTERS);

  const [sort,setSort] =
    useState("popular");

  const [page,setPage] =
    useState(1);


  const {
    data,
    isLoading,
    error,
  } = useQuery({

    queryKey:[
      "excursions",
      filters,
      sort,
      page,
    ],

    queryFn:()=>excursionApi.getAll({
      search:
        filters.search,

      minPrice:
        filters.minPrice,

      maxPrice:
        filters.maxPrice,

      categories:
        filters.categories,

      durations:
        filters.duration,

      sort,
      page,
      pageSize:12,
    }),
  });


  const {
    data: excursionFilters
  } = useQuery({
    queryKey:[
      "excursion-filters"
    ],
    queryFn:
      excursionApi.getFilters,
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

    excursionFilters,

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

export default useExcursionsList;