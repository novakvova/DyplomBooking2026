import { Link } from 'react-router-dom';
import type { Housing } from '../../api/api';

interface Props {
  housing: Housing;
}

const typeLabels: Record<string, string> = {
  Apartment: 'Квартира',
  House: 'Будинок',
  Room: 'Кімната',
  Studio: 'Студія',
  Villa: 'Вілла',
};

const HousingCard = ({ housing }: Props) => {
  return (
    <Link
      to={`/housing/${housing.id}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Photo placeholder */}
      <div className="relative h-52 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-5xl">🏠</div>
        <div className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow">
          {typeLabels[housing.type] ?? housing.type}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-800 group-hover:text-slate-600 transition line-clamp-1">
            {housing.title}
          </h3>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          📍 {housing.city}, {housing.address}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
          <span>🛏 {housing.rooms} кімн.</span>
          <span>👥 до {housing.maxGuests} гостей</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-slate-800 font-semibold">
            {housing.pricePerNight.toLocaleString()} ₴
            <span className="text-xs font-normal text-slate-400"> / ніч</span>
          </span>
          <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-white">
            Переглянути
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HousingCard;
