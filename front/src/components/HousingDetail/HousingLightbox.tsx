import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { HousingPhoto } from "../../api/api";
import { getMediaUrl } from "../../api/client";

interface Props { open:boolean; photos:HousingPhoto[]; activeIndex:number; title:string; onClose:()=>void; onChange:(index:number)=>void; }
const HousingLightbox = ({open,photos,activeIndex,title,onClose,onChange}:Props) => {
  const prev=()=>onChange((activeIndex-1+photos.length)%photos.length), next=()=>onChange((activeIndex+1)%photos.length);
  useEffect(()=>{ if(!open) return; const old=document.body.style.overflow; document.body.style.overflow="hidden"; const key=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose(); if(e.key==="ArrowLeft")prev(); if(e.key==="ArrowRight")next();}; window.addEventListener("keydown",key); return()=>{document.body.style.overflow=old;window.removeEventListener("keydown",key);}; },[open,activeIndex,photos.length]);
  if(!open || !photos.length || !photos[activeIndex]) return null;
  return <div className="fixed inset-0 z-[9999] flex flex-col bg-black/95">
    <div className="flex h-[68px] items-center justify-between px-5"><span className="rounded-full bg-white/10 px-3 py-1.5 text-[13px] text-white">{activeIndex+1} / {photos.length}</span><button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><X size={25}/></button></div>
    <div className="relative flex min-h-0 flex-1 items-center justify-center px-16 py-4">{photos.length>1&&<button type="button" onClick={prev} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#243C4E]"><ChevronLeft size={28}/></button>}<img src={getMediaUrl(photos[activeIndex].filePath)} alt={title} className="max-h-full max-w-full select-none object-contain" draggable={false}/>{photos.length>1&&<button type="button" onClick={next} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#243C4E]"><ChevronRight size={28}/></button>}</div>
    {photos.length>1&&<div className="flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-white/10 px-5 py-4">{photos.map((p,i)=><button key={p.id} type="button" onClick={()=>onChange(i)} className={`h-[64px] w-[90px] shrink-0 overflow-hidden rounded-[6px] border-2 ${i===activeIndex?"border-white opacity-100":"border-transparent opacity-55"}`}><img src={getMediaUrl(p.filePath)} alt="" className="h-full w-full object-cover"/></button>)}</div>}
  </div>;
};
export default HousingLightbox;
