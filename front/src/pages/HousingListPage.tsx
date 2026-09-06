import Footer from "../components/Footer/Footer";
import HousingFilters from "../components/HousingList/HousingFilters";
import HousingListCard from "../components/HousingList/HousingListCard";
import HousingPagination from "../components/HousingList/HousingPagination";
import HousingSearchBar from "../components/HousingList/HousingSearchBar";
import HousingToolbar from "../components/HousingList/HousingToolbar";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import { useHousingList } from "../hooks/useHousingList";

const HousingListPage = () => {
  const navigate = useLocalizedNavigate();

  const {
    destination,
    setDestination,
    dates,
    setDates,
    guests,
    setGuests,

    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,

    filters,
    setFilters,
    toggleArrayFilter,
    clearFilters,
    priceRange,

    isLoading,
    error,
    totalItems,
    totalPages,
    pagedHousings,
    pageNumbers,
  } = useHousingList();

  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <HousingSearchBar
        destination={destination}
        dates={dates}
        guests={guests}
        onDestinationChange={setDestination}
        onDatesChange={setDates}
        onGuestsChange={setGuests}
      />

      <div className="h-[90px] w-full bg-gradient-to-b from-[#355872] via-[#D9D9D9]/60 to-white" />

      <main className="mx-auto max-w-[1600px] px-6 pb-14 lg:px-10">
        <HousingToolbar
          pageSize={pageSize}
          sort={sort}
          onPageSizeChange={setPageSize}
          onSortChange={setSort}
        />

        <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          <HousingFilters
            filters={filters}
            setFilters={setFilters}
            toggleArrayFilter={toggleArrayFilter}
            onClear={clearFilters}
            priceRange={priceRange}
          />

          <section className="min-w-0">
            <h1 className="mb-6 text-[27px] font-bold text-[#111820]">
              {destination ? `${destination}: ` : ""}
              Знайдено {totalItems} помешкань
            </h1>

            {isLoading && (
              <div className="space-y-6">
                {Array.from({ length: pageSize }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[260px] animate-pulse rounded-[16px] bg-slate-100"
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-[16px] bg-red-50 p-8 text-center text-red-600">
                Не вдалося завантажити помешкання.
              </div>
            )}

            {!isLoading && !error && totalItems === 0 && (
              <div className="rounded-[16px] bg-slate-50 p-12 text-center text-slate-500">
                За вибраними параметрами нічого не знайдено.
              </div>
            )}

            {!isLoading && !error && pagedHousings.length > 0 && (
              <div className="space-y-6">
                {pagedHousings.map((housing) => (
                  <HousingListCard
                    key={housing.id}
                    housing={housing}
                    onOpen={() => navigate(`/housing/${housing.id}`)}
                  />
                ))}
              </div>
            )}

            <HousingPagination
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={handlePageChange}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HousingListPage;
