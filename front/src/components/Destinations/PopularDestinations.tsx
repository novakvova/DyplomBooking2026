import { useQuery } from "@tanstack/react-query";
import { destinationApi } from "../../api/api";
import DestinationCard from "./DestinationCard";


const PopularDestinations = () => {


const {
  data,
  isLoading
} = useQuery({
  queryKey:["popular-destinations"],
  queryFn: destinationApi.getPopular
});


if(isLoading)
{
  return <p>Loading...</p>;
}



return (

<div
className="
bg-white
rounded-2xl
shadow-xl
p-5
w-[607px]
"
>

<h2 className="
font-bold
text-xl
mb-5
">
Популярні напрямки:
</h2>


<div className="flex flex-col gap-4">

{
data?.map(destination => (

<DestinationCard
key={destination.id}
destination={destination}
/>

))
}

</div>


</div>

)

}


export default PopularDestinations;