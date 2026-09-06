import type { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import type { BookingForm } from "./housingDetail.types";
import { getNightLabel } from "./housingDetail.utils";

interface Props { price:number; totalPrice:number; currency:string; nights:number; maxGuests:number; register:UseFormRegister<BookingForm>; handleSubmit:UseFormHandleSubmit<BookingForm>; onBook:(data:BookingForm)=>void; }
const HousingBookingCard = ({price,totalPrice,currency,nights,maxGuests,register,handleSubmit,onBook}:Props) => <aside className="lg:sticky lg:top-24"><form onSubmit={handleSubmit(onBook)} className="rounded-[8px] border border-[#7894A7] bg-white p-4">
  <div className="mb-4 flex items-end gap-2"><span className="rounded-[5px] bg-[#355872] px-2 py-1 text-[17px] font-semibold text-white">{price.toLocaleString()} {currency.toUpperCase()}</span><span className="pb-1 text-[11px] font-medium text-[#414B52]">за 1 ніч</span></div>
  <div className="overflow-hidden rounded-[7px] border border-[#C5CED4]">
    <label className="block border-b border-[#C5CED4] px-4 py-3"><span className="block text-[10px] font-medium text-[#202A31]">Введіть дати</span><div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2"><input type="date" {...register("checkIn",{required:true})} className="min-w-0 bg-transparent text-[11px] text-[#87939B] outline-none"/><span className="text-[#9CA6AC]">–</span><input type="date" {...register("checkOut",{required:true})} className="min-w-0 bg-transparent text-[11px] text-[#87939B] outline-none"/></div></label>
    <label className="block px-4 py-3"><span className="block text-[10px] font-medium text-[#202A31]">Гості</span><input type="number" min={1} max={maxGuests} {...register("guestsCount",{required:true,min:1,max:maxGuests})} className="mt-1 w-full bg-transparent text-[12px] text-[#87939B] outline-none"/></label>
  </div>
  <div className="mt-3 flex items-center justify-between text-[11px] text-[#56636C]"><span>{nights} {getNightLabel(nights)}</span><span className="font-semibold text-[#202A31]">{totalPrice.toLocaleString()} {currency.toUpperCase()}</span></div>
  <button type="submit" className="mt-4 h-[48px] w-full rounded-[6px] bg-[#243C4E] text-[13px] font-semibold text-white transition hover:bg-[#1D3241]">Перевірити дати</button>
</form></aside>;
export default HousingBookingCard;
