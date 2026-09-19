interface Props {
  // Рейтинг від 0 до 5, дробові значення показують напівзірку
  // (округлення до найближчих 0.5).
  rating: number;
  size?: number;
}

/**
 * Зірковий рейтинг на реальних SVG-іконках з дизайну (star_filled,
 * star_half_filled, star_outline), а не текстових символах "★"/"☆".
 */
const StarRating = ({ rating, size = 20 }: Props) => {
  // Округлення до найближчих 0.5, щоб коректно розкластись
  // на повні/напів/порожні зірки.
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const position = index + 1;

        let src = "/images/icons/star_outline.svg";
        if (rounded >= position) src = "/images/icons/star_filled.svg";
        else if (rounded >= position - 0.5) src = "/images/icons/star_half_filled.svg";

        return (
          <img
            key={index}
            src={src}
            alt=""
            aria-hidden="true"
            style={{ width: size, height: size }}
            className="shrink-0"
          />
        );
      })}
    </div>
  );
};

export default StarRating;
