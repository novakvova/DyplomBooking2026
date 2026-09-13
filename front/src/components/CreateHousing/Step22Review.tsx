import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";

import HousingRegistrationLayout from "./HousingRegistrationLayout";
import { useHousingRegistration } from "./HousingRegistrationContext";
import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";
import { useCurrency } from "../../hooks/useCurrency";
import { housingRegistrationApi } from "../../api/housingRegistrationApi";

interface ReviewRowProps {
  label: string;
  value: string;
}

const ReviewRow = ({ label, value }: ReviewRowProps) => (
  <div className="flex items-start justify-between gap-6 border-b border-[#E1E5E8] py-3 last:border-b-0">
    <span className="text-[14px] text-[#616D75]">{label}</span>
    <span className="max-w-[55%] text-right text-[14px] font-medium text-black">
      {value}
    </span>
  </div>
);

interface ReviewSectionProps {
  title: string;
  editPath: string;
  children: ReactNode;
}

const ReviewSection = ({
  title,
  editPath,
  children,
}: ReviewSectionProps) => {
  const navigate = useLocalizedNavigate();

  return (
    <section className="rounded-[10px] border border-[#D9DDE0] bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[20px] font-medium text-black">{title}</h2>

        <button
          type="button"
          onClick={() => navigate(editPath)}
          className="text-[13px] font-medium text-[#355872] transition hover:text-[#243C4E]"
        >
          Редагувати
        </button>
      </div>

      {children}
    </section>
  );
};

const categoryLabels: Record<string, string> = {
  apartment: "Апартаменти та квартири",
  house: "Будинки та вілли",
  hotel: "Готелі та хостели",
  alternative: "Альтернативне житло",
};

const propertyTypeLabels: Record<string, string> = {
  entire_place: "Помешкання повністю",
  private_room: "Окрема кімната",
  shared_room: "Спільна кімната",
};

const rentalFormatLabels: Record<string, string> = {
  daily: "Подобова оренда",
  hourly: "Погодинна оренда",
  flexible: "Подобова та погодинна",
};

const bookingModeLabels: Record<string, string> = {
  manual: "Ручне підтвердження",
  instant: "Миттєве бронювання",
};

const preparationTimeLabels: Record<string, string> = {
  none: "Без перерви",
  one_day: "1 день між бронюваннями",
  manual: "Налаштовувати вручну",
};

const ruleLabel = (value: string) =>
  value === "allowed" ? "Дозволено" : "Заборонено";

const Step22Review = () => {
  const navigate = useLocalizedNavigate();
  const { data, photos, resetData } = useHousingRegistration();
  const { currencyCode, currencySymbol, convert } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatMoney = (value: number) =>
    `${currencySymbol}${new Intl.NumberFormat("uk-UA", {
      maximumFractionDigits: 2,
    }).format(convert(value))}`;

  const handleBack = () => {
    navigate("/housing/register/calendar");
  };

  const handleCreate = async () => {
    if (isSubmitting) return;

    if (photos.length < 5) {
      toast.dismiss();
      toast.error("Додайте щонайменше 5 фотографій.");
      navigate("/housing/register/photos");
      return;
    }

    try {
      setIsSubmitting(true);

      const created =
        await housingRegistrationApi.create(data, photos);

      resetData();

      toast.dismiss();
      toast.success("Оголошення успішно створено.");

      navigate(`/housing/${created.id}`);
    } catch (error: unknown) {
      toast.dismiss();

      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Не вдалося створити оголошення."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountText = [
    data.weeklyDiscountPercent > 0
      ? `${data.weeklyDiscountPercent}% за тиждень`
      : null,
    data.monthlyDiscountPercent > 0
      ? `${data.monthlyDiscountPercent}% за місяць`
      : null,
    data.shortStayDiscountPercent > 0
      ? `${data.shortStayDiscountPercent}% за 3–5 днів`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const safetyItems = [
    data.securityCameras ? "Камери відеоспостереження" : null,
    data.noiseMonitor ? "Датчик рівня шуму" : null,
    data.propertySafetyFeatures ? "Особливості безпеки" : null,
  ]
    .filter(Boolean)
    .join(", ");

  const addressValue = data.address
    ? Object.values(data.address)
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0
        )
        .slice(0, 3)
        .join(", ")
    : "Не вказано";

  return (
    <HousingRegistrationLayout
      step={3}
      progress={100}
      onBack={handleBack}
      onNext={handleCreate}
      nextLabel={
        isSubmitting
          ? "Створення..."
          : "Створити оголошення"
      }
      nextDisabled={isSubmitting}
    >
      <section className="w-full max-w-[900px]">
        <h1 className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-black">
          Перевірте оголошення
        </h1>

        <p className="mt-2 max-w-[700px] text-[16px] leading-[1.5] text-[#616D75]">
          Переконайтеся, що всі дані вказані правильно. Після
          створення оголошення більшість налаштувань можна буде
          змінити в профілі.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ReviewSection
            title="Основна інформація"
            editPath="/housing/register/category"
          >
            <ReviewRow
              label="Категорія"
              value={
                data.category
                  ? categoryLabels[data.category] ?? data.category
                  : "Не вказано"
              }
            />

            <ReviewRow
              label="Тип"
              value={
                data.propertyType
                  ? propertyTypeLabels[data.propertyType] ??
                    data.propertyType
                  : "Не вказано"
              }
            />

            <ReviewRow
              label="Формат оренди"
              value={
                data.rentalFormat
                  ? rentalFormatLabels[data.rentalFormat] ??
                    data.rentalFormat
                  : "Не вказано"
              }
            />

            <ReviewRow label="Гості" value={String(data.guests)} />
            <ReviewRow label="Спальні" value={String(data.bedrooms)} />
            <ReviewRow label="Ліжка" value={String(data.beds)} />
            <ReviewRow
              label="Ванні кімнати"
              value={String(data.bathrooms)}
            />
          </ReviewSection>

          <ReviewSection
            title="Оголошення"
            editPath="/housing/register/title"
          >
            <ReviewRow
              label="Назва"
              value={data.title || "Не вказано"}
            />

            <ReviewRow
              label="Опис"
              value={
                data.description
                  ? `${data.description.slice(0, 90)}${
                      data.description.length > 90 ? "…" : ""
                    }`
                  : "Не вказано"
              }
            />

            <ReviewRow
              label="Фото"
              value={`${photos.length} завантажено`}
            />

            <ReviewRow
              label="Зручності"
              value={
                data.amenities.length
                  ? `${data.amenities.length} вибрано`
                  : "Не вибрано"
              }
            />
          </ReviewSection>

          <ReviewSection
            title="Ціна та бронювання"
            editPath="/housing/register/price"
          >
            {(data.rentalFormat === "daily" ||
              data.rentalFormat === "flexible") && (
              <ReviewRow
                label="Ціна за ніч"
                value={formatMoney(data.pricePerNight)}
              />
            )}

            {(data.rentalFormat === "hourly" ||
              data.rentalFormat === "flexible") && (
              <ReviewRow
                label="Ціна за годину"
                value={formatMoney(data.pricePerHour)}
              />
            )}

            <ReviewRow label="Валюта" value={currencyCode} />

            <ReviewRow
              label="Бронювання"
              value={
                data.bookingMode
                  ? bookingModeLabels[data.bookingMode] ??
                    data.bookingMode
                  : "Не вказано"
              }
            />

            <ReviewRow
              label="Знижки"
              value={discountText || "Без знижок"}
            />
          </ReviewSection>

          <ReviewSection
            title="Правила дому"
            editPath="/housing/register/rules"
          >
            <ReviewRow
              label="Куріння"
              value={ruleLabel(data.smokingRule)}
            />
            <ReviewRow
              label="Тварини"
              value={ruleLabel(data.petsRule)}
            />
            <ReviewRow
              label="Вечірки"
              value={ruleLabel(data.partiesRule)}
            />

            <ReviewRow
              label="Тихі години"
              value={
                data.quietHoursMode === "enabled"
                  ? `${data.quietHoursFrom} — ${data.quietHoursTo}`
                  : "Не встановлені"
              }
            />

            <ReviewRow
              label="Безпека"
              value={safetyItems || "Особливостей не вказано"}
            />
          </ReviewSection>

          <ReviewSection
            title="Календар"
            editPath="/housing/register/calendar"
          >
            <ReviewRow
              label="Мінімальне проживання"
              value={`${data.minimumStay} ${
                data.minimumStay === 1 ? "ніч" : "ночей"
              }`}
            />

            <ReviewRow
              label="Бронювання наперед"
              value={`${data.bookingWindowMonths} міс.`}
            />

            <ReviewRow
              label="Підготовка"
              value={
                preparationTimeLabels[data.preparationTime] ??
                data.preparationTime
              }
            />

            {(data.rentalFormat === "daily" ||
              data.rentalFormat === "flexible") && (
              <ReviewRow
                label="Заїзд / виїзд"
                value={`${data.checkInTime} / ${data.checkOutTime}`}
              />
            )}

            {(data.rentalFormat === "hourly" ||
              data.rentalFormat === "flexible") && (
              <ReviewRow
                label="Погодинний доступ"
                value={`${data.hourlyStartTime} — ${data.hourlyEndTime}`}
              />
            )}
          </ReviewSection>

          <ReviewSection
            title="Розташування"
            editPath="/housing/register/location"
          >
            <ReviewRow
              label="Адреса"
              value={addressValue || "Не вказано"}
            />
          </ReviewSection>
        </div>
      </section>
    </HousingRegistrationLayout>
  );
};

export default Step22Review;
