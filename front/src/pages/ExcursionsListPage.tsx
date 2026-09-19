import Footer from "../components/Footer/Footer";

import ExcursionFilters from "../components/Catalog/Excursions/ExcursionFilters";
import ExcursionCard from "../components/Catalog/Excursions/ExcursionCard";

import useExcursionsList from "../hooks/useExcursionsList";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";


const ExcursionsListPage = () => {


  const navigate = useLocalizedNavigate();



  const {

    items,

    isLoading,
    error,

    filters,
    setFilters,

    priceRange,

    totalItems,

    page,
    setPage,

    totalPages,

  } = useExcursionsList();




  return (

    <div className="min-h-screen bg-white">


      <div className="
        h-[90px]
        w-full
        bg-gradient-to-b
        from-[#355872]
        via-[#D9D9D9]/60
        to-white
      " />


      <main className="
        mx-auto
        max-w-[1600px]
        px-6
        pb-14
        lg:px-10
      ">


        <h1 className="
          mb-6
          text-[27px]
          font-bold
          text-[#111820]
        ">

          Знайдено {totalItems} екскурсій

        </h1>




        <div className="
          grid
          gap-10
          lg:grid-cols-[320px_minmax(0,1fr)]
        ">


          <ExcursionFilters

            filters={filters}

            setFilters={setFilters}

            priceRange={priceRange}

          />



          <section>


            {isLoading && (

              <div className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                xl:grid-cols-3
              ">

                {Array.from({
                  length:6
                }).map((_,index)=>(

                  <div

                    key={index}

                    className="
                      h-[360px]
                      animate-pulse
                      rounded-[16px]
                      bg-slate-100
                    "

                  />

                ))}


              </div>

            )}





            {error && (

              <div className="
                rounded-[16px]
                bg-red-50
                p-8
                text-center
                text-red-600
              ">

                Не вдалося завантажити екскурсії.

              </div>

            )}






            {!isLoading &&
              !error &&
              items.length > 0 && (


              <div className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                xl:grid-cols-3
              ">


                {items.map((excursion)=>(


                  <ExcursionCard

                    key={excursion.id}

                    excursion={excursion}

                    onOpen={() =>
                      navigate(
                        `/excursions/${excursion.id}`
                      )
                    }

                  />


                ))}



              </div>


            )}




            {totalPages > 1 && (

              <div className="
                mt-10
                flex
                justify-center
                gap-2
              ">


                {Array.from({
                  length:totalPages
                }).map((_,index)=>(


                  <button

                    key={index}

                    onClick={()=>{
                      setPage(index+1);

                      window.scrollTo({
                        top:0,
                        behavior:"smooth",
                      });

                    }}

                    className={`
                      h-10
                      w-10
                      rounded-lg
                      ${
                        page===index+1
                        ?
                        "bg-[#355872] text-white"
                        :
                        "bg-slate-100"
                      }
                    `}

                  >

                    {index+1}

                  </button>


                ))}



              </div>

            )}



          </section>



        </div>



      </main>


      <Footer />


    </div>

  );

};


export default ExcursionsListPage;