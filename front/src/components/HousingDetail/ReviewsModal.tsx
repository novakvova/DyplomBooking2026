import {
  ChevronLeft,
  ChevronRight,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Review } from "../../types/review";

interface Props {
  open: boolean;
  reviews: Review[];
  onClose: () => void;
}

const ReviewsModal = ({
  open,
  reviews,
  onClose,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) return;

    setActiveIndex(0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft" && reviews.length > 1) {
        setActiveIndex((current) =>
          current === 0
            ? reviews.length - 1
            : current - 1
        );
      }

      if (event.key === "ArrowRight" && reviews.length > 1) {
        setActiveIndex((current) =>
          (current + 1) % reviews.length
        );
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose, reviews.length]);

  if (!open || reviews.length === 0) {
    return null;
  }

  const review = reviews[activeIndex];

  const previous = () => {
    setActiveIndex((current) =>
      current === 0
        ? reviews.length - 1
        : current - 1
    );
  };

  const next = () => {
    setActiveIndex(
      (current) =>
        (current + 1) % reviews.length
    );
  };

  const rating = Math.min(
    5,
    Math.max(0, review.rating)
  );

  const date = new Date(
    review.createdAt
  ).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/55 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[700px] rounded-[8px] bg-white px-7 py-6 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-[#87939B] transition hover:text-[#202A31]"
        >
          <X size={19} />
        </button>

        {/* HEADER */}
        <div className="border-b border-[#D8DDE0] pb-4 pr-8">
          <h2 className="text-[20px] font-semibold text-[#111820]">
            Відгуки
          </h2>

          <p className="mt-1 text-[11px] text-[#87939B]">
            {activeIndex + 1} з {reviews.length}
          </p>
        </div>

        {/* REVIEW */}
        <div className="min-h-[250px] py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF2F4] text-[13px] font-semibold text-[#355872]">
              {review.userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[#202A31]">
                {review.userName}
              </p>

              <div className="mt-1 flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={
                          star <= rating
                            ? "#FFB341"
                            : "none"
                        }
                        stroke="#FFB341"
                      />
                    )
                  )}
                </div>

                <span className="text-[10px] text-[#87939B]">
                  {date}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[7px] bg-[#F3F6F7] px-5 py-4">
            <p className="whitespace-pre-line text-[14px] leading-[1.6] text-[#303A41]">
              {review.comment}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        {reviews.length > 1 && (
          <div className="flex items-center justify-between border-t border-[#D8DDE0] pt-5">
            <button
              type="button"
              onClick={previous}
              aria-label="Попередній відгук"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#BAC6CD] bg-white text-[#355872] transition hover:bg-[#F3F6F7]"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex max-w-[400px] items-center gap-1.5 overflow-hidden">
              {reviews.map(
                (item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    aria-label={`Відгук ${
                      index + 1
                    }`}
                    className={`h-1.5 shrink-0 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-6 bg-[#355872]"
                        : "w-1.5 bg-[#C5CED4]"
                    }`}
                  />
                )
              )}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Наступний відгук"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#BAC6CD] bg-white text-[#355872] transition hover:bg-[#F3F6F7]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsModal;