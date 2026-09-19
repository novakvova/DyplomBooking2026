import { useState, type MouseEvent } from "react";

interface Props {
  isFavorite: boolean;
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  ariaLabel: string;
}

/**
 * Кругла кнопка "в улюблені" на реальних SVG-іконках з дизайну:
 * - small_like_outline — за замовчуванням (не в улюблених)
 * - small_like_hover — коли курсор наведений, але ще не в улюблених
 *   (потовщений контур, як натяк "клікни, щоб додати")
 * - small_like_filled — коли вже в улюблених
 *
 * На відміну від текстового "♥"/"♡", який був тут раніше, це дає
 * точний вигляд з макета замість системного емодзі-шрифту.
 */
  const LikeButton = ({ isFavorite, onToggle, disabled, ariaLabel }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  let src = "/public/images/icons/small_like_outline.svg";
  if (isFavorite) src = "/public/images/icons/small_like_filled.svg";
  else if (isHovered) src = "/public/images/icons/small_like_hover.svg";

  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={isFavorite}
      className="absolute right-4 top-4 flex h-[46px] w-[46px] items-center justify-center transition-transform hover:scale-110 disabled:opacity-60 disabled:hover:scale-100"
    >
      <img src={src} alt="" aria-hidden="true" className="h-full w-full" />
    </button>
  );
};

export default LikeButton;
