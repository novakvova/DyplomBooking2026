import { Search } from "lucide-react";
import { formatDate, getGuestLabel } from "./housingDetail.utils";

interface Props { city?: string; checkIn: string; checkOut: string; guestsCount: number; onOpenHousing: () => void; }
const HousingTopSearch = ({ city, checkIn, checkOut, guestsCount, onOpenHousing }: Props) => (
  <>
    <section className="bg-[#355872] pb-8 pt-5">
      <div className="mx-auto max-w-[1120px] px-6">
        <button type="button" onClick={onOpenHousing} className="mx-auto grid w-full max-w-[820px] grid-cols-[1fr_1fr_1fr_62px] overflow-hidden rounded-[12px] border border-white/15 bg-white/10 text-left text-white backdrop-blur">
          <Item title="Куди?" value={city || "Напрямок маршруту"} />
          <Item title="Коли?" value={checkIn&&checkOut ? `${formatDate(checkIn)} – ${formatDate(checkOut)}` : "Дата заїзду – Дата виїзду"} bordered />
          <Item title="Хто?" value={`${guestsCount} ${getGuestLabel(guestsCount)}`} bordered />
          <div className="flex items-center justify-center p-2"><span className="flex h-[42px] w-[48px] items-center justify-center rounded-[7px] bg-[#2D526B]"><Search size={22} strokeWidth={1.8}/></span></div>
        </button>
      </div>
    </section>
    <div className="h-[62px] bg-gradient-to-b from-[#355872] via-[#A7B7C2]/50 to-white" />
  </>
);
const Item = ({title,value,bordered=false}:{title:string;value:string;bordered?:boolean}) => <div className={`min-w-0 px-5 py-3 ${bordered?"border-l border-white/70":""}`}><div className="text-[11px] font-semibold">{title}</div><div className="mt-1 truncate text-[12px] text-white/55">{value}</div></div>;
export default HousingTopSearch;
