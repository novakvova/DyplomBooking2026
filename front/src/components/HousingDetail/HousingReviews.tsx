import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

import type { Review } from "../../types/review";

interface Props {
  reviews: Review[];
  onOpenAll: () => void;
}

const REVIEWS_PER_PAGE = 2;

const HousingReviews = ({ reviews, onOpenAll }: Props) => {
  const [page, setPage] = useState(0);

  if (!reviews.length) {
    return (
      <section className="border-b border-[#D8DDE0] py-7">
        <h2 className="text-[18px] font-semibold text-[#111820]">
          Відгуки
        </h2>

        <p className="mt-4 text-[13px] text-[#56636C]">
          Поки що немає відгуків про це помешкання.
        </p>
      </section>
    );
  }

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const start = page * REVIEWS_PER_PAGE;
  const visibleReviews = reviews.slice(start, start + REVIEWS_PER_PAGE);

  const canPrevious = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <section className="border-b border-[#D8DDE0] py-7">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#111820]">
          Відгуки
        </h2>

        {reviews.length > 2 && (
          <button
            type="button"
            onClick={onOpenAll}
            className="text-[13px] font-medium text-[#355872] transition hover:underline"
          >
            Переглянути всі
          </button>
        )}
      </div>

      <div className="relative mt-6 px-8">
        <div className="grid min-h-[100px] grid-cols-1 gap-8 md:grid-cols-2">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {reviews.length > 2 && (
          <>
            <button
              type="button"
              onClick={() => setPage((current) => current - 1)}
              disabled={!canPrevious}
              aria-label="Попередні відгуки"
              className="absolute left-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#BAC6CD] bg-white text-[#355872] shadow-sm transition hover:bg-[#F3F6F7] disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={17} />
            </button>

            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!canNext}
              aria-label="Наступні відгуки"
              className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#BAC6CD] bg-white text-[#355872] shadow-sm transition hover:bg-[#F3F6F7] disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight size={17} />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const rating = Math.min(5, Math.max(0, review.rating));

  return (
    <article className="min-w-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF2F4] text-[12px] font-semibold text-[#355872]">
          {review.userName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[#202A31]">
            {review.userName}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={13}
                  fill={star <= rating ? "#FFB341" : "none"}
                  stroke="#FFB341"
                />
              ))}
            </div>

            <span className="text-[10px] text-[#87939B]">
              {new Date(review.createdAt).toLocaleDateString("uk-UA")}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-[13px] leading-[1.5] text-[#414B52]">
        {review.comment}
      </p>
    </article>
  );
};

export default HousingReviews;