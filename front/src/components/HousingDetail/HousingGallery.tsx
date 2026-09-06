import type { HousingPhoto } from "../../api/api";
import { getMediaUrl } from "../../api/client";

const HousingGallery = ({title,photos,onOpen}:{title:string;photos:HousingPhoto[];onOpen:(index:number)=>void}) => {
  const main=photos[0], secondary=photos.slice(1,5);
  if(!main) return <div className="flex h-[400px] items-center justify-center rounded-[8px] bg-[#F2F4F5]"><img src="/images/logos/Logo_WayGo.png" alt="WayGo" className="h-10"/></div>;
  return <div className="grid h-[420px] gap-2 overflow-hidden rounded-[8px] md:grid-cols-[1.08fr_1fr]">
    <button type="button" onClick={()=>onOpen(0)} className="h-full overflow-hidden bg-slate-100"><img src={getMediaUrl(main.filePath)} alt={title} className="h-full w-full object-cover transition duration-300 hover:scale-[1.015]"/></button>
    <div className="hidden grid-cols-2 grid-rows-2 gap-2 md:grid">{Array.from({length:4}).map((_,i)=>{const p=secondary[i]; return p ? <button key={p.id} type="button" onClick={()=>onOpen(i+1)} className="overflow-hidden bg-slate-100"><img src={getMediaUrl(p.filePath)} alt="" className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"/></button> : <div key={i} className="bg-[#F2F4F5]"/>;})}</div>
  </div>;
};
export default HousingGallery;
