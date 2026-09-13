import { useTranslation } from "react-i18next";

interface Props {
  onBrowseClick: () => void;
}

/**
 * Бірюзовий CTA-банер "Найвигідніші пропозиції в пік сезону" з
 * дизайну Figma. Кнопка веде до основного каталогу житла на цій
 * же сторінці (не окремий маршрут), тому просто скролить донизу.
 */
const PromoBanner = ({ onBrowseClick }: Props) => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-[1383px] px-6">
      <div className="flex flex-col items-start gap-4 rounded-[20px] bg-[#4B9DA9] p-8 min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:p-2 min-[1024px]:pl-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-white min-[1500px]:text-[30px]">
            {t("home.promo.title", "Найвигідніші пропозиції в пік сезону")}
          </h3>
          <p className="text-sm font-medium text-[#C6E1DC] min-[1500px]:text-[17px]">
            {t("home.promo.subtitle", "Нажимай на кнопку та обирай відпустку твоєї мрії!")}
          </p>
        </div>

        <button
          type="button"
          onClick={onBrowseClick}
          className="flex h-[61px] w-full shrink-0 items-center justify-center rounded-[10px] bg-[#355872] px-6 text-lg font-semibold text-white transition hover:bg-[#2d4b62] min-[1024px]:w-[158px]"
        >
          {t("home.promo.button", "Бронюй")}
        </button>
      </div>
    </section>
  );
};

export default PromoBanner;
