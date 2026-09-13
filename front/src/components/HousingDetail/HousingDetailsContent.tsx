import {
  Camera,
  Check,
  Cigarette,
  Clock3,
  Globe2,
  MapPin,
  PartyPopper,
  PawPrint,
  ShieldCheck,
  Star,
  UserRound,
  Volume2,
} from "lucide-react";

import { AMENITY_LABELS } from "./housingDetail.constants";
import type {
  HousingDetails,
  RatingMetricItem,
} from "./housingDetail.types";

import {
  getGuestLabel,
  getReviewLabel,
  getRoomLabel,
  getRuleLabel,
} from "./housingDetail.utils";

import HousingReviews from "./HousingReviews";
import HousingLocationMap from "./HousingLocationMap";

import type { Review } from "../../types/review";

interface Props {
  housing: HousingDetails;
  averageRating: number;
  reviewCount: number;
  ratingMetrics: RatingMetricItem[];
  reviews: Review[];
  onOpenReviews: () => void;
}

const HousingDetailsContent = ({
  housing,
  averageRating,
  reviewCount,
  ratingMetrics,
  reviews,
  onOpenReviews,
}: Props) => {
  const amenities = Array.isArray(housing.amenities)
    ? housing.amenities
    : [];

  const safety = [
    housing.securityCameras && {
      title: "Камери відеоспостереження",
      description:
        housing.securityCamerasDescription ||
        "На території встановлені камери відеоспостереження.",
      icon: Camera,
    },
    housing.noiseMonitor && {
      title: "Датчик рівня шуму",
      description:
        housing.noiseMonitorDescription ||
        "Пристрій контролює лише рівень гучності, без запису звуку.",
      icon: Volume2,
    },
    housing.propertySafetyFeatures && {
      title: "Охорона та особливості",
      description:
        housing.propertySafetyFeaturesDescription ||
        "У помешканні передбачені додаткові заходи безпеки.",
      icon: ShieldCheck,
    },
  ].filter(Boolean) as {
    title: string;
    description: string;
    icon: typeof Camera;
  }[];

  return (
    <div className="min-w-0">
      <div className="flex items-start gap-2 text-[16px] font-semibold text-[#202A31]">
        <MapPin
          size={18}
          className="mt-[2px] shrink-0 text-[#355872]"
        />
        <span>
          {[housing.address, housing.city]
            .filter(Boolean)
            .join(", ")}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#D8DDE0] pb-5 text-[12px] text-[#56636C]">
        <span>
          {housing.rooms} {getRoomLabel(housing.rooms)}
        </span>

        <span>
          {housing.maxGuests} {getGuestLabel(housing.maxGuests)}
        </span>

        {typeof housing.bedrooms === "number" && (
          <span>{housing.bedrooms} спал.</span>
        )}

        {typeof housing.beds === "number" && (
          <span>{housing.beds} ліж.</span>
        )}

        {averageRating > 0 && (
          <span className="flex items-center gap-1 font-medium text-[#202A31]">
            <Star
              size={14}
              fill="#FFB341"
              stroke="#FFB341"
            />

            {averageRating.toFixed(1)}

            {reviewCount > 0 && (
              <span className="ml-2 font-normal text-[#56636C]">
                {reviewCount} {getReviewLabel(reviewCount)}
              </span>
            )}
          </span>
        )}
      </div>

      {ratingMetrics.length > 0 && (
        <section className="grid grid-cols-1 gap-x-5 gap-y-3 border-b border-[#D8DDE0] py-5 sm:grid-cols-2 lg:grid-cols-3">
          {ratingMetrics.map((item) => (
            <RatingMetric
              key={item.label}
              {...item}
            />
          ))}
        </section>
      )}

      {housing.description && (
        <section className="border-b border-[#D8DDE0] py-7">
          <p className="whitespace-pre-line text-[14px] leading-[1.55] text-[#252E34]">
            {housing.description}
          </p>
        </section>
      )}

      {amenities.length > 0 && (
        <section className="border-b border-[#D8DDE0] py-7">
          <Title>Зручності</Title>

          <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
            {amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-2 text-[14px] text-[#252E34]"
              >
                <Check
                  size={17}
                  strokeWidth={1.7}
                />

                <span>
                  {AMENITY_LABELS[amenity] ?? amenity}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="border-b border-[#D8DDE0] py-7">
        <Title>Правила дому</Title>

        <div className="mt-5 space-y-4">
          <Rule
            icon={Clock3}
            title="Реєстрація заїзду:"
            value={housing.checkInTime || "Не вказано"}
          />

          <Rule
            icon={Clock3}
            title="Реєстрація виїзду:"
            value={housing.checkOutTime || "Не вказано"}
          />

          <Rule
            icon={Cigarette}
            title="Куріння та вейпінг:"
            value={getRuleLabel(housing.smokingRule)}
          />

          <Rule
            icon={PawPrint}
            title="Тварини:"
            value={getRuleLabel(housing.petsRule)}
          />

          {housing.quietHoursMode === "enabled" && (
            <Rule
              icon={Volume2}
              title="Тихі години:"
              value={`${housing.quietHoursFrom || "22:00"} до ${
                housing.quietHoursTo || "08:00"
              }`}
            />
          )}

          <Rule
            icon={PartyPopper}
            title="Вечірки та заходи:"
            value={getRuleLabel(housing.partiesRule)}
          />

          {housing.additionalRules && (
            <Rule
              icon={ShieldCheck}
              title="Додатково:"
              value={housing.additionalRules}
            />
          )}
        </div>
      </section>

      {safety.length > 0 && (
        <section className="border-b border-[#D8DDE0] py-7">
          <Title>Заходи безпеки</Title>

          <div className="mt-4 space-y-2">
            {safety.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[7px] border border-[#7894A7] p-4"
                >
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#202A31]">
                    <Icon
                      size={17}
                      strokeWidth={1.6}
                    />
                    {item.title}
                  </div>

                  <p className="mt-2 text-[13px] leading-[1.45] text-[#414B52]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <HousingReviews
        reviews={reviews}
        onOpenAll={onOpenReviews}
      />

      <section className="py-8">
        <HousingLocationMap
          address={housing.address}
          city={housing.city}
        />

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[390px_minmax(0,1fr)]">
          <HostCard
            ownerName={housing.ownerName}
            reviewCount={reviewCount}
            averageRating={averageRating}
          />

          <HostDescription />
        </div>

        <SecurityNotice />
      </section>
    </div>
  );
};

const HostCard = ({
  ownerName,
  reviewCount,
  averageRating,
}: {
  ownerName?: string | null;
  reviewCount: number;
  averageRating: number;
}) => (
  <div className="box-border flex h-[238px] w-full items-center justify-between rounded-[9px] border border-[#ADB3B7] px-6 py-3">
    <div className="flex w-[165px] flex-col items-center gap-2">
      <div className="flex h-[94px] w-[94px] items-center justify-center rounded-full bg-[#EEF2F4]">
        <UserRound
          size={53}
          strokeWidth={1.2}
          className="text-[#8B969D]"
        />
      </div>

      <p className="text-center text-[21px] font-medium leading-[25px] text-black">
        {ownerName || "Господар"}
      </p>

      <div className="flex items-center gap-2">
        <ShieldCheck
          size={19}
          strokeWidth={1.5}
          className="text-black"
        />

        <span className="text-[16px] font-medium text-[#424A50]">
          Суперхост
        </span>
      </div>
    </div>

    <div className="flex h-[212px] w-[82px] flex-col items-start">
      <HostStat
        value={String(reviewCount)}
        label="Відгуки"
      />

      <HostStat
        value={
          averageRating > 0
            ? averageRating.toFixed(2)
            : "—"
        }
        label="Рейтинг"
      />

      <div className="flex w-[82px] flex-col gap-1 py-2">
        <span className="text-[21px] font-semibold leading-[26px] text-black">
          2
        </span>

        <span className="text-[11px] font-medium leading-[14px] text-[#424A50]">
          Роки прийому гостей
        </span>
      </div>
    </div>
  </div>
);

const HostStat = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <div className="flex h-[69px] w-[82px] flex-col justify-center border-b border-[#ADB3B7]">
    <span className="text-[21px] font-semibold leading-[26px] text-black">
      {value}
    </span>

    <span className="mt-1 text-[11px] font-medium leading-[14px] text-[#424A50]">
      {label}
    </span>
  </div>
);

const HostDescription = () => (
  <div className="flex min-h-[238px] flex-col justify-between py-1">
    <p className="max-w-[400px] text-[14px] font-medium leading-[18px] text-black">
      Суперхост — це досвідчений і надійний господар
      із високим рейтингом. Він швидко відповідає на
      повідомлення та надає відмінний сервіс для
      кожного гостя.
    </p>

    <div className="flex items-start gap-2">
      <Globe2
        size={25}
        strokeWidth={1.5}
        className="shrink-0 text-black"
      />

      <span className="text-[14px] font-medium leading-[18px] text-black">
        Володіння мовами: Англійська, Українська
      </span>
    </div>

    <div className="flex items-start gap-2">
      <MapPin
        size={25}
        strokeWidth={1.5}
        className="shrink-0 text-black"
      />

      <span className="text-[14px] font-medium leading-[18px] text-black">
        Місце проживання: Україна (UTC+2)
      </span>
    </div>

    <button
      type="button"
      className="h-[46px] w-full max-w-[390px] rounded-[9px] border-[1.5px] border-[#ADB3B7] text-[18px] font-medium text-[#424A50] transition hover:border-[#355872] hover:text-[#355872]"
    >
      Написати господарю
    </button>
  </div>
);

const SecurityNotice = () => (
  <div className="mt-6 flex items-start gap-2">
    <ShieldCheck
      size={19}
      strokeWidth={1.5}
      className="mt-[1px] shrink-0 text-black"
    />

    <p className="text-[11px] font-medium leading-[15px] text-black">
      Щоб захистити свої платежі та персональні дані,
      здійснюйте оплату та спілкуйтеся з хостами
      виключно через нашу платформу.
    </p>
  </div>
);

const Title = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <h2 className="text-[18px] font-semibold text-[#111820]">
    {children}
  </h2>
);

const Rule = ({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Clock3;
  title: string;
  value: string;
}) => (
  <div className="grid grid-cols-[20px_190px_minmax(0,1fr)] items-start gap-2 text-[13px]">
    <Icon
      size={17}
      strokeWidth={1.5}
      className="mt-[1px]"
    />

    <span className="font-semibold text-[#202A31]">
      {title}
    </span>

    <span className="text-[#414B52]">
      {value}
    </span>
  </div>
);

const RatingMetric = ({
  label,
  value,
}: RatingMetricItem) => {
  const normalized = Math.min(
    Math.max(value, 0),
    5
  );

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-[#414B52]">
        <span>{label}</span>

        <span className="font-medium">
          {normalized.toFixed(1)}
        </span>
      </div>

      <div className="mt-1 h-[4px] overflow-hidden rounded-full bg-[#D8DDE0]">
        <div
          className="h-full rounded-full bg-[#243C4E]"
          style={{
            width: `${(normalized / 5) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default HousingDetailsContent;