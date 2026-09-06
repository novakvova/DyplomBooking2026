import { Heart, Share2 } from "lucide-react";
import { useParams } from "react-router-dom";
import AuthModal from "../components/AuthModal/AuthModal";
import Footer from "../components/Footer/Footer";
import HousingBookingCard from "../components/HousingDetail/HousingBookingCard";
import HousingDetailsContent from "../components/HousingDetail/HousingDetailsContent";
import HousingGallery from "../components/HousingDetail/HousingGallery";
import HousingLightbox from "../components/HousingDetail/HousingLightbox";
import HousingTopSearch from "../components/HousingDetail/HousingTopSearch";
import { useHousingDetail } from "../hooks/useHousingDetail";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";

const HousingDetailPage = () => {
  const {id}=useParams<{id:string}>(), localizedNavigate=useLocalizedNavigate(), housingId=Number(id);
  const d=useHousingDetail(housingId);
  if(d.isLoading) return <div className="min-h-screen bg-white"><div className="h-[185px] bg-[#355872]"/><div className="mx-auto max-w-[1120px] px-6 py-8"><div className="h-[520px] animate-pulse rounded-[8px] bg-slate-100"/></div></div>;
  if(!d.housing) return <div className="py-20 text-center text-slate-500">Житло не знайдено</div>;
  return <>
    <HousingTopSearch city={d.housing.city} checkIn={d.checkIn} checkOut={d.checkOut} guestsCount={d.guestsCount} onOpenHousing={()=>localizedNavigate("/housing")}/>
    <main className="mx-auto max-w-[1120px] px-6 pb-16">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4"><h1 className="text-[27px] font-semibold tracking-[-0.02em] text-[#111820]">{d.housing.title}</h1><div className="flex items-center gap-5 text-[13px] text-[#202A31]"><button type="button" onClick={d.share} className="flex items-center gap-1.5 hover:underline"><Share2 size={16}/>{d.copied?"Скопійовано":"Поділитися"}</button><button type="button" onClick={d.toggleWishlist} disabled={d.wishlistPending} className="flex items-center gap-1.5 hover:underline disabled:opacity-50"><Heart size={17} fill={d.isFavorite?"currentColor":"none"}/>{d.isFavorite?"Збережено":"Зберегти"}</button></div></div>
      <HousingGallery title={d.housing.title} photos={d.photos.slice(0,5)} onOpen={i=>{d.setActivePhoto(i);d.setGalleryOpen(true);}}/>
      <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]"><HousingDetailsContent housing={d.housing} averageRating={d.averageRating} reviewCount={d.reviewCount} ratingMetrics={d.ratingMetrics}/><HousingBookingCard price={d.price} totalPrice={d.totalPrice} currency={d.currency} nights={d.nights} maxGuests={d.housing.maxGuests} register={d.form.register} handleSubmit={d.form.handleSubmit} onBook={d.onBook}/></div>
    </main>
    <Footer/>
    <HousingLightbox open={d.galleryOpen} photos={d.photos} activeIndex={d.activePhoto} title={d.housing.title} onClose={()=>d.setGalleryOpen(false)} onChange={d.setActivePhoto}/>
    <AuthModal isOpen={d.authOpen} onClose={()=>d.setAuthOpen(false)}/>
  </>;
};
export default HousingDetailPage;
