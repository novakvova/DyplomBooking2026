import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { housingApi } from '../api/api';
import HousingCard from '../components/HousingCard/HousingCard';

const HomePage = () => {
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minGuests, setMinGuests] = useState('');

  const { data: housings, isLoading, error } = useQuery({
    queryKey: ['housing', city, maxPrice, minGuests],
    queryFn: () => housingApi.getAll({
      city: city || undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minGuests: minGuests ? Number(minGuests) : undefined,
    }),
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-600 py-20 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Шлях до твого відпочинку! 🌟
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Знайди ідеальне житло для відпочинку
        </p>

        {/* Search bar */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 px-6 sm:flex-row">
          <input
            type="text"
            placeholder="🔍 Місто..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 rounded-xl px-4 py-3 text-slate-800 outline-none text-sm"
          />
          <input
            type="number"
            placeholder="👥 Гостей"
            value={minGuests}
            onChange={(e) => setMinGuests(e.target.value)}
            className="w-28 rounded-xl px-4 py-3 text-slate-800 outline-none text-sm"
          />
          <input
            type="number"
            placeholder="💰 Макс. ціна"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-36 rounded-xl px-4 py-3 text-slate-800 outline-none text-sm"
          />
        </div>
      </section>

      {/* Housing list */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          {city ? `Житло у ${city}` : 'Всі доступні варіанти'}
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            ⚠️ Не вдалося завантажити житло. Перевір чи запущений бекенд на localhost:5080
          </div>
        )}

        {housings && housings.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-12 text-center text-slate-500">
            🏠 За вашим запитом нічого не знайдено
          </div>
        )}

        {housings && housings.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {housings.map((h) => (
              <HousingCard key={h.id} housing={h} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
